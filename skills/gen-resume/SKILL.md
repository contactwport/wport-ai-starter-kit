---
name: gen-resume
description: >-
  Create or edit a wport resume and deliver HTML that matches the wport website
  preview. Use when the user wants to build, update, or convert a resume for
  wport job matching, interview prep, or local preview identical to wport online.
  Agent also writes resume.json internally for other skills.
---

# gen-resume

Build a wport-standard resume and deliver **`resume.html`** — the user-facing output that matches the wport website preview.

Read the format contract first: [`templates/resume/README.md`](../../templates/resume/README.md)

## User deliverable vs internal file

| File | Who needs it | Purpose |
|------|--------------|---------|
| **`resume.html`** | **User** | Open in browser, print to PDF, email to employers — **same look as wport GUI** |
| `resume.json` | Agent / other skills | Structured data for `gen-resume-optimizer`, `interviewer-ai`, `gen-career-mentor`, future wport import |

**Tell the user:** their resume is ready in `doc/resume/resume.html`. They do **not** need to open or edit JSON unless they want to chain other skills or sync to wport later.

Agent workflow: write `doc/resume/resume.json` → run `render.mjs` → hand off **`doc/resume/resume.html`**.

## Output directory

**Default:** all resume artifacts go under **`doc/resume/`** (create the folder if missing).

| File | Path |
|------|------|
| Base JSON (internal) | `doc/resume/resume.json` |
| Base HTML (user) | `doc/resume/resume.html` |
| Optimized JSON (internal) | `doc/resume/resume-optimized.json` |
| Optimized HTML (user) | `doc/resume/resume-optimized.html` |
| Customization report JSON (internal) | `doc/resume/resume-customization.json` |
| Customization report HTML (user) | `doc/resume/resume-customization.html` |
| Interview prep JSON (internal) | `doc/resume/interview-prep.json` |
| Interview prep HTML (user) | `doc/resume/interview-prep.html` |
| Career plan JSON (internal) | `doc/resume/career-plan.json` |
| Career plan HTML (user) | `doc/resume/career-plan.html` |

Use a different path only when the user explicitly specifies one.

## Purpose

- Convert scattered notes, old CVs, Obsidian vaults, or chat input into a wport resume
- Edit an existing resume section by section
- Deliver HTML preview identical to wport online

For **job-specific tailoring**, use `gen-resume-optimizer` after you have a base resume and target `enc_id`.
For **long-term career planning**, use `gen-career-mentor`.

## Rules

1. **All fields optional** — never force the user to fill every section. Only populate what they provide.
2. **Preview shape only** — use `*_display` strings, not raw edit-form codes.
3. **Rich text = HTML** — convert prose to Quill-compatible HTML (`<p>`, `<ul>`, `<li>`). Never store Markdown in `autobiography`, `job_description`, or `education.experience`.
4. **Section order** — follow the 10-section order in `templates/resume/README.md`.
5. **Skip empty sections** — when rendering preview, omit sections with no data.

## Workflow

### 1. Gather input

Ask the user for whatever they have:

- Existing `resume.json` to edit
- Free-form text, old CV, LinkedIn export, or verbal description
- Specific sections to add or update

If input is free-form Markdown or Word-style text, map content into the wport preview schema — do not save as Markdown.

### 2. Build or update `resume.json`

Map user content to the schema in [`templates/resume/README.md`](../../templates/resume/README.md):

| User content | Target field |
|--------------|--------------|
| Name, contact | `personal_info` |
| Employment status, license, vehicle | `background.*_display` |
| About me / summary | `autobiography` (HTML) |
| Jobs | `work_experience.work_experiences[]` |
| Schools | `education[]` |
| Job preferences | `job_condition.*_display` |
| Skills, tools | `professional_skills` |
| Languages | `language_skills[]` |
| Certifications | `certificates[]` |
| GitHub, portfolio | `portfolio_links[]` |

For `duration_display`, use wport-style strings: `"2021/03 - 至今（3年）"` or `"2013/09 - 2017/06"`.

For `job_type_display`, use localized labels the user expects on wport: `"正職"`, `"兼職"`, `"實習"`, `"約聘"`.

### 3. Write `resume.json` (internal)

Save to the path the user specifies (default: `doc/resume/resume.json`). This is the **agent's working copy** — not the primary deliverable.

Validate:

- [ ] Valid JSON
- [ ] Rich text fields contain HTML, not Markdown
- [ ] No fabricated data — only what the user provided
- [ ] `*_display` fields used for human-readable values

### 4. Render and deliver `resume.html` (user deliverable)

After writing `resume.json`, **always** render HTML via the W101-Web template (never hand-author HTML/CSS):

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
```

Template: [`templates/resume/`](../../templates/resume/) — see README § Render.

**Primary deliverable:** `doc/resume/resume.html` — tell the user to open this file.

Optionally summarize key sections in chat, but do not substitute chat text for the HTML file.

### 5. Confirm with user

Tell the user (Traditional Chinese):

> 履歷已產生在 **`doc/resume/resume.html`**，用瀏覽器開啟即可預覽，版面與 wport 網站履歷 preview 相同；列印可另存 PDF 寄送。
>
> 同目錄的 `doc/resume/resume.json` 是給系統用的資料檔，您不必開啟。若之後要接 **履歷客製化**、**面試模擬** 或 **職涯導師**，agent 會自動使用它。

## HTML conversion examples

| User writes | Store as |
|-------------|----------|
| `I built APIs with Node.js.` | `<p>I built APIs with Node.js.</p>` |
| Bullet list of achievements | `<ul><li>...</li><li>...</li></ul>` |
| Two paragraphs | `<p>...</p><p>...</p>` |

## Guardrails

- Do not invent employers, degrees, or skills the user did not mention.
- Do not apply wport web editor required-field rules — everything is optional here.
- If the user has only partial info, produce a valid partial `resume.json` and render HTML anyway.
- Never skip HTML rendering — JSON alone is not a complete deliverable for the user.
- Do not hand-author resume HTML; always use `templates/resume/render.mjs`.
- For missing `resume.json`, do not proceed to `interviewer-ai` — finish this skill first or ask the user to provide a file.

## Additional resources

- Full schema and example: [`templates/resume/README.md`](../../templates/resume/README.md)
