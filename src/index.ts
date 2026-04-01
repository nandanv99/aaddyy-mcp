#!/usr/bin/env node

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

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerAllTools } from './tools.js';

async function main() {
  const server = new McpServer({
    name: 'aaddyy',
    version: '1.0.0',
  });

  // Dynamically register all AADDYY tools from the backend API
  const toolCount = await registerAllTools(server);
  console.error(`[aaddyy-mcp] Registered ${toolCount} tools from AADDYY API`);

  // Connect via stdio (standard MCP transport)
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[aaddyy-mcp] Server running on stdio');
}

main().catch((err) => {
  console.error('[aaddyy-mcp] Fatal error:', err.message);
  process.exit(1);
});
