# wport Personal Website Template

## 這個資料夾裡還有

| 資料夾 | 是什麼 |
|---|---|
| [`personal/`](personal/README.md) | 個人網站範本（Vibe Coding 課，Eric 的資料當範例） |
| [`shop/`](shop/README.md) | 店家形象官網範本（品牌行銷課，竹籬笆咖啡當範例） |
| `examples/output/` | 用 `render.mjs` 做出來的範例成品（cute、terminal 兩種主題） |

**Personal website / portfolio template** for wport-ai-starter-kit — one JSON schema, two standalone-HTML themes.

| Asset | Purpose |
|-------|---------|
| This README | JSON schema, themes, render rules |
| `render.mjs` | `website.json` → standalone HTML (pick a theme) |
| `cute.css` | **Cute** theme — soft pastel, rounded, playful |
| `terminal.css` | **Terminal** theme — dark bash shell, monospace, cool |
| `examples/website.json` | Sample data |

Unlike the résumé (which mirrors the wport GUI schema), this is a free-form personal landing page — built from your SSOT / `about-me`.

## Themes

| Theme | Vibe | Best for |
|-------|------|----------|
| `cute` | Pastel gradients, rounded cards, emoji, a waving hello | designers, students, friendly personal brand |
| `terminal` | Dark window with traffic lights, `user@wport:~$` prompts, typed commands, blinking cursor | engineers, anyone who wants a "hacker" feel |

Each is a **full multi-section site** — sticky header nav, a hero, and separate
`關於我 / 技能 / 作品 / 經歷 / 聯絡` sections with anchor scrolling (not a one-page card stack).
Sections only appear when the JSON has data for them, and the nav is generated to match.

Both output a **single self-contained `.html` file** (inline CSS, wport favicon, Google Fonts) — open it locally or deploy with `vercel deploy`.

## Render (required — do not hand-author HTML)

```bash
node templates/website/render.mjs <input.json> <output.html> --theme=cute
node templates/website/render.mjs <input.json> <output.html> --theme=terminal
```

`--theme` defaults to `cute`. Omit the output path to print HTML to stdout.

**Default paths:**

| File | Path |
|------|------|
| `website.json` | `doc/website/website.json` |
| Cute HTML | `doc/website/website-cute.html` |
| Terminal HTML | `doc/website/website-terminal.html` |

Example:

```bash
node templates/website/render.mjs doc/website/website.json doc/website/website-cute.html --theme=cute
node templates/website/render.mjs doc/website/website.json doc/website/website-terminal.html --theme=terminal
```

## JSON schema (`website.json`)

```typescript
{
  name: string                 // 顯示名稱
  handle?: string              // terminal 主題的 user（user@wport），預設取 name
  tagline?: string             // 一句話自我介紹
  location?: string            // 例 "台北市, 台灣"
  avatar_url?: string          // 大頭照網址（cute 主題；留空顯示字首圓章）
  accent?: string              // 主色，預設 wport 青綠 #56C7BB

  about?: string | string[]    // 自我介紹；字串以空行分段，或直接給段落陣列

  highlights?: Array<{ value: string; label: string }>   // 關於我區的數字亮點，例 { "3+ 年", "後端經驗" }

  skills?: string[]            // 技能標籤

  projects?: Array<{
    name: string
    description?: string
    url?: string               // 連結（可省略；mailto:/tel: 也可）
    emoji?: string             // cute 主題的小圖示，預設 🌟
    tags?: string[]            // 技術標籤
  }>

  experience?: Array<{
    role: string
    company?: string
    period?: string            // 例 "2022 - 至今"
    summary?: string
  }>

  links?: Array<{ label: string; url: string }>   // GitHub / Email / wport...
}
```

All fields optional except `name`. A section is rendered only when it has data.

## Workflow

1. Keep `ssot/個人/about-me.md` (or equivalent Obsidian SSOT) as the source of truth. Prefer filling it via [`skills/gen-resume`](../../skills/gen-resume/SKILL.md) interview → Obsidian handoff; do **not** expect `gen-resume` to render the site.
2. Map SSOT → `doc/website/website.json`, then render with a **website-build skill** (or manually with the commands below).
3. Open / deploy the HTML. To publish: see [`skills/exec-vercel-cli`](../../skills/exec-vercel-cli/).

When you add fields here, update `render.mjs` **and** both CSS files together.
