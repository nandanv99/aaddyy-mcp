# AGENTS.md — @aaddyy/mcp-server

Instructions for coding agents working with or on this package.

## What this is

A stdio MCP server (npm: `@aaddyy/mcp-server`, bin: `aaddyy-mcp`) that exposes the AADDYY AI-tools API to MCP clients. At startup it fetches the live catalog (50+ tools) from `GET https://backend.aaddyy.com/api/documentation/tools` and registers each active tool dynamically — there is no hardcoded tool list. Machine-readable API overview: https://backend.aaddyy.com/llms.txt

## Auth

- API keys start with `aip_` and are created at https://www.aaddyy.com/api-keys or with `POST /api/users/api-keys`. An unverified account can hold one key, with limits: it expires, and it has a lower rate limit and a spend cap. Verifying the email lifts them.
- Every API request sends `Authorization: Bearer aip_<key>`.
- The server reads the key from the `AADDYY_API_KEY` env var and exits if it is missing.

## Base URL

`https://backend.aaddyy.com/api` (override with `AADDYY_BASE_URL`).

## V1 (sync) vs V2 (async)

- **V1**: `POST {tool.endpoint}` (e.g. `/api/ai/article`) — result in the response body.
- **V2**: `POST /api/v2/ai/<tool>` → `202 { jobId, pollUrl }` → poll `GET /api/v2/ai/jobs/:jobId` until `status` is `completed` (result in `result`) or `failed` (message in `error`). This server polls every 2s, max 600s.
- Which tools go through V2 is controlled by the `V2_TOOL_IDS` set in `src/tools.ts`. If a V2 tool is missing from that set, it gets called as V1 and returns a bare `{ jobId }` instead of the result — add its tool ID to the set and rebuild (`npx tsc`).

## Credits

- 1 credit = $0.01. Catalog `pricing.basePrice` is in USD (e.g. `0.05` = 5 credits).
- Insufficient balance → HTTP 402, code `INSUFFICIENT_CREDITS`, with `details: { required, available }`.

## Repo layout

- `src/index.ts` — entry point: creates `McpServer`, registers tools, connects stdio.
- `src/client.ts` — HTTP: `fetchTools()`, `callTool()` (V1), `callToolV2()` (submit + poll).
- `src/tools.ts` — dynamic registration, Zod schema building, `V2_TOOL_IDS`.
- Build with `npx tsc` (outputs to `dist/`); run in dev with `npm run dev`.

## References

- Live tool catalog: https://backend.aaddyy.com/api/documentation/tools
- llms.txt: https://backend.aaddyy.com/llms.txt
- OpenAPI: https://backend.aaddyy.com/openapi.json

## When a new backend tool is added

Tools are discovered dynamically from the backend catalog
(`GET https://backend.aaddyy.com/api/documentation/tools`) at startup — a new
tool appears here automatically once it's seeded on the backend. **No code
change is needed to expose a new tool.**

**One exception (this repo only):** if the new tool is a **V2 async** tool, add
its tool ID to the `V2_TOOL_IDS` set in `src/tools.ts` and run `npx tsc`, so this
stdio server uses the submit-and-poll path. (The backend's *remote* MCP server
and A2A endpoint always use V2 internally, so they need no change.) Full flow:
`aaddyy-backend/CLAUDE.md` → "Adding a New Tool".
