---
name: exec-analytics-mcp
description: >-
  Configure and use the Google Analytics MCP server (analytics-mcp) for GA4
  reports, property lookup, and realtime metrics. Use when the user mentions
  Google Analytics, GA4, analytics MCP, traffic reports, or conversion funnels.
---

# Google Analytics MCP

Upstream: [googleanalytics/google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp)

This skill covers **MCP server setup** and **when to call which tool**. The server runs via pipx — not bundled in this repo.

## Prerequisites

- Python 3.10+
- [pipx](https://pipx.pypa.io/stable/#install-pipx)
- Google Cloud project with APIs enabled:
  - Google Analytics Admin API
  - Google Analytics Data API
- Application Default Credentials with scope:
  `https://www.googleapis.com/auth/analytics.readonly`

## Credentials (one-time)

```bash
gcloud auth application-default login \
  --scopes https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform \
  --client-id-file=YOUR_CLIENT_JSON_FILE
```

Note the path printed: `Credentials saved to file: [PATH_TO_CREDENTIALS_JSON]`

## Cursor / Claude MCP config

Add to your MCP settings (adjust paths):

```json
{
  "mcpServers": {
    "analytics-mcp": {
      "command": "pipx",
      "args": ["run", "analytics-mcp"],
      "env": {
        "GOOGLE_APPLICATION_CREDENTIALS": "PATH_TO_CREDENTIALS_JSON",
        "GOOGLE_PROJECT_ID": "YOUR_PROJECT_ID"
      }
    }
  }
}
```

Claude Code equivalent:

```bash
claude mcp add analytics-mcp \
  --scope user \
  -e "GOOGLE_APPLICATION_CREDENTIALS=PATH_TO_CREDENTIALS_JSON" \
  -e "GOOGLE_PROJECT_ID=YOUR_PROJECT_ID" \
  -- pipx run analytics-mcp
```

## Available MCP tools

| Tool | Use when |
|------|----------|
| `get_account_summaries` | List GA accounts and properties — **start here** |
| `get_property_details` | Deep-dive one property |
| `list_google_ads_links` | Ads linkage for a property |
| `run_report` | Standard GA4 reports (sessions, events, dimensions) |
| `run_funnel_report` | Funnel / conversion paths |
| `run_realtime_report` | Live users and events |
| `get_custom_dimensions_and_metrics` | Property-specific custom fields |

## Agent workflow

1. Call `get_account_summaries` if property ID is unknown.
2. Confirm date range and metrics with the user before `run_report`.
3. Prefer explicit dimensions (e.g. `pagePath`, `eventName`, `sessionDefaultChannelGroup`).
4. Summarize in plain language; attach tables only when useful.

## Sample user prompts

- 「過去 90 天哪個活動轉換率最高？」
- 「列出這個 GA4 property 的 custom dimensions」
- 「即時有多少人正在站上？」

## Troubleshooting

| Error | Fix |
|-------|-----|
| 403 / insufficient scope | Re-run ADC login with `analytics.readonly` scope |
| Property not found | Verify user has Viewer+ on the GA4 property |
| pipx not found | Install pipx; or `pipx install analytics-mcp` |

## Safety

- Read-only scope only — this MCP does not mutate GA config.
- Do not paste credential JSON into chat or commit it to the repo.
