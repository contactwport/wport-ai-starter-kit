---
name: interviewer-ai
description: >-
  Simulate a harsh Silicon Valley-style technical interview with 10 devil
  questions tailored to a target job and wport-standard resume. Use when the
  user wants interview prep, mock interview questions, 面試模擬, or 魔鬼面試題
  for a specific wport job posting.
---

# interviewer-ai

Devil interview simulator — 10 sharp questions based on a target company/job and the candidate's resume.

## User deliverable vs internal file

| File | Who needs it | Purpose |
|------|--------------|---------|
| **`interview-prep.html`** | **User** | Open in browser, print to PDF — **same wport report UX** |
| `interview-prep.json` | Agent / other skills | Structured report for re-runs and skill chain |

**Tell the user:** open **`doc/resume/interview-prep.html`**. JSON is internal.

Agent workflow: write `doc/resume/interview-prep.json` → run `templates/report/render.mjs` → deliver **`doc/resume/interview-prep.html`**.

## Output directory

**Default:** `doc/resume/` (same folder as resume artifacts).

| File | Path |
|------|------|
| Report JSON (internal) | `doc/resume/interview-prep.json` |
| Report HTML (user) | `doc/resume/interview-prep.html` |

## Prerequisites

Before running, ensure:

1. **Company/job info** — fetch via `exec-wport-cli` (do not fabricate)
2. **Resume** — wport-standard JSON at `doc/resume/resume.json` (see `gen-resume` and [`templates/resume/README.md`](../../templates/resume/README.md))

If the user has no resume under `doc/resume/`, run `gen-resume` first or ask them to provide one.
If the user has no target job `enc_id`, ask them to provide one or run `wport jobs search` via `exec-wport-cli` and let them pick.

## Workflow

### Step 1: Collect `{company_info}`

Use `exec-wport-cli`:

```bash
wport jobs view <enc_id> --output json
```

Use the full `JobViewVM` response as `{company_info}`. Key fields for question design:

- `company_header_info.company_name`
- `job_info.job_title`, `job_info.experience_display`, `job_info.salary_display`
- `job_description` (HTML)
- `job_information`, `recruitment_conditions`, `about_company`

### Step 2: Collect `{resume}`

Read the user's resume JSON (default: `doc/resume/resume.json` or `doc/resume/resume-optimized.json` if tailored).

Parse per [`templates/resume/README.md`](../../templates/resume/README.md). Pay special attention to:

- `work_experience.work_experiences[]` — for deep-dive technical questions
- `autobiography` — for motivation and culture-fit probes
- Gaps, short tenures, career switches — for 履歷痛點 questions

Do **not** accept free-form Markdown. Redirect to `gen-resume` if needed.

### Step 3: Write report JSON (internal)

Write `doc/resume/interview-prep.json` with `"type": "interview-prep"`. Schema: [`templates/report/README.md`](../../templates/report/README.md).

Required structure:

- `target_job`: company + title from `{company_info}`
- `categories[]`: exactly 4 categories, 10 questions total
  - 一、技術與實戰情境題 (3)
  - 二、行為面試與團隊協作 (3)
  - 三、履歷痛點與痛擊題 (2)
  - 四、商業突發狀況情境題 (2)
- Each question: `question`, `intent`, `strategy`
- `interviewer_tip`: 面試官的小叮嚀

### Step 4: Render HTML (never hand-author)

```bash
node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html
```

Tell the user to open **`doc/resume/interview-prep.html`**.

### Step 5: Self-check output

- [ ] **`interview-prep.html` exists** and was rendered via `templates/report/render.mjs`
- [ ] User was told to open the HTML file, not the JSON
- [ ] Exactly 10 questions in 4 categories (3+3+2+2)
- [ ] Each question has: intent, strategy
- [ ] `interviewer_tip` included
- [ ] Report content in Traditional Chinese
- [ ] Questions probe resume claims — not generic trivia
- [ ] Report JSON contains no emoji or decorative icons

---

## System Prompt

```
You are an extremely demanding chief interviewer with a Silicon Valley senior tech executive and big-tech PM director background. Your interview style is sharp — you instantly spot resume inflation or vagueness. You design questions that reveal true ability, not rehearsed answers.
```

## User Prompt Template

```
You are given:
1. Target company name and job description (JSON from wport): {company_info}
2. Candidate resume in wport preview format (JSON): {resume}

Task:
Based on the company's business context, the role's hard-skill requirements, and the candidate's resume blind spots, simulate a real interview. Produce 10 devil questions that test genuine ability.

Question allocation:
- 3 questions: Technical hard skills and hands-on scenario questions (deep-dive into projects listed on the resume)
- 3 questions: Behavioral questions (teamwork, pressure handling, conflict resolution)
- 2 questions: Sharp probes at resume weaknesses, employment gaps, or career-switch motives
- 2 questions: Real business emergency scenarios this role would face

Rules:
- Every technical question must reference something specific from the resume or job description.
- Weakness questions must cite actual resume gaps — not generic "tell me a weakness."
- Business scenarios must relate to the company's domain and job title.

Output `doc/resume/interview-prep.json` then render HTML. Do not deliver Markdown-only.

```json
{
  "type": "interview-prep",
  "title": "wport 面試官模擬 - 10 道必考魔鬼題",
  "target_job": { "company": "...", "title": "..." },
  "categories": [
    {
      "title": "一、技術與實戰情境題 (3題)",
      "questions": [
        { "question": "...", "intent": "...", "strategy": "..." }
      ]
    }
  ],
  "interviewer_tip": "..."
}
```

Full schema: [`templates/report/README.md`](../../templates/report/README.md)

Rules:
- Every technical question must reference something specific from the resume or job description.
- Weakness questions must cite actual resume gaps — not generic "tell me a weakness."
- Business scenarios must relate to the company's domain and job title.
```

---

## Example agent invocation

User: "針對 enc_id a1B2c3D4 幫我出魔鬼面試題，履歷在 doc/resume/resume.json"

1. `wport jobs view a1B2c3D4 --output json`
2. Read `doc/resume/resume.json`
3. Apply System + User prompts → write `doc/resume/interview-prep.json`
4. `node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html`
5. Tell user to open `doc/resume/interview-prep.html`

## Guardrails

- Never fabricate company info or resume content.
- Resume must be wport preview JSON.
- Questions must be specific to this candidate and this job — no generic question banks.
- Never deliver JSON-only — HTML is required for every run.
- Do not hand-author report HTML; always use `templates/report/render.mjs`.
- Do not use emoji or decorative icons anywhere in report JSON (titles, categories, tips).
- After the report, offer `gen-interview-debrief` (roadmap) if user wants to practice answers.

## Additional resources

- Report schema: [`templates/report/README.md`](../../templates/report/README.md)
- Resume format: [`templates/resume/README.md`](../../templates/resume/README.md)
- CLI commands: [`skills/exec-wport-cli/SKILL.md`](../exec-wport-cli/SKILL.md)
