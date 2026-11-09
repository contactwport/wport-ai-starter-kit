# wport-ai-starter-kit

Eric Lu 盧旭熙在大學、企業和在地店家教了十多場 AI 課，每一場都圍繞同一件事：先用 Markdown 把自己（或店）的資料寫成一份 SSOT（單一資料來源），再讓 AI 從這一份做出網站、文圖、履歷。這包把每場共用的模板和腳本整理起來，新手照著做，就能更快上手。

## 核心：一份 md，長出所有東西

```
md（SSOT）：我的資料／品牌資料（Obsidian 筆記）
  ├── 個人品牌網站（site）→ 用 Vercel CLI 上線
  ├── 社群文圖（10 張範本、10 種風格）→ 發到 FB 粉專
  ├── 履歷 → 用 WPORT CLI 建線上履歷、照職缺客製
  └── 文章、報告、表單……
```

資料改一次，網站、文圖、履歷全部跟著對。

## 這包裡有什麼

| | 內容 | 在哪裡 |
|---|---|---|
| **1. md as SSOT 範本** | 個人版「我的資料」、店家版「品牌資料」；一份筆記講一件事，AI 只讀用得到的 | [`vibe-coding/我的資料/`](vibe-coding/我的資料)、[`brand/品牌資料/`](brand/品牌資料)、[`vault/`](vault) |
| **2. 個人品牌網站** | 從 SSOT 做出網站，再用 Vercel CLI 上線 | [`vibe-coding/`](vibe-coding)、[`templates/website/`](templates/website)、[`skills/exec-vercel-cli/`](skills/exec-vercel-cli) |
| **3. SSOT 產生的文圖** | 10 張社群文圖加 10 種風格，AI 讀 SSOT 只填字；出圖和發 FB 粉專的腳本 | [`brand/templates/`](brand/templates)、[`brand/scripts/`](brand/scripts) |
| **4. SSOT 做履歷** | 讀 SSOT，用 WPORT CLI 建線上履歷、照職缺客製、面試準備 | [`skills/exec-wport-cli/`](skills/exec-wport-cli)、[`skills/gen-resume/`](skills/gen-resume)、[`templates/resume/`](templates/resume) |
| **5. CLI 和常見工具** | 給 AI 讀的說明書（Skill）：WPORT CLI、Vercel CLI、GA4、HypeLink 品牌頁和活動、填表單蓋章 | [`skills/`](skills/INDEX.md) |

工具（OpenCode、Obsidian、Git、Node.js）照 [WPORT 課前準備](https://wport.me/services/ai-training/prepare) 一鍵安裝。

不需要 Python、不需要自己從零寫 prompt：裝好 Skills，跟 AI 說你想做什麼就行。

> 適用對象：小店家、個人品牌、轉職者、在職進修、自由接案、創業者、學生，**不限身份與年資**。

## 你可以做什麼

| 情境 | 跟 AI 說 |
|------|---------|
| 做履歷 | 「幫我從這些經歷做一份 wport 履歷」 |
| 投特定職缺 | 「針對 enc_id `xxx` 客製履歷並給優化報告」 |
| 模擬面試 | 「用這份 JD 出 10 道魔鬼題」 |
| 職涯規劃 | 「我想成為 Senior 後端，給我成長路線圖」 |
| 經營品牌頁 | 「把 IG 和官網加到 HypeLink 品牌頁」 |
| 辦活動報名 | 「建一場講座，加早鳥和一般票」 |
| 看網站數據 | 「查 GA4 過去 30 天流量」 |
| 上線作品 | 「把履歷 HTML deploy 到 Vercel」 |
| 填表單、蓋大小章 | 「用我的 Obsidian 資料填這份申請書並蓋章」 |

完整 skill 清單見 [`skills/INDEX.md`](skills/INDEX.md)。動手練習見 [`practice/`](practice/README.md)。

## 課程資料夾

上 Eric Lu 盧旭熙的 AI 課程，從這裡拿模板。每個資料夾自己就是一份完整的專案，搬出來就能用。

| 資料夾 | 課程 | 裡面有什麼 |
|---|---|---|
| [`brand/`](brand/README.md) | 品牌行銷 AI 加速器（小店家、個人品牌） | 品牌資料（Obsidian）、10 張社群文圖模板、10 種風格、出圖和發 FB 的腳本 |
| [`vibe-coding/`](vibe-coding/README.md) | Vibe Coding 工作坊（大學生、求職者） | 我的資料（Obsidian）範例、一頁式個人網站 |

只要其中一個資料夾：

```bash
git clone https://github.com/contactwport/wport-ai-starter-kit.git _kit
# 把 _kit/brand（或 _kit/vibe-coding）裡的東西搬到你的專案資料夾，再刪掉 _kit
```

以前的 `ericlu-sys/brand_template`、`ericlu-sys/teaching_template` 已經合併到這裡，之後只更新這一份。改了什麼見 [`CHANGELOG.md`](CHANGELOG.md)。

## 運作方式

```
你 ──► AI Agent（Cursor、Claude Code 等）
          │
          ├── 讀 skills/*/SKILL.md
          ├── 執行 @wport/cli（exec-wport-cli）
          ├── 呼叫 MCP（HypeLink、Google Analytics）
          └── 輸出 HTML 履歷或報告
```

## 前置需求

- **AI Agent** 且支援 Skills（例如 [Cursor](https://cursor.com)）
- **Node.js >= 18.17**（履歷渲染、Vercel CLI）

選用：

| 工具 | 用途 | 安裝 |
|------|------|------|
| `@wport/cli` | 搜尋職缺、讀 JD | `npm install -g @wport/cli` |
| HypeLink MCP | 品牌頁、活動 | [官方教學](https://hypelink.app/docs/ai/mcp) |
| analytics-mcp | GA4 報表 | [google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) |

## 快速開始（3 步）

### 1. Fork 本 repo

到 [contactwport/wport-ai-starter-kit](https://github.com/contactwport/wport-ai-starter-kit) 點 **Fork**，複製一份到你自己的 GitHub 帳號。

或用 GitHub CLI（會 fork 並 clone 到本機）：

```bash
gh repo fork contactwport/wport-ai-starter-kit --clone
cd wport-ai-starter-kit
```

之後請在自己的 fork 上改履歷與輸出；需要同步上游更新時：

```bash
git remote add upstream https://github.com/contactwport/wport-ai-starter-kit.git
git fetch upstream && git merge upstream/main
```

### 2. 連結 Skills 到 Cursor

```bash
# 建議：整包連結
mkdir -p .cursor/skills
ln -s /path/to/wport-ai-starter-kit/skills/gen-resume            .cursor/skills/gen-resume
ln -s /path/to/wport-ai-starter-kit/skills/exec-wport-cli        .cursor/skills/exec-wport-cli
ln -s /path/to/wport-ai-starter-kit/skills/gen-resume-optimizer  .cursor/skills/gen-resume-optimizer
ln -s /path/to/wport-ai-starter-kit/skills/gen-career-mentor     .cursor/skills/gen-career-mentor
ln -s /path/to/wport-ai-starter-kit/skills/interviewer-ai        .cursor/skills/interviewer-ai
ln -s /path/to/wport-ai-starter-kit/skills/gen-form-filler       .cursor/skills/gen-form-filler
ln -s /path/to/wport-ai-starter-kit/skills/exec-vercel-cli       .cursor/skills/exec-vercel-cli
ln -s /path/to/wport-ai-starter-kit/skills/exec-analytics-mcp    .cursor/skills/exec-analytics-mcp
ln -s /path/to/wport-ai-starter-kit/skills/hypelink-brand-page-mcp .cursor/skills/hypelink-brand-page-mcp
ln -s /path/to/wport-ai-starter-kit/skills/hypelink-event-mcp    .cursor/skills/hypelink-event-mcp
ln -s /path/to/wport-ai-starter-kit/skills/frontend-design       .cursor/skills/frontend-design
```

人類快查：[`skills/INDEX.md`](skills/INDEX.md)

### 3. 直接開聊

> 「幫我用範例格式做一份履歷，輸出到 doc/resume/」

Agent 會套用 `gen-resume`，產出 `resume.html`（給你看）與 `resume.json`（給其他 skill 串接）。

## Skill 一覽

### wport 職涯（內建）

| Skill | 類型 | 說明 |
|-------|------|------|
| [`exec-wport-cli`](skills/exec-wport-cli/) | Executor | `@wport/cli` 完整指令參考 |
| [`gen-resume`](skills/gen-resume/) | Generator | 建立／編輯履歷（訪談寫入 Obsidian，供之後建站） |
| [`gen-resume-optimizer`](skills/gen-resume-optimizer/) | Generator | 針對職缺客製履歷 + 報告 |
| [`gen-career-mentor`](skills/gen-career-mentor/) | Generator | 能力差距與 1/3/5 年計畫 |
| [`interviewer-ai`](skills/interviewer-ai/) | Generator | 10 道魔鬼面試題 |
| [`gen-form-filler`](skills/gen-form-filler/) | Generator | 用 Obsidian 資料填 Word／Excel 表單並蓋大小章 |

### 第三方整合

| 來源 | Skills |
|------|--------|
| [anthropics/skills](https://github.com/anthropics/skills) | `frontend-design`（個人品牌站／UI 視覺） |
| [hypelink_claude_skill](https://github.com/HypeLinkOfficial/hypelink_claude_skill) | `hypelink-brand-page-mcp`, `hypelink-event-mcp` |
| [google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) | `exec-analytics-mcp`（MCP 設定與工具指南） |
| Vercel CLI | `exec-vercel-cli` |

## 履歷與報告格式

- 履歷：wport preview JSON → [`templates/resume/`](templates/resume/README.md)
- Obsidian SSOT：[`vault/`](vault/README.md)（`resume.md`／`about-me.md`；長大再用資料夾分類）
- 個人網站視覺：[`skills/frontend-design`](skills/frontend-design/)（內容讀 vault，不取代訪談）
- 輕量靜態模板（可選）：[`templates/website/`](templates/website/README.md)
- 報告：共用 report JSON → [`templates/report/`](templates/report/README.md)
- 產出預設路徑是 `doc/resume/`（跑完 skill 才會有東西，repo 內不附範例輸出）
- 格式範例看 [`templates/report/examples/`](templates/report/examples/) 與 [`templates/website/examples/`](templates/website/examples/)

渲染指令：

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html
```

## 目錄結構

```
wport-ai-starter-kit/
├── README.md
├── skills/
│   ├── INDEX.md              # 人類快查索引
│   ├── exec-wport-cli/
│   ├── gen-resume/
│   ├── hypelink-brand-page-mcp/
│   └── ...
├── templates/
│   ├── resume/
│   └── report/
├── brand/                    # 品牌行銷 AI 加速器（原 brand_template）
├── vibe-coding/              # Vibe Coding 工作坊（原 teaching_template）
├── doc/
│   └── resume/               # 預設輸出（範例資料）
└── practice/                 # 動手練習
    └── 01-fill-forms/        # Word／Excel 表單 + 大小章
```

## 貢獻

1. Skill 正文以英文或繁中皆可；AI 產出預設繁體中文。
2. Prompt 寫在 `SKILL.md`，不另建 Python runtime。
3. 履歷格式變更先改 `templates/resume/`；報告先改 `templates/report/`。
4. 新增 executor 用 `exec-*`；generator 用 `gen-*` 或語意化名稱。

## 相關連結

- [@wport/cli](https://www.npmjs.com/package/@wport/cli)
- [HypeLink MCP 文件](https://hypelink.app/docs/ai/mcp)
- [Google Analytics MCP](https://github.com/googleanalytics/google-analytics-mcp)

## License

MIT
