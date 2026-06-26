# wport Resume Template

**Single resume template** for wport-agents — schema, layout CSS, icons, and render rules in one folder.

| Asset | Purpose |
|-------|---------|
| This README | JSON schema, output paths, agent rules |
| `resume.css` | Layout + colors synced from W101-Web |
| `icons/` | Member info SVG icons from W101-Web |
| `render.mjs` | `resume.json` → standalone HTML |

W101-Web sources to keep in sync:

- Schema: `apps/user/src/api/formatData/ResumeDetailPreviewResponse.ts`
- Preview: `apps/user/src/views/my-resume/preview-resume/index.vue`
- Sections: `apps/user/src/components/ResumeSections/*/preview-mode.vue`
- Rich text: `apps/user/src/assets/styles/rich-text.scss`

## User deliverable vs JSON

| Artifact | Audience | Notes |
|----------|----------|-------|
| **`resume.html`** / **`resume-optimized.html`** | User | Primary output — same layout as wport GUI |
| `resume.json` | Agent + skill chain | Internal; user can ignore unless chaining skills or wport import |

**Workflow:** write JSON under `doc/resume/` → render HTML → deliver HTML to user.

**Default paths:**

| File | Path |
|------|------|
| `resume.json` | `doc/resume/resume.json` |
| `resume.html` | `doc/resume/resume.html` |
| `resume-optimized.json` | `doc/resume/resume-optimized.json` |
| `resume-optimized.html` | `doc/resume/resume-optimized.html` |

Career reports (other skills) also live under `doc/resume/` — see [`templates/report/README.md`](../report/README.md):

| File | Path |
|------|------|
| `resume-customization.html` | `doc/resume/resume-customization.html` |
| `interview-prep.html` | `doc/resume/interview-prep.html` |
| `career-plan.html` | `doc/resume/career-plan.html` |

**Render (required — do not hand-author HTML):**

All rendered HTML includes the wport favicon (`https://wport.me/favicon.ico`).

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
node templates/resume/render.mjs doc/resume/resume-optimized.json doc/resume/resume-optimized.html
```

## Design principles

1. **Preview shape only** — use `*_display` strings, not raw edit-form codes.
2. **Rich text = HTML** — Quill-compatible HTML (`<p>`, `<ul>`, `<li>`). Never Markdown.
3. **All fields optional** — unlike the wport web editor, no field is required.
4. **Section visibility** — render a section only when it has meaningful data (mirrors wport `checkFormComplete`).

## JSON schema (`resume.json`)

Top-level type: `ResumeDetailPreviewResponsePreview`

```typescript
{
  resume_name?: string
  personal_info?: PersonalInfo
  background?: BackgroundPreview
  autobiography?: string              // HTML
  work_experience?: WorkExperiencePreview
  education?: EducationPreview[]
  job_condition?: JobConditionPreview
  professional_skills?: ProfessionalSkillsPreview
  language_skills?: LanguageSkillPreview[]
  certificates?: CertificatePreview[]
  portfolio_links?: PortfolioLinkPreview[]
}
```

### `personal_info` (會員資料)

```typescript
{
  name?: string
  photo_url?: string
  email?: string
  mobile?: string
  birth_date?: string              // ISO date, e.g. "1995-03-15"
  age_display?: string
  country_display?: string
  residence_display?: string
  address_display?: string | null
  home_phone?: string | null
  home_phone_area_code?: string | null
  special_identity_display?: string | null
  identity_type_display?: string | null
}
```

### `background` (個人背景)

```typescript
{
  job_status_display?: string
  driving_license_types_display?: string
  vehicle_types_display?: string
}
```

### `autobiography` (自傳)

Single HTML string. Max ~3000 plain-text characters after stripping tags (wport web limit).

### `work_experience` (經歷)

```typescript
{
  has_no_work_experience?: boolean
  total_years_range_display?: string
  no_experience_display?: string
  work_experiences?: Array<{
    job_title?: string
    company_name?: string
    job_type_display?: string
    duration_display?: string
    job_description?: string            // HTML
  }>
}
```

### `education` (學歷) — array

```typescript
Array<{
  school_name?: string
  department_display?: string
  duration_display?: string
  experience?: string                   // HTML
}>
```

### `job_condition` (求職條件)

```typescript
{
  feature_display?: string
  working_hour_display?: string
  available_start_display?: string
  salary_expectation_display?: string
  expected_salary_currency_code?: string | null
  area_display?: string
  job_classification_display?: string
}
```

### `professional_skills` (專業技能)

```typescript
{
  job_skill_display?: string
  other_job_skill_description?: string | null
  tech_tool_display?: string
  other_tool_description?: string | null
}
```

### `language_skills` (語言能力) — array

```typescript
Array<{ name?: string; level_display?: string }>
```

### `certificates` (專業證照) — array

```typescript
Array<{ name?: string; duration_display?: string }>
```

### `portfolio_links` (個人連結) — array

```typescript
Array<{ link_title?: string; link_url?: string }>
```

## Section order (must match wport preview)

| # | Key | zh-TW title |
|---|-----|-------------|
| 1 | `personal_info` | 會員資料 |
| 2 | `background` | 個人背景 |
| 3 | `autobiography` | 自傳 |
| 4 | `work_experience` | 經歷 |
| 5 | `education` | 學歷 |
| 6 | `job_condition` | 求職條件 |
| 7 | `professional_skills` | 專業技能 |
| 8 | `language_skills` | 語言能力 |
| 9 | `certificates` | 專業證照 |
| 10 | `portfolio_links` | 個人連結 |

Timeline typography (work & education): bold title → teal subtitle (`#56C7BB`) → gray duration → rich-text body.

## Example `resume.json`

```json
{
  "resume_name": "Backend Engineer Resume",
  "personal_info": {
    "name": "王小明",
    "email": "ming@example.com",
    "mobile": "0912345678",
    "age_display": "28",
    "residence_display": "台北市",
    "country_display": "台灣"
  },
  "background": {
    "job_status_display": "在職中，可面談"
  },
  "autobiography": "<p>五年後端開發經驗，專精 Node.js 與雲端架構。</p>",
  "work_experience": {
    "has_no_work_experience": false,
    "total_years_range_display": "3-5年",
    "work_experiences": [
      {
        "job_title": "資深後端工程師",
        "company_name": "雲端科技股份有限公司",
        "job_type_display": "正職",
        "duration_display": "2021/03 - 至今（3年）",
        "job_description": "<p>負責微服務架構設計與 API 開發。</p><ul><li>導入 CI/CD，部署時間縮短 60%</li></ul>"
      }
    ]
  },
  "education": [],
  "job_condition": {
    "feature_display": "全職",
    "area_display": "台北市",
    "salary_expectation_display": "面議",
    "available_start_display": "兩週內可上班"
  },
  "professional_skills": {
    "job_skill_display": "Node.js, TypeScript",
    "tech_tool_display": "Docker, Git"
  },
  "language_skills": [{ "name": "英文", "level_display": "流利" }],
  "certificates": [],
  "portfolio_links": []
}
```

## Differences from wport web editor

| wport web editor | wport-agents |
|------------------|--------------|
| Required fields for publish | **No required fields** |
| Raw codes in edit form | Preview `*_display` strings |
| 4 mandatory sidebar sections | All 10 sections optional |

When W101-Web preview changes, update `resume.css`, `icons/`, and `render.mjs` together.
