---
name: gen-resume-optimizer
description: >-
  Tailor a resume for a specific target job and deliver HTML matching wport
  preview. Use when the user wants to customize or optimize their resume for a
  wport job (enc_id) or role description — 履歷客製化. Agent updates
  resume.json internally; user receives resume-optimized.html.
---

# gen-resume-optimizer

Customize a resume for a **specific target job** and deliver **`resume-optimized.html`** — emphasize relevant experience, reorder bullets, align keywords, and surface gaps to fill honestly.

This is **not** `gen-resume`. Use `gen-resume` to create a resume from scratch; use this skill when you already have a resume and a target job.

## User deliverable vs internal file

| File | Who needs it | Purpose |
|------|--------------|---------|
| **`resume-optimized.html`** | **User** | Job-targeted resume — **same look as wport GUI** (`templates/resume/render.mjs`) |
| **`resume-customization.html`** | **User** | 客製化報告 — 變更摘要、關鍵字對齊、建議補強 (`templates/report/render.mjs`) |
| `resume-optimized.json` | Agent / other skills | Optimized structured data for `interviewer-ai`, `gen-career-mentor`, re-runs |
| `resume-customization.json` | Agent | Customization report data (internal) |
| `resume.json` (original) | Agent | Preserved base copy; do not overwrite unless user asks |

**Tell the user:** open **`resume-optimized.html`** for the tailored resume and **`resume-customization.html`** for the report. Do **not** merge them into one file. JSON files are internal.

Agent workflow: edit `doc/resume/resume-optimized.json` → `templates/resume/render.mjs` → write `doc/resume/resume-customization.json` → `templates/report/render.mjs` → deliver both HTML files.

## Output directory

**Default:** all resume artifacts live under **`doc/resume/`** (same as `gen-resume`).

| File | Path |
|------|------|
| Base JSON | `doc/resume/resume.json` |
| Optimized JSON (internal) | `doc/resume/resume-optimized.json` |
| Optimized HTML (user) | `doc/resume/resume-optimized.html` |
| Customization JSON (internal) | `doc/resume/resume-customization.json` |
| Customization HTML (user) | `doc/resume/resume-customization.html` |

## Prerequisites

1. **Current resume** — `doc/resume/resume.json` in wport preview format ([`templates/resume/README.md`](../../templates/resume/README.md))
2. **Target job** — one of:
   - `enc_id` → fetch via `exec-wport-cli`: `wport jobs view <enc_id> --output json`
   - User-described target role (title + industry + requirements) if no enc_id yet

If the user has no `resume.json`, run `gen-resume` first.
If the user has no target job, run `exec-wport-cli` to search, then ask them to pick an `enc_id`.

## Workflow

### Step 1: Collect inputs

| Input | Source |
|-------|--------|
| `{resume}` | `doc/resume/resume.json` (or `doc/resume/resume-optimized.json` if re-optimizing) |
| `{target_job}` | `wport jobs view <enc_id> --output json` or user's role description |

Extract from `{target_job}`:

- `job_info.job_title`, `job_info.experience_display`, `job_info.salary_display`
- `job_description` (HTML)
- `job_information`, `recruitment_conditions`, `about_company`

### Step 2: Gap analysis (internal)

Before editing, identify:

- Keywords and skills the job emphasizes
- Experience on resume that maps directly
- Experience that is relevant but buried or poorly worded
- Genuine gaps (skills/job requirements NOT on resume)

### Step 3: Optimize resume (internal JSON)

Produce an optimized JSON at `doc/resume/resume-optimized.json` (unless user specifies another path). Internal — not the user's main output.

**Allowed changes:**

- Reword `job_description` bullets to mirror job keywords (truthfully)
- Reorder `work_experiences` — most relevant job first
- Strengthen `autobiography` opening for this role
- Update `professional_skills` display strings to include job-relevant terms the user actually has
- Adjust `job_condition` displays if user confirms preference changes

**Forbidden changes:**

- Invent employers, projects, degrees, or skills the user does not have
- Fabricate years of experience or certifications
- Change factual dates, company names, or job titles

If a gap cannot be filled from existing experience, list it in the **建議補強** section — do not fake it on the resume.

### Step 4: Write customization report JSON (internal)

Write `doc/resume/resume-customization.json` with `"type": "customization"`. Schema: [`templates/report/README.md`](../../templates/report/README.md).

Required sections mapped from analysis:

| JSON field | Content |
|------------|---------|
| `target_job` | Company + title from `{target_job}` |
| `changes[]` | 變更摘要 — section, change, jd_requirement |
| `keywords` | jd_emphasis, resume_matched, genuine_gaps |
| `recommendations[]` | 建議補強 — gap, how_to_build (honest only) |
| `footer_tip` | Next-step suggestion |

### Step 5: Render HTML (never hand-author)

**Resume** (wport preview — separate file, do not merge with report):

```bash
node templates/resume/render.mjs doc/resume/resume-optimized.json doc/resume/resume-optimized.html
```

**Customization report** (shared report UX):

```bash
node templates/report/render.mjs doc/resume/resume-customization.json doc/resume/resume-customization.html
```

Deliver in **Traditional Chinese**:

1. **`doc/resume/resume-optimized.html`** — tailored resume; tell user to open this file
2. **`doc/resume/resume-customization.html`** — 變更摘要 + 關鍵字對齊 + 建議補強

Also write `doc/resume/resume-optimized.json` (internal). Mention JSON paths only in passing — e.g. "系統已同步更新 doc/resume/ 資料檔，供後續面試模擬使用" — do not ask the user to edit them.

### Step 6: Suggest next steps

Offer:

- `interviewer-ai` on the same `enc_id` with optimized resume
- `gen-career-mentor` if gaps require long-term development

---

## System Prompt

```
You are a senior tech resume strategist and former FAANG hiring manager. You tailor resumes to specific job postings without ever fabricating experience. You maximize truthful alignment: keyword mapping, impact reframing, and strategic ordering. You clearly separate "resume wording improvements" from "real skill gaps the candidate must build."
```

## User Prompt Template

```
You are given:
1. Candidate resume (wport preview JSON): {resume}
2. Target job posting (wport job view JSON or role description): {target_job}

Task:
Produce a job-targeted optimized version of the resume. Align truthful content with what this role needs.

Rules:
- Never invent experience, skills, employers, or credentials.
- Rich text fields must remain Quill HTML.
- Keep wport preview JSON schema (`templates/resume/README.md`).
- Reorder and reword only — facts stay facts.

Also write `doc/resume/resume-customization.json` (report JSON, internal). Schema: [`templates/report/README.md`](../../templates/report/README.md).

```json
{
  "type": "customization",
  "title": "wport 履歷客製化報告",
  "target_job": { "company": "...", "title": "..." },
  "changes": [{ "section": "...", "change": "...", "jd_requirement": "..." }],
  "keywords": {
    "jd_emphasis": ["..."],
    "resume_matched": ["..."],
    "genuine_gaps": ["..."]
  },
  "recommendations": [{ "gap": "...", "how_to_build": "..." }],
  "footer_tip": "..."
}
```

Then run:
```bash
node templates/report/render.mjs doc/resume/resume-customization.json doc/resume/resume-customization.html
```

Do not output Markdown report as the primary deliverable — HTML is required.
```

---

## Self-check

- [ ] **`resume-optimized.html` exists** and was rendered via `templates/resume/render.mjs`
- [ ] **`resume-customization.html` exists** and was rendered via `templates/report/render.mjs`
- [ ] User was told to open both HTML files, not the JSON
- [ ] Resume and report HTML are **separate files** (not merged)
- [ ] Output JSON valid and matches wport preview schema (internal)
- [ ] No fabricated experience or skills
- [ ] HTML fields are Quill-compatible
- [ ] 變更摘要 maps each edit to a JD requirement
- [ ] 建議補強 lists only honest gaps
- [ ] Report in Traditional Chinese
- [ ] Report JSON contains no emoji or decorative icons

## Guardrails

- One target job per run. For multiple jobs, run separately or ask user to pick the primary target.
- If resume and job are mismatched (e.g. junior resume vs director role), say so directly — do not force optimization.
- Preserve original `doc/resume/resume.json`; write optimized version to `doc/resume/resume-optimized.json` unless user asks to overwrite.
- Never deliver JSON-only — both HTML files are required for every run.
- Do not hand-author resume HTML; always use `templates/resume/render.mjs`.
- Do not hand-author report HTML; always use `templates/report/render.mjs`.
- Do not merge resume and customization report into one HTML file.
- Do not use emoji or decorative icons anywhere in report JSON (titles, sections, tips).

## Additional resources

- Resume schema: [`templates/resume/README.md`](../../templates/resume/README.md)
- Report schema: [`templates/report/README.md`](../../templates/report/README.md)
- Create base resume: [`skills/gen-resume/SKILL.md`](../gen-resume/SKILL.md)
- Fetch job: [`skills/exec-wport-cli/SKILL.md`](../exec-wport-cli/SKILL.md)
