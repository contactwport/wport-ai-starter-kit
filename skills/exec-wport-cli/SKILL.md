---
name: exec-wport-cli
description: >-
  Operates the @wport/cli terminal tool for all wport API commands — public job
  search/view, config, doctor diagnostics, and enterprise job management. Use
  when the user mentions wport CLI, wport jobs, job search, enc_id, wport
  doctor, wport config, or wport enterprise.
---

# exec-wport-cli

Terminal interface to the W101 Talent Search Hub public API via [`@wport/cli`](https://www.npmjs.com/package/@wport/cli).

Install: `npm install -g @wport/cli` (requires Node.js >= 18.17)

## Install & diagnose

```bash
wport doctor
npm install -g @wport/cli   # if wport: command not found
```

`wport doctor` prints resolved config, connectivity probe, and known server behaviors. Exits `4` if server unreachable.

## Global flags (all commands)

| Flag | Default | Notes |
|------|---------|-------|
| `--lang <locale>` | config → `zh-TW` | `zh-TW`, `en-US`, `vi-VN`, `th-TH`, `id-ID` |
| `--api <url>` | `WPORT_API_BASE` → `https://api.wport.me` | http/https only |
| `--output <table\|json>` | `table` (TTY) / `json` (piped) | |
| `--timeout <ms>` | 10000 | |
| `--no-color` | auto via `NO_COLOR` | |

## Environment variables

| Variable | Effect |
|----------|--------|
| `WPORT_API_BASE` | Override API base URL |
| `WPORT_API_KEY` | Enterprise API key (`wpk_live_...`) |
| `NO_COLOR` | Disable colored output |

**Do not** persist `api_base_url` in config — use `WPORT_API_BASE` or `--api`.

## Exit codes

| Code | Meaning |
|------|---------|
| `0` | Success |
| `2` | Invalid arguments |
| `3` | Server 4xx |
| `4` | Server 5xx / network error |
| `5` | Config file corrupted |

## Rate limit

Public job search: **1200 requests/min/IP**. Do not run multi-process scrapers.

---

## Public jobs (read-only, no login)

### `wport jobs search [options]`

| Flag | Description |
|------|-------------|
| `-k, --keyword <text>` | Keyword search (title, company, etc.) |
| `-l, --location <code>` | Area code (repeatable, e.g. Taipei `6001001000`) |
| `-c, --category <code>` | Job classification code (repeatable) |
| `-p, --page <n>` | Page number (default 1) |
| `-s, --page-size <n>` | Page size (default 10, max 100) |
| `--json-query <file>` | Advanced: full query body from JSON file |
| `--fields <paths>` | JSON only: keep fields (comma-separated dotted paths) |
| `--minimal` | JSON only: shorthand for `enc_id,title,company_name,area_display,salary_display` |

`--fields` and `--minimal` are mutually exclusive. They filter client-side for token efficiency.

Sort order is **server-determined** (publish date desc for filters, relevance for keyword). No client `orderBy` support.

**Examples:**

```bash
# Interactive table
wport jobs search --keyword backend

# Agent-friendly JSON (pipe or explicit)
wport jobs search --keyword backend --minimal --output json

# Taipei backend jobs
wport jobs search --keyword backend --location 6001001000 --minimal --output json

# Custom field projection
wport jobs search --keyword backend --fields enc_id,title,company_name --output json
```

**Response shape:**

```json
{
  "success": true,
  "data": [{ "enc_id": "...", "title": "...", "company_name": "...", ... }],
  "currentPage": 1,
  "totalPages": 5,
  "pageSize": 10,
  "totalCount": 47
}
```

### `wport jobs view <enc_id> [options]`

Returns nested `JobViewVM`:

```
company_header_info.{ company_name, company_icon_url, enc_company_id, ... }
job_info.{ job_title, area_display, salary_display, experience_display, ... }
job_description                          # HTML rich text
job_information / recruitment_conditions / benefits / about_company
structured_data                          # JSON-LD
```

| Flag | Description |
|------|-------------|
| `--field <path>` | Single field as raw value (dotted path) |
| `--fields <paths>` | Selected fields as JSON object |
| `--batch` | Read enc_ids from stdin, emit ND-JSON per job |
| `--concurrency <n>` | Batch parallelism (default 5, max 20) |

`--field` and `--fields` are mutually exclusive.

**Examples:**

```bash
# Full job detail (for interviewer-ai company_info)
wport jobs view <enc_id> --output json

# Single field
wport jobs view <enc_id> --field job_info.salary_display

# Stdin
echo "<enc_id>" | wport jobs view -

# Batch pipeline
wport jobs search --keyword backend --fields enc_id --output json \
  | jq -r '.data[].enc_id' \
  | wport jobs view - --batch --field job_info.job_title
```

Batch mode emits one `{ enc_id, ok, data?, error? }` ND-JSON line per input. A single failure does not abort the run.

---

## Config

```bash
wport config path
wport config get
wport config set locale zh-TW
wport config set output json
wport config set timeout_ms 15000
```

Configurable keys: `locale`, `output`, `timeout_ms`. Config file is mode `0600`.

---

## Doctor

```bash
wport doctor
WPORT_API_BASE=http://localhost:3000 wport doctor
```

Use before debugging search/view failures.

---

## Enterprise (company API key)

Requires `wpk_live_...` key (issued offline). Isolated under `wport enterprise`.

### Auth

```bash
wport enterprise login      # prompts without echo; stored mode 600
wport enterprise whoami     # offline — never calls API
wport enterprise logout
```

Key resolution: `--api-key` flag > `WPORT_API_KEY` env > saved credentials.

**Never** echo or log full API keys. Show at most last 4 characters.

### Jobs

```bash
wport enterprise jobs list --status published
wport enterprise jobs view <enc_id>
WPORT_API_KEY=wpk_live_... wport enterprise jobs list --minimal --output json
```

---

## Agent workflow patterns

### Pattern A: Job search

```bash
wport jobs search --keyword <user_keyword> --minimal --output json
```

Use for browsing listings. For deep analysis, follow up with Pattern B on selected `enc_id` values.

### Pattern B: Job detail for interviewer-ai

```bash
wport jobs view <enc_id> --output json
```

Pass the full response as `{company_info}`.

### Pattern C: Search then drill down

```bash
wport jobs search --keyword backend --fields enc_id,title,company_name --output json
# User picks enc_id →
wport jobs view <enc_id> --output json
```

## Guardrails

1. Prefer `--minimal` or `--fields` to reduce LLM token usage.
2. Use `--output json` when piping or feeding agent skills.
3. Run `wport doctor` if commands fail with exit code 4.
4. Never spin up parallel scrapers across multiple processes.
5. Enterprise keys: prefer `WPORT_API_KEY` env in CI; never commit keys.
6. Pre-1.0 CLI (`0.x.y`): pin version in production scripts (`@wport/cli@0.2.1`).

## Troubleshooting

| Symptom | Action |
|---------|--------|
| `wport: command not found` | `npm install -g @wport/cli` |
| Exit code 4 | `wport doctor`; check network / `WPORT_API_BASE` |
| Exit code 3 | Invalid enc_id or bad query — verify args |
| Empty search results | Broaden keyword; check `--location` area code |
| Rate limited | Slow down; single-process only |

## Compatibility

Tracks `api.wport.me` public endpoints:

- `GET /api/jobs/search`
- `GET /api/jobs/{encId}/view`

Pre-1.0: API and CLI may change without strict semver. Pin CLI version in automation.
