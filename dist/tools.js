"use strict";
/**
 * Dynamic tool registration — fetches all tools from AADDYY backend
 * and registers them as MCP tools. New tools appear automatically.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAllTools = registerAllTools;
const zod_1 = require("zod");
const client_js_1 = require("./client.js");
// Tools that use V2 async job queue (submit → poll)
const V2_TOOL_IDS = new Set([
    'ai-nano-banana-2',
    'ai-image-prompt-creator',
    'ai-prompt-maker',
    'ai-upscale-image',
    'ai-watermark-remover',
    'ai-instagram-post-generator',
    'ai-linkedin-post-generator',
    'ai-product-photo-studio',
    'ai-research-blog-writer',
    'ai-content-curator',
    'ai-pdf-merge',
    'ai-edu-clip-generator',
    'ai-audio-to-video',
]);
/**
 * Map a validation type string to a Zod schema.
 */
function typeToZod(validation) {
    if (validation?.enum) {
        return zod_1.z.enum(validation.enum).describe(validation.description || '');
    }
    switch (validation?.type) {
        case 'number':
        case 'integer':
            return zod_1.z.number().describe(validation.description || '');
        case 'boolean':
            return zod_1.z.boolean().describe(validation.description || '');
        case 'array':
            return zod_1.z.array(zod_1.z.string()).describe(validation.description || '');
        default:
            return zod_1.z.string().describe(validation?.description || '');
    }
}
/**
 * Build a Zod input schema from tool parameter definitions.
 */
function buildInputSchema(tool) {
    const shape = {};
    for (const param of tool.parameters.required || []) {
        const v = tool.parameters.validation?.[param];
        shape[param] = typeToZod(v);
    }
    for (const param of tool.parameters.optional || []) {
        const v = tool.parameters.validation?.[param];
        let schema = typeToZod(v);
        if (v?.default !== undefined) {
            schema = schema.default(v.default);
        }
        shape[param] = schema.optional();
    }
    return shape;
}
/**
 * Convert tool ID to MCP tool name: ai-article-generator → aaddyy_article_generator
 */
function toMcpName(toolId) {
    return 'aaddyy_' + toolId.replace(/^ai-/, '').replace(/-/g, '_');
}
/**
 * Derive V2 path from endpoint: /api/ai/nano-banana-2 → /nano-banana-2
 */
function toV2Path(endpoint) {
    return endpoint.replace(/^\/api\/ai/, '');
}
/**
 * Fetch tools from backend and register each as an MCP tool.
 */
async function registerAllTools(server) {
    const tools = await (0, client_js_1.fetchTools)();
    let count = 0;
    for (const tool of tools) {
        const mcpName = toMcpName(tool.id);
        const isV2 = V2_TOOL_IDS.has(tool.id);
        const credits = tool.pricing?.basePrice
            ? Math.round(tool.pricing.basePrice * 100)
            : null;
        const costStr = credits !== null ? ` (~${credits} credits)` : '';
        const inputSchema = buildInputSchema(tool);
        server.tool(mcpName, `${tool.description}${costStr}`, inputSchema, async (args) => {
            try {
                let result;
                if (isV2) {
                    result = await (0, client_js_1.callToolV2)(toV2Path(tool.endpoint), args);
                }
                else {
                    const method = tool.methods?.[0] || 'POST';
                    result = await (0, client_js_1.callTool)(tool.endpoint, method, args);
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                        },
                    ],
                };
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                return {
                    content: [{ type: 'text', text: `Error: ${message}` }],
                    isError: true,
                };
            }
        });
        count++;
    }
    return count;
}
//# sourceMappingURL=tools.js.map