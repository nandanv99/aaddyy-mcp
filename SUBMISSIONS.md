# Distribution playbook — where to list AADDYY's MCP servers

Two artifacts to list:
- **Remote (lead):** `https://backend.aaddyy.com/mcp` — Streamable HTTP, stateless. Keyless discovery
  (search_tools/get_tool_schema/create_account); `?apiKey=aip_...` for full access.
- **Local (fallback):** `@aaddyy/mcp-server` on npm (stdio, AADDYY_API_KEY env).

> Prerequisite for everything below: the backend deploy that serves /mcp must be LIVE.
> Verify first: `curl -s -X POST https://backend.aaddyy.com/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`

## 1. Official MCP registry (do first — upstream of GitHub registry, PulseMCP, VS Code)
```bash
brew install mcp-publisher
cd aaddyy-mcp
# server.json is already in this repo — review version fields first
mcp-publisher login dns --domain=aaddyy.com --private-key=<HEX>   # prints the TXT record to add:
#   aaddyy.com. IN TXT "v=MCPv1; k=ed25519; p=<PUBLIC_KEY>"
# (generate: openssl genpkey -algorithm Ed25519; add TXT in the DNS panel; wait for propagation)
mcp-publisher publish
```
Alternative namespace (no DNS needed): `mcp-publisher login github` → publishes as `io.github.adivyas99/aaddyy-mcp`.

## 2. Directories requiring only a form (≈20–60 min each)
- **Smithery** — smithery.ai, publisher account; `smithery.yaml` is in this repo.
- **PulseMCP** — pulsemcp.com → Submit.
- **mcp.so** — mcp.so/submit (independent; does NOT auto-pull the official registry).
- **Glama** — auto-indexes the public GitHub repo; claim the listing at glama.ai and fill the description
  (currently rated "C" for maintenance — fresh publish + README fixes that).
- **Cursor** — cursor.directory/plugins/new + PR to github.com/cursor/mcp-servers. Add the one-click
  deeplink to README: `cursor://anysphere.cursor-deeplink/mcp/install?name=aaddyy&config=<base64>`
- **awesome-mcp-servers** — PR to github.com/punkpeye/awesome-mcp-servers.
- **Docker MCP Catalog** — PR servers/aaddyy/server.yaml to github.com/docker/mcp-registry (builds a
  signed image, lands in Docker Desktop ~24h after approval).

## 3. Claude connectors directory (needs a claude.ai TEAM/ENTERPRISE org)
Portal: claude.ai → admin settings → directory → submissions. Requirements checklist:
- [x] Remote Streamable HTTP over https  ← shipped
- [x] Tool `title` + readOnlyHint/destructiveHint annotations  ← shipped
- [ ] OAuth 2.0 (DCR or CIMD) — P2 work; "authless/static-header" beta mode may be accepted meanwhile
- [ ] Privacy policy URL on aaddyy.com (immediate rejection without it)
- [ ] Reviewer test account with credits pre-loaded
- [ ] Icon, 55-char tagline, ≤2000-char description, 3–5 screenshots ≥1000px
- [ ] 7 policy acknowledgments (financial-transactions + AI-media-generation apply)
Escalation: mcp-review@anthropic.com

## 4. ChatGPT App Directory (verified OpenAI developer account)
developers.openai.com (Apps SDK, docs now under /plugins) — needs: the remote MCP, 64×64 icon <5KB,
30-char name, privacy policy + support contact, screenshots, test cases passing on web AND mobile.
Review 5–10 business days. Feature the demo-able tools (logo, image, article, math).

## 5. Before ANY npm republish
`npx tsc` in this repo and aaddyy-sdk — dist/ is stale (still carries pre-hygiene strings).
Bump versions, update server.json/packages[].version to match.
