#!/usr/bin/env node
"use strict";
/**
 * AADDYY MCP Server
 *
 * Exposes 100+ AADDYY AI tools to Cursor, Claude Code, Windsurf, and any MCP-compatible client.
 * Tools are dynamically loaded from the AADDYY API at startup — no hardcoding.
 *
 * Setup:
 *   AADDYY_API_KEY=aip_your_key npx @aaddyy/mcp-server
 *
 * Or add to your MCP client config:
 *   {
 *     "mcpServers": {
 *       "aaddyy": {
 *         "command": "npx",
 *         "args": ["@aaddyy/mcp-server"],
 *         "env": { "AADDYY_API_KEY": "aip_your_key" }
 *       }
 *     }
 *   }
 */
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const tools_js_1 = require("./tools.js");
async function main() {
    const server = new mcp_js_1.McpServer({
        name: 'aaddyy',
        version: '1.0.0',
    });
    // Dynamically register all AADDYY tools from the backend API
    const toolCount = await (0, tools_js_1.registerAllTools)(server);
    console.error(`[aaddyy-mcp] Registered ${toolCount} tools from AADDYY API`);
    // Connect via stdio (standard MCP transport)
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('[aaddyy-mcp] Server running on stdio');
}
main().catch((err) => {
    console.error('[aaddyy-mcp] Fatal error:', err.message);
    process.exit(1);
});
//# sourceMappingURL=index.js.map