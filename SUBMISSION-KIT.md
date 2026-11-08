# AADDYY submission kit — copy-paste field values

Everything a directory form asks for, pre-written, so listing AADDYY takes minutes.
Process/URLs for each channel live in `SUBMISSIONS.md`; this file is the *content* you paste in.

> Do the listings in the order in the promotion playbook. The values below were written on 2026-08-26; the counts were checked again on 2026-11-08 (55 active tools).

---

## Core facts (reuse everywhere)

| Field | Value |
|---|---|
| **Name** | AADDYY |
| **Website** | https://www.aaddyy.com |
| **API base** | https://backend.aaddyy.com/api |
| **MCP server (remote)** | https://backend.aaddyy.com/mcp |
| **MCP package (npm)** | @aaddyy/mcp-server |
| **Docs for agents** | https://backend.aaddyy.com/llms.txt |
| **Agent onboarding** | https://backend.aaddyy.com/docs/ai-onboarding |
| **OpenAPI** | https://backend.aaddyy.com/openapi.json |
| **Category** | AI tools / developer API / agent tools |
| **Pricing** | Pay-per-use, 1 credit = $0.01, free credits on signup, no card |
| **Tags** | ai-tools, api, mcp, ai-agents, image-generation, content-generation, seo, pay-per-use, x402 |
| **Contact** | hello@aaddyy.com |

---

## Taglines (pick by length limit)

- **≤ 40 chars:** `50+ AI tools, one API agents can pay for`
- **≤ 60 chars:** `The API platform AI agents can sign up and pay for alone`
- **≤ 80 chars:** `50+ outcome-level AI tools behind one pay-per-use API — built for AI agents`

---

## Descriptions

**Short (≤ 160 chars):**
> AADDYY is one API for 50+ outcome-level AI tools (articles, logos, resumes, images, video, SEO). Pay-per-use, free credits, no card. Remote MCP + zero-click agent payments.

**Medium (≤ 400 chars):**
> AADDYY gives AI agents 50+ outcome-level tools — article and resume writing, logo and image generation, video, SEO analysis, and more — behind a single pay-per-use REST API (1 credit = $0.01, free credits on signup, no card). It ships a remote MCP server with keyless discovery, curl-first llms.txt docs, OAuth 2.1, a JS SDK (npm `aaddyy`), and x402 zero-click USDC payments so an agent can discover, sign up, call tools, and pay for itself with no human in the loop.

**Long / "About" (paste-ready):**
> AADDYY is an agent-first AI-tools platform. Instead of raw models, it exposes 50+ *outcome-level* tools — one call returns a finished deliverable (a logo, a resume, an SEO report, a generated image or video) at a flat, predictable price. Everything is designed so an autonomous AI agent can adopt it end-to-end: sign up with a single API call, receive a bounded API key that works before email verification, call any tool over REST or the remote MCP server (with keyless discovery and a create_account tool), retry safely with idempotency keys, and pay for its own usage via a Stripe checkout link or x402 zero-click USDC — no human required beyond, at most, one approval click. Docs are curl-first (llms.txt, llms-full.txt, machine-readable error pages). Pricing is pay-per-use: 1 credit = $0.01, with free credits on signup and no card required.

---

## Per-directory paste values

### AI Agents Directory — aiagentsdirectory.com/submit-agent
- Name: `AADDYY`
- URL: `https://www.aaddyy.com`
- Category: `Developer Tools` (or `AI APIs` if present)
- Description: use the **Medium** description above
- Tags: `ai-tools, api, mcp, ai-agents, pay-per-use, image-generation, seo`
- (Optional $29 SEO Boost = permanent do-follow link — worth it here.)

### Smithery — smithery.ai/servers/new
- Server name: `AADDYY`
- Package: `@aaddyy/mcp-server`
- Remote URL: `https://backend.aaddyy.com/mcp`
- Description: use the **Short** description
- Auth note: `API key via ?apiKey=aip_... or Authorization: Bearer; keyless discovery + create_account tool work with no key`
- (A `smithery.yaml` is already in the aaddyy-mcp repo.)

### Glama — glama.ai ("Add Server")
- Auto-indexes the public GitHub repo (github.com/nandanv99/aaddyy-mcp); claim the listing. Description: **Short**.

### mcp.so — mcp.so/submit
- Name `AADDYY`, repo URL, remote URL `https://backend.aaddyy.com/mcp`, description **Short**.

### awesome-mcp-servers — PR to github.com/punkpeye/awesome-mcp-servers
- Use the exact one-line entry in `aaddyy-mcp/SUBMISSION-KIT` companion file `awesome-mcp-entry.md` from your content pack (already formatted to their spec, Aggregators section, alphabetical).

### llms.txt directories — llmstxt.site/submit · directory.llmstxt.cloud · llmstxthub.com
- llms.txt URL: `https://backend.aaddyy.com/llms.txt`
- llms-full.txt URL: `https://backend.aaddyy.com/llms-full.txt`
- Name/desc: `AADDYY` + **Short** description.

### Product Hunt — producthunt.com/launch
- Name `AADDYY`, tagline **≤60**, description **Medium**, category `AI Agents` + `Developer Tools`.
- First maker comment: use the Product Hunt block in your content pack (`directory-copy.md`).

### G2 / AlternativeTo / Show HN
- Ready-to-paste copy is in your content pack (`directory-copy.md`) — short + long G2, AlternativeTo entry + tags, and the Show HN title + body.

---

## What to say the differentiator is (every listing should lead with one of these)

1. **Agents can sign up and pay for it themselves** — bounded instant key, x402 zero-click USDC.
2. **Outcome-level, not raw models** — one call = one finished deliverable at a flat price.
3. **50+ tools behind one key** — vs wiring up a dozen separate APIs.

---
_Kept in sync with the live catalog (55 active tools on 2026-11-08). If the tool count changes, update the numbers above and in llms.txt (auto-generated)._
