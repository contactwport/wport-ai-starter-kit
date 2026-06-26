# wport-agents

**開源 AI Skills 工具包** — 搭配 [wport 職航站](https://www.wport.me) 與常用 MCP，讓 **任何新手小白** 都能用自然語言完成履歷、求職、簡報與品牌頁操作。

不需要 Python、不需要自己寫 prompt。裝好 Skills，跟 AI 說你想做什麼就行。

> 適用對象：轉職者、在職進修、自由接案、創業者、學生 — **不限身份與年資**。

## 你可以做什麼

| 情境 | 跟 AI 說 |
|------|---------|
| 做履歷 | 「幫我從這些經歷做一份 wport 履歷」 |
| 投特定職缺 | 「針對 enc_id `xxx` 客製履歷並給優化報告」 |
| 模擬面試 | 「用這份 JD 出 10 道魔鬼題」 |
| 職涯規劃 | 「我想成為 Senior 後端，給我成長路線圖」 |
| 做簡報 | 「用 open-slide 做 8 頁產品發表簡報」 |
| 經營品牌頁 | 「把 IG 和官網加到 HypeLink 品牌頁」 |
| 辦活動報名 | 「建一場講座，加早鳥和一般票」 |
| 看網站數據 | 「查 GA4 過去 30 天流量」 |
| 上線作品 | 「把履歷 HTML deploy 到 Vercel」 |

完整 skill 清單見 [`skills/INDEX.md`](skills/INDEX.md)。

## 運作方式

```
你 ──► AI Agent（Cursor、Claude Code 等）
          │
          ├── 讀 skills/*/SKILL.md
          ├── 執行 @wport/cli（exec-wport-cli）
          ├── 呼叫 MCP（HypeLink、Google Analytics）
          └── 輸出 HTML 履歷、報告、或 open-slide 簡報
```

## 前置需求

- **AI Agent** 且支援 Skills（例如 [Cursor](https://cursor.com)）
- **Node.js >= 18.17**（履歷渲染、open-slide、Vercel CLI）

選用：

| 工具 | 用途 | 安裝 |
|------|------|------|
| `@wport/cli` | 搜尋職缺、讀 JD | `npm install -g @wport/cli` |
| HypeLink MCP | 品牌頁、活動 | [官方教學](https://hypelink.app/docs/ai/mcp) |
| analytics-mcp | GA4 報表 | [google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) |
| open-slide | Agent 原生簡報 | `npx @open-slide/cli init my-slide` |

## 快速開始（3 步）

### 1. Fork 本 repo

到 [contactwport/wport-agents](https://github.com/contactwport/wport-agents) 點 **Fork**，複製一份到你自己的 GitHub 帳號。

或用 GitHub CLI（會 fork 並 clone 到本機）：

```bash
gh repo fork contactwport/wport-agents --clone
cd wport-agents
```

之後請在自己的 fork 上改履歷、簡報與輸出；需要同步上游更新時：

```bash
git remote add upstream https://github.com/contactwport/wport-agents.git
git fetch upstream && git merge upstream/main
```

### 2. 連結 Skills 到 Cursor

```bash
# 建議：整包連結
mkdir -p .cursor/skills
ln -s /path/to/wport-agents/skills/gen-resume            .cursor/skills/gen-resume
ln -s /path/to/wport-agents/skills/exec-wport-cli        .cursor/skills/exec-wport-cli
ln -s /path/to/wport-agents/skills/gen-resume-optimizer  .cursor/skills/gen-resume-optimizer
ln -s /path/to/wport-agents/skills/gen-career-mentor     .cursor/skills/gen-career-mentor
ln -s /path/to/wport-agents/skills/interviewer-ai        .cursor/skills/interviewer-ai
ln -s /path/to/wport-agents/skills/exec-vercel-cli       .cursor/skills/exec-vercel-cli
ln -s /path/to/wport-agents/skills/exec-analytics-mcp    .cursor/skills/exec-analytics-mcp
ln -s /path/to/wport-agents/skills/hypelink-brand-page-mcp .cursor/skills/hypelink-brand-page-mcp
ln -s /path/to/wport-agents/skills/hypelink-event-mcp    .cursor/skills/hypelink-event-mcp
# open-slide skills（需先有 open-slide workspace）
ln -s /path/to/wport-agents/skills/create-slide          .cursor/skills/create-slide
ln -s /path/to/wport-agents/skills/slide-authoring       .cursor/skills/slide-authoring
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
| [`gen-resume`](skills/gen-resume/) | Generator | 建立／編輯履歷 |
| [`gen-resume-optimizer`](skills/gen-resume-optimizer/) | Generator | 針對職缺客製履歷 + 報告 |
| [`gen-career-mentor`](skills/gen-career-mentor/) | Generator | 能力差距與 1/3/5 年計畫 |
| [`interviewer-ai`](skills/interviewer-ai/) | Generator | 10 道魔鬼面試題 |

### 第三方整合

| 來源 | Skills |
|------|--------|
| [hypelink_claude_skill](https://github.com/HypeLinkOfficial/hypelink_claude_skill) | `hypelink-brand-page-mcp`, `hypelink-event-mcp` |
| [open-slide](https://github.com/1weiho/open-slide) | `create-slide`, `slide-authoring`, `apply-comments`, `current-slide`, `create-theme` |
| [google-analytics-mcp](https://github.com/googleanalytics/google-analytics-mcp) | `exec-analytics-mcp`（MCP 設定與工具指南） |
| Vercel CLI | `exec-vercel-cli` |

## 履歷與報告格式

- 履歷：wport preview JSON → [`templates/resume/`](templates/resume/README.md)
- 報告：共用 report JSON → [`templates/report/`](templates/report/README.md)
- 範例輸出在 [`doc/resume/`](doc/resume/)（虛構範例資料，請換成你自己的）

渲染指令：

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html
```

## 同一專案：履歷站 + open-slide 簡報站（Vercel 雙站）

若 `doc/resume/`（靜態履歷 HTML）與 open-slide（`slides/` 簡報）**住在同一個 Git repo**，用 **兩個 Vercel Project** 指向同一 repo，各自設定不同的 Root / Output：

```text
my-workspace/
├── doc/resume/          ← 站 A：履歷 + 職涯報告（靜態 HTML）
├── slides/              ← open-slide 簡報原始碼
├── package.json         ← open-slide 的 build
└── ...
```

| Vercel Project | Root Directory | Build Command | Output Directory |
|----------------|----------------|---------------|------------------|
| `my-resume` | `doc/resume` 或 `.` | （可選）`node templates/resume/render.mjs ...` | `doc/resume` |
| `my-slides` | `.`（open-slide 根目錄） | `pnpm build` | `dist`（依 open-slide 設定） |

步驟：

1. `npx vercel login`
2. 在 Vercel Dashboard **New Project** → 選同一個 GitHub repo → 取名 `my-resume` → Settings 設 Output = `doc/resume`
3. 再 **New Project** → 同一 repo → 取名 `my-slides` → 設 Build = open-slide build、Output = `dist`
4. 各自 `vercel link` 或於 CI 使用不同的 `VERCEL_PROJECT_ID`

每個 project 會有獨立的 `*.vercel.app` 網址，也可綁不同自訂網域（例如 `resume.example.com` 與 `slides.example.com`）。

詳見 [`skills/exec-vercel-cli/SKILL.md`](skills/exec-vercel-cli/SKILL.md)。

## 目錄結構

```
wport-agents/
├── README.md
├── skills/
│   ├── INDEX.md              # 人類快查索引
│   ├── exec-wport-cli/
│   ├── gen-resume/
│   ├── hypelink-brand-page-mcp/
│   ├── create-slide/
│   └── ...
├── templates/
│   ├── resume/
│   └── report/
└── doc/
    └── resume/               # 預設輸出（範例資料）
```

## 貢獻

1. Skill 正文以英文或繁中皆可；AI 產出預設繁體中文。
2. Prompt 寫在 `SKILL.md`，不另建 Python runtime。
3. 履歷格式變更先改 `templates/resume/`；報告先改 `templates/report/`。
4. 新增 executor 用 `exec-*`；generator 用 `gen-*` 或語意化名稱。

## 相關連結

- [@wport/cli](https://www.npmjs.com/package/@wport/cli)
- [HypeLink MCP 文件](https://hypelink.app/docs/ai/mcp)
- [open-slide](https://github.com/1weiho/open-slide)
- [Google Analytics MCP](https://github.com/googleanalytics/google-analytics-mcp)

## License

MIT
