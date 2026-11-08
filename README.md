# @aaddyy/mcp-server

MCP server for [AADDYY](https://www.aaddyy.com) — use 50+ AI tools (auto-discovered from the live catalog) directly from Cursor, Claude Code, Windsurf, and any MCP-compatible client.

## Install

### Claude Code

```bash
claude mcp add aaddyy --env AADDYY_API_KEY=aip_your_key_here -- npx -y @aaddyy/mcp-server
```

### Cursor

Add to `.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "aaddyy": {
      "command": "npx",
      "args": ["-y", "@aaddyy/mcp-server"],
      "env": {
        "AADDYY_API_KEY": "aip_your_key_here"
      }
    }
  }
}
```

> A one-click "Add to Cursor" deeplink is coming soon.

### Windsurf

Add to `~/.codeium/windsurf/mcp_config.json` (or `.windsurf/mcp.json`):

```json
{
  "mcpServers": {
    "aaddyy": {
      "command": "npx",
      "args": ["-y", "@aaddyy/mcp-server"],
      "env": {
        "AADDYY_API_KEY": "aip_your_key_here"
      }
    }
  }
}
```

## Get an API key

**Dashboard:** sign up at [aaddyy.com](https://www.aaddyy.com/signup) (50 free credits, no card needed) and create a key at [aaddyy.com/api-keys](https://www.aaddyy.com/api-keys). Keys start with `aip_`.

**curl-first (no browser):**

```bash
# 1. Register with just an email
curl -X POST https://backend.aaddyy.com/api/auth/quick-register \
  -H 'Content-Type: application/json' \
  -d '{"email": "you@example.com"}'

# 2. Verify via emailed OTP
curl -X POST https://backend.aaddyy.com/api/auth/send-otp \
  -H 'Content-Type: application/json' \
  -d '{"email": "you@example.com"}'

curl -X POST https://backend.aaddyy.com/api/auth/verify-otp \
  -H 'Content-Type: application/json' \
  -d '{"email": "you@example.com", "otp": "123456"}'

# 3. Create an API key (use the JWT from the previous step)
curl -X POST https://backend.aaddyy.com/api/users/api-keys \
  -H 'Authorization: Bearer <jwt>' \
  -H 'Content-Type: application/json' \
  -d '{"name": "my-mcp-key"}'
```

## What it does

When you add this MCP server, your AI agent can:
- Generate articles, essays, emails
- Create images, logos, headshots
- Generate videos
- Solve math and physics problems
- Analyze SEO, research keywords
- And dozens more tools

All tools are dynamically loaded from the AADDYY API — when new tools are added, they appear automatically. The live catalog: [GET /api/documentation/tools](https://backend.aaddyy.com/api/documentation/tools).

## Use it

Just ask your AI agent:
- "Generate an article about AI trends"
- "Create a logo for my startup"
- "Solve this math problem: integrate x^2 from 0 to 5"

The agent will use AADDYY tools automatically. Async (V2) tools are handled for you — the server submits the job and polls until the result is ready.

## Pricing

Pay-per-use: 1 credit = $0.01. Each tool's price is in the [live catalog](https://backend.aaddyy.com/api/documentation/tools) (`credits`, `priceFrom`).
New accounts get 50 free credits ($0.50).

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AADDYY_API_KEY` | Yes | — | Your API key (starts with `aip_`) |
| `AADDYY_BASE_URL` | No | `https://backend.aaddyy.com/api` | API base URL |

## Links

- [AADDYY](https://www.aaddyy.com)
- [Get API Key](https://www.aaddyy.com/api-keys)
- [llms.txt](https://backend.aaddyy.com/llms.txt) — machine-readable tool catalog for LLMs
- [openapi.json](https://backend.aaddyy.com/openapi.json) — OpenAPI 3.0 spec
- [API Docs](https://backend.aaddyy.com/api-docs/)
- [Developer Portal](https://www.aaddyy.com/developer)
