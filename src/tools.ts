/**
 * Dynamic tool registration — fetches all tools from AADDYY backend
 * and registers them as MCP tools. New tools appear automatically.
 */

import { z } from 'zod';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { fetchTools, callTool, callToolV2, type ToolDocumentation } from './client.js';

// Tools that use V2 async job queue (submit → poll)
const V2_TOOL_IDS = new Set([
  'ai-background-remover',
  'ai-nano-banana-2',
  'ai-image-prompt-creator',
  'ai-prompt-maker',
  'ai-upscale-image',
  'ai-watermark-remover',
  'ai-instagram-post-generator',
  'ai-linkedin-post-generator',
  'ai-thread-generator',
  'ai-product-photo-studio',
  'ai-research-blog-writer',
  'ai-content-curator',
  'ai-pdf-merge',
  'ai-edu-clip-generator',
  'ai-audio-to-video',
  'ai-seedance-video-generator',
  'ai-ghibli-generator',
  'ai-qr-code-generator',
  'ai-face-swapper',
  'ai-humanizer',
  'ai-grammar-checker',
  'ai-paraphraser',
  'ai-detector',
  'ai-action-figure',
  'ai-cover-letter-creator',
  'ai-cv-resume-creator',
  'ai-wedding-invitation-card-maker',
  'ai-festival-greeting-card-maker',
  'ai-baby-card-maker',
  'ai-greeting-card-maker',
  'ai-card-animator',
  'ai-brand-guideline-kit',
  'ai-logo-creator',
]);

/**
 * The cost shown in a tool's description. The catalog's `credits` is the
 * cheapest valid use from the backend's own price functions; `basePrice`
 * alone is wrong for tools priced by length, quality or count. The catalog's
 * pricingNote says "free", starts with "flat price" for one fixed price, and
 * otherwise describes how the price grows with the inputs.
 */
export function costLabel(tool: Pick<ToolDocumentation, 'credits' | 'pricingNote' | 'pricing'>): string {
  const note = typeof tool.pricingNote === 'string' ? tool.pricingNote.trim().toLowerCase() : '';
  if (typeof tool.credits === 'number' && Number.isFinite(tool.credits)) {
    if (tool.credits === 0 || note === 'free') return ' (free)';
    const amount = `${tool.credits} credit${tool.credits === 1 ? '' : 's'}`;
    if (note.startsWith('flat price')) return ` (${amount})`;
    return note ? ` (from ${amount})` : ` (~${amount})`;
  }
  // Older backends publish only basePrice.
  return tool.pricing?.basePrice ? ` (~${Math.round(tool.pricing.basePrice * 100)} credits)` : '';
}

/**
 * Map a validation type string to a Zod schema.
 */
function typeToZod(validation?: { type?: string; enum?: string[]; description?: string; default?: unknown }): z.ZodTypeAny {
  if (validation?.enum) {
    return z.enum(validation.enum as [string, ...string[]]).describe(validation.description || '');
  }
  switch (validation?.type) {
    case 'number':
    case 'integer':
      return z.number().describe(validation.description || '');
    case 'boolean':
      return z.boolean().describe(validation.description || '');
    case 'array':
      return z.array(z.string()).describe(validation.description || '');
    default:
      return z.string().describe(validation?.description || '');
  }
}

/**
 * Build a Zod input schema from tool parameter definitions.
 */
function buildInputSchema(tool: ToolDocumentation): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {};

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
function toMcpName(toolId: string): string {
  return 'aaddyy_' + toolId.replace(/^ai-/, '').replace(/-/g, '_');
}

/**
 * Derive V2 path from endpoint: /api/ai/nano-banana-2 → /nano-banana-2
 */
function toV2Path(endpoint: string): string {
  return endpoint.replace(/^\/api\/ai/, '');
}

/**
 * Fetch tools from backend and register each as an MCP tool.
 */
export async function registerAllTools(server: McpServer): Promise<number> {
  const tools = await fetchTools();
  let count = 0;

  for (const tool of tools) {
    const mcpName = toMcpName(tool.id);
    const isV2 = V2_TOOL_IDS.has(tool.id);
    const costStr = costLabel(tool);

    const inputSchema = buildInputSchema(tool);

    server.tool(
      mcpName,
      `${tool.description}${costStr}`,
      inputSchema,
      async (args) => {
        try {
          let result: unknown;

          if (isV2) {
            result = await callToolV2(toV2Path(tool.endpoint), args as Record<string, unknown>);
          } else {
            const method = tool.methods?.[0] || 'POST';
            result = await callTool(tool.endpoint, method, args as Record<string, unknown>);
          }

          return {
            content: [
              {
                type: 'text' as const,
                text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
              },
            ],
          };
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : String(err);
          return {
            content: [{ type: 'text' as const, text: `Error: ${message}` }],
            isError: true,
          };
        }
      }
    );

    count++;
  }

  return count;
}
