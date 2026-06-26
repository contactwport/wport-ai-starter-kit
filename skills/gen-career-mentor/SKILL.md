---
name: gen-career-mentor
description: >-
  Career mentor gap analysis and long-term growth plan from a wport resume and
  target job. Use when the user asks what skills they lack, how to prepare for a
  role, or wants a 1/3/5-year capability roadmap — 職涯導師.
---

# gen-career-mentor

Career mentor — analyze gaps between your current resume and a target job, then plan how to build missing capabilities over **1, 3, and 5 years**.

This is **not** resume editing (`gen-resume-optimizer`) or interview prep (`interviewer-ai`). This skill answers: *"What am I missing, and how do I grow into this role over time?"*

## User deliverable vs internal file

| File | Who needs it | Purpose |
|------|--------------|---------|
| **`career-plan.html`** | **User** | Open in browser, print to PDF — **same wport report UX** |
| `career-plan.json` | Agent / other skills | Structured plan for re-runs and skill chain |

**Tell the user:** open **`doc/resume/career-plan.html`**. JSON is internal.

Agent workflow: write `doc/resume/career-plan.json` → run `templates/report/render.mjs` → deliver **`doc/resume/career-plan.html`**.

## Output directory

**Default:** `doc/resume/` (same folder as resume artifacts).

| File | Path |
|------|------|
| Report JSON (internal) | `doc/resume/career-plan.json` |
| Report HTML (user) | `doc/resume/career-plan.html` |

## Prerequisites

1. **Current resume** — `doc/resume/resume.json` (or `doc/resume/resume-optimized.json`) in wport preview format ([`templates/resume/README.md`](../../templates/resume/README.md))
2. **Target job or career goal** — one of:
   - `enc_id` → `wport jobs view <enc_id> --output json`
   - User-described target: job title, industry, seniority, dream company type

If the user has no resume under `doc/resume/`, run `gen-resume` first.
If the user has a vague goal ("想當技術主管"), ask clarifying questions before proceeding.

## Workflow

### Step 1: Collect inputs

| Input | Source |
|-------|--------|
| `{resume}` | `doc/resume/resume.json` |
| `{target_job}` | Job view JSON or user's career goal description |

### Step 2: Deep gap analysis

Compare resume against target across dimensions:

| Dimension | What to assess |
|-----------|----------------|
| Hard skills | Languages, frameworks, infra, domain knowledge |
| Seniority signals | Scope, ownership, team size, architecture decisions |
| Soft skills | Communication, cross-team influence, hiring, mentoring |
| Industry fit | Domain experience (fintech, SaaS, hardware, etc.) |
| Credentials | Degrees, certifications if role expects them |
| Trajectory | Does current path naturally lead to target in 1/3/5 years? |

Classify each gap:

- **Ready now** — already on resume, may need better positioning (`gen-resume-optimizer`)
- **Buildable in 1 year** — achievable with focused projects/courses
- **Medium-term (3 years)** — requires role changes or significant project ownership
- **Long-term (5 years)** — career arc shift, leadership track, deep specialization

### Step 3: Write report JSON (internal)

Write `doc/resume/career-plan.json` with `"type": "career-plan"`. Schema: [`templates/report/README.md`](../../templates/report/README.md).

Required sections: `target` (with `gap_score`, `feasibility_score` 1–100), `capability_matrix`, `core_gaps`, `plan_1y`, `plan_3y`, `plan_5y`, `immediate_actions`, `mentor_tip`.

Score rules:
- `gap_score`: 1–100，越高表示與目標職缺差距越大（1–25 小幅調整、26–50 一到兩階跳躍、51–75 重大轉型、76–100 高度落差）
- `feasibility_score`: 1–100，越高表示短期就職可行性越高
- 各附 `gap_note` / `feasibility_note` 一句話說明，勿用 emoji

`capability_matrix[].current`: `ready` | `partial` | `missing`.

### Step 4: Render HTML (never hand-author)

```bash
node templates/report/render.mjs doc/resume/career-plan.json doc/resume/career-plan.html
```

Tell the user to open **`doc/resume/career-plan.html`**.

### Step 5: Suggest next steps

Based on timeline urgency:

- Immediate → `gen-resume-optimizer` + `interviewer-ai`
- 1-year gaps → concrete project/course recommendations
- 3–5 year → career moves and milestone checkpoints

---

## System Prompt

```
You are a seasoned tech career mentor and former engineering director who has guided dozens of professionals from IC to leadership. You give honest, actionable gap analysis — not empty encouragement. You distinguish between skills that can be learned quickly vs. those requiring years of deliberate practice and the right opportunities. You plan in 1-year, 3-year, and 5-year horizons with specific, measurable milestones.
```

## User Prompt Template

```
You are given:
1. Candidate's current resume (wport preview JSON): {resume}
2. Target job or career goal (wport job view JSON or description): {target_job}

Task:
Analyze the gap between where the candidate is now and where they want to be. Produce a career development plan.

Rules:
- Base analysis only on resume content and target job requirements — no invented background.
- Be honest about unrealistic timelines; say if 5 years is optimistic for this jump.
- Every recommendation must be actionable (specific skills, project types, role moves).
- Distinguish "resume positioning" gaps (fixable now) from "real capability" gaps (need time).

Output `doc/resume/career-plan.json` then render HTML. Do not deliver Markdown-only.

```json
{
  "type": "career-plan",
  "title": "wport 職涯導師 — 能力差距與成長路線圖",
  "target": {
    "job_title": "...",
    "current_position": "...",
    "gap_score": 55,
    "gap_note": "一句話說明差距來源",
    "feasibility_score": 62,
    "feasibility_note": "一句話誠實評估"
  },
  "capability_matrix": [
    { "dimension": "...", "current": "ready|partial|missing", "requirement": "...", "gap": "..." }
  ],
  "core_gaps": [{ "name": "...", "why": "..." }],
  "plan_1y": [{ "quarter": "Q1", "goal": "...", "actions": "...", "metrics": "..." }],
  "plan_3y": { "target_role": "...", "milestones": ["..."], "career_move": "..." },
  "plan_5y": { "target_role": "...", "path": "...", "opportunities": "..." },
  "immediate_actions": ["...", "...", "..."],
  "mentor_tip": "..."
}
```

Full schema: [`templates/report/README.md`](../../templates/report/README.md)

Rules:
- Base analysis only on resume content and target job requirements — no invented background.
- Be honest about unrealistic timelines; say if 5 years is optimistic for this jump.
- Every recommendation must be actionable (specific skills, project types, role moves).
- Distinguish "resume positioning" gaps (fixable now) from "real capability" gaps (need time).
```

---

## Self-check

- [ ] **`career-plan.html` exists** and was rendered via `templates/report/render.mjs`
- [ ] User was told to open the HTML file, not the JSON
- [ ] Gap analysis cites specific resume fields and JD requirements
- [ ] 1/3/5 year plans have measurable milestones, not vague advice
- [ ] Distinguishes resume positioning vs real skill building
- [ ] `gap_score` and `feasibility_score` are integers 1–100 with brief notes
- [ ] Report content in Traditional Chinese
- [ ] No fabricated user background
- [ ] Report JSON contains no emoji or decorative icons

## Guardrails

- Do not promise timelines the resume cannot support — be direct about hard jumps.
- If target is too vague, ask 1–2 clarifying questions before generating the plan.
- This skill produces a **report HTML**, not a modified resume. For resume edits → `gen-resume-optimizer`.
- Never deliver JSON-only — HTML is required for every run.
- Do not hand-author report HTML; always use `templates/report/render.mjs`.
- Do not use emoji or decorative icons anywhere in report JSON (titles, sections, tips).
- If user is already a strong fit, say so and focus plan on interview prep and positioning.

## Skill relationships

```
gen-resume          → build base resume.json
gen-career-mentor   → long-term gap + 1/3/5 year plan (this skill)
gen-resume-optimizer → short-term resume tailoring for one job
interviewer-ai      → mock interview for one job
```

Typical flow: `gen-resume` → `gen-career-mentor` (where am I going?) → `gen-resume-optimizer` (apply now) → `interviewer-ai` (practice).

## Additional resources

- Report schema: [`templates/report/README.md`](../../templates/report/README.md)
- Resume schema: [`templates/resume/README.md`](../../templates/resume/README.md)
- Tailor resume: [`skills/gen-resume-optimizer/SKILL.md`](../gen-resume-optimizer/SKILL.md)
- Fetch job: [`skills/exec-wport-cli/SKILL.md`](../exec-wport-cli/SKILL.md)
