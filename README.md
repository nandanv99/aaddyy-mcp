# @aaddyy/mcp-server

MCP server for [AADDYY](https://www.aaddyy.com) — use 100+ AI tools directly from Cursor, Claude Code, Windsurf, and any MCP-compatible client.

## What it does

When you add this MCP server, your AI agent can:
- Generate articles, essays, emails
- Create images, logos, headshots
- Generate videos
- Solve math and physics problems
- Analyze SEO, research keywords
- And 90+ more tools

All tools are dynamically loaded from the AADDYY API — when new tools are added, they appear automatically.

## Quick Setup

### 1. Get an API key

Sign up at [aaddyy.com](https://www.aaddyy.com/signup) (50 free credits, no card needed) and create an API key at [aaddyy.com/api-keys](https://www.aaddyy.com/api-keys).

### 2. Add to your editor

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "aaddyy": {
      "command": "npx",
      "args": ["@aaddyy/mcp-server"],
      "env": {
        "AADDYY_API_KEY": "aip_your_key_here"
      }
    }
  }
}
```

**Claude Code** (`~/.claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "aaddyy": {
      "command": "npx",
      "args": ["@aaddyy/mcp-server"],
      "env": {
        "AADDYY_API_KEY": "aip_your_key_here"
      }
    }
  }
}
```

**Windsurf** (`.windsurf/mcp.json`):
```json
{
  "mcpServers": {
    "aaddyy": {
      "command": "npx",
      "args": ["@aaddyy/mcp-server"],
      "env": {
        "AADDYY_API_KEY": "aip_your_key_here"
      }
    }
  }
}
```

### 3. Use it

Just ask your AI agent:
- "Generate an article about AI trends"
- "Create a logo for my startup"
- "Solve this math problem: integrate x^2 from 0 to 5"

The agent will use AADDYY tools automatically.

## Pricing

Pay-per-use. 1 credit = $0.01. Most tools cost 1-10 credits.
New accounts get 50 free credits ($0.50).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AADDYY_API_KEY` | Yes | — | Your API key (starts with `aip_`) |
| `AADDYY_BASE_URL` | No | `https://backend.aaddyy.com/api` | API base URL |

## Links

- [AADDYY](https://www.aaddyy.com)
- [Get API Key](https://www.aaddyy.com/api-keys)
- [API Docs](https://backend.aaddyy.com/api-docs/)
- [Developer Portal](https://www.aaddyy.com/developer)
