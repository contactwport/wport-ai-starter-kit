# wport Report Template

Shared HTML report layout for career skills — same visual language as [`templates/resume/`](../resume/README.md) (`wport-card`, colors, typography).

| Asset | Purpose |
|-------|---------|
| This README | JSON schemas, output paths, render command |
| `report.css` | Report-specific layout (loaded with `resume.css`) |
| `render.mjs` | Report JSON → standalone HTML |
| `examples/` | Sample JSON for each report type |

## User deliverable vs JSON

| Artifact | Skill | Audience |
|----------|-------|----------|
| **`resume-customization.html`** | `gen-resume-optimizer` | User — 客製化報告 |
| **`resume-optimized.html`** | `gen-resume-optimizer` | User — 客製化履歷（用 `templates/resume/render.mjs`，不與報告合併） |
| **`interview-prep.html`** | `interviewer-ai` | User — 面試模擬題 |
| **`career-plan.html`** | `gen-career-mentor` | User — 職涯路線圖 |
| `*.json` (report) | All above | Agent internal — re-run / skill chain |

**Default paths** (under `doc/resume/`):

| File | Path |
|------|------|
| `resume-customization.json` | `doc/resume/resume-customization.json` |
| `resume-customization.html` | `doc/resume/resume-customization.html` |
| `interview-prep.json` | `doc/resume/interview-prep.json` |
| `interview-prep.html` | `doc/resume/interview-prep.html` |
| `career-plan.json` | `doc/resume/career-plan.json` |
| `career-plan.html` | `doc/resume/career-plan.html` |

**Render (required — do not hand-author HTML):**

All rendered HTML includes the wport favicon (`https://wport.me/favicon.ico`).

```bash
node templates/report/render.mjs doc/resume/resume-customization.json doc/resume/resume-customization.html
node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html
node templates/report/render.mjs doc/resume/career-plan.json doc/resume/career-plan.html
```

## Report types

Every report JSON must include `"type"`: `customization` | `interview-prep` | `career-plan`.

### `customization` — gen-resume-optimizer

```json
{
  "type": "customization",
  "title": "wport 履歷客製化報告",
  "target_job": {
    "company": "範例科技",
    "title": "Senior Backend Engineer"
  },
  "changes": [
    {
      "section": "工作經歷",
      "change": "調整 API 效能優化 bullet 用字",
      "jd_requirement": "高流量系統經驗"
    }
  ],
  "keywords": {
    "jd_emphasis": ["Go", "Kubernetes"],
    "resume_matched": ["Go", "Docker"],
    "genuine_gaps": ["K8s 生產環境經驗"]
  },
  "recommendations": [
    {
      "gap": "Kubernetes 生產經驗",
      "how_to_build": "參與 side project 部署到 GKE 並記錄 SLO"
    }
  ],
  "footer_tip": "可接續使用 interviewer-ai 模擬面試。"
}
```

### `interview-prep` — interviewer-ai

```json
{
  "type": "interview-prep",
  "title": "wport 面試官模擬 - 10 道必考魔鬼題",
  "target_job": {
    "company": "範例科技",
    "title": "Senior Backend Engineer"
  },
  "categories": [
    {
      "title": "一、技術與實戰情境題 (3題)",
      "questions": [
        {
          "question": "你在 XX 專案中如何處理…？",
          "intent": "驗證是否真的做過",
          "strategy": "用 STAR，量化結果"
        }
      ]
    }
  ],
  "interviewer_tip": "此公司重視…，回答第 N 題時避免…"
}
```

Required categories (10 questions total): technical (3), behavioral (3), resume-weakness (2), business-scenario (2).

### `career-plan` — gen-career-mentor

```json
{
  "type": "career-plan",
  "title": "wport 職涯導師 — 能力差距與成長路線圖",
  "target": {
    "job_title": "Senior Backend Engineer",
    "current_position": "3 年後端 IC",
    "gap_score": 55,
    "gap_note": "需補 K8s 生產經驗與 system design 案例",
    "feasibility_score": 62,
    "feasibility_note": "Mid-level 已足；Senior 需 18–24 個月刻意累積"
  },
  "capability_matrix": [
    {
      "dimension": "Hard skills",
      "current": "partial",
      "requirement": "K8s + 系統設計",
      "gap": "缺生產級 K8s"
    }
  ],
  "core_gaps": [
    { "name": "系統設計深度", "why": "Senior 需獨立設計服務邊界" }
  ],
  "plan_1y": [
    {
      "quarter": "Q1",
      "goal": "補 K8s 基礎",
      "actions": "CKA 課程 + homelab",
      "metrics": "完成 3 次 deploy rollback drill"
    }
  ],
  "plan_3y": {
    "target_role": "Tech Lead",
    "milestones": ["Year 1: …", "Year 2: …"],
    "career_move": "stay and grow"
  },
  "plan_5y": {
    "target_role": "Engineering Manager",
    "path": "…",
    "opportunities": "…"
  },
  "immediate_actions": ["更新 GitHub pinned repos", "…", "…"],
  "mentor_tip": "最大陷阱是…"
}
```

`capability_matrix[].current`: `ready` | `partial` | `missing` (renders as 已有 / 部分 / 缺少).

**Score fields** (`target`):

| Field | Range | Meaning | Color |
|-------|-------|---------|-------|
| `gap_score` | 1–100 | 差距程度（越高差距越大） | 低分綠 → 高分紅 |
| `gap_note` | text | 差距說明（選填） | — |
| `feasibility_score` | 1–100 | 就職可行性（越高越可行） | 低分紅 → 高分綠 |
| `feasibility_note` | text | 評估說明（選填） | — |

Derived labels: `gap_score` → 小幅調整 (1–25) / 一到兩階跳躍 (26–50) / 重大轉型 (51–75) / 高度落差 (76–100). `feasibility_score` → 困難 (1–40) / 具挑戰 (41–60) / 可行 (61–80) / 高度可行 (81–100).

## Agent rules

1. Write report JSON first, then run `render.mjs` — never hand-author report HTML.
2. Deliver HTML to the user as primary output; JSON is internal.
3. Resume HTML from `gen-resume-optimizer` still uses `templates/resume/render.mjs` — do not merge with customization report.
4. All report content in Traditional Chinese unless user requests otherwise.
5. **No emoji or decorative icons** in titles, section headings, callouts, or body text — plain professional copy only.

## Examples

```bash
node templates/report/render.mjs templates/report/examples/customization.json /tmp/customization.html
node templates/report/render.mjs templates/report/examples/interview-prep.json /tmp/interview-prep.html
node templates/report/render.mjs templates/report/examples/career-plan.json /tmp/career-plan.html
```
