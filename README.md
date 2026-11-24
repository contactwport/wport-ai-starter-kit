# wport-ai-starter-kit

Eric Lu 盧旭熙 在大學、企業和在地店家上 AI 課用的工具包。每一場課都是同一個做法：

1. 先用 Markdown 把自己（或店）的資料寫成一份 **SSOT**（單一資料來源，用 Obsidian 編輯）。
2. 讓聰明的**網頁版 AI**（Gemini／ChatGPT）從這份資料寫內容。
3. 讓 **OpenCode**（免費模型）只跑固定的指令：匯入、建置、出圖、上線。

資料改一次，網站、文圖、履歷全部跟著對。

```
SSOT（Obsidian 筆記）
  ├── 我的資料（個人）──► 個人網站   templates/website/astro/   → GitHub Pages
  │                    └► 履歷       skills/gen-resume、WPORT CLI
  └── 品牌資料（店家）──► 社群文圖   templates/posts/ + scripts/ → FB 粉專
                       └► 店家官網   templates/website/shop/    → Vercel
```

## 先看這裡：要做什麼，用哪一個

每一種成品**只有一套範本**。給 AI 的時候直接指名資料夾，它就不會拿錯。

| 要做什麼 | 唯一的範本 | 內容從哪來 | 範例人物／店 | 說明書 |
|---|---|---|---|---|
| **個人網站**（作品集、portfolio） | `templates/website/astro/` | `ssot/個人/我的資料` → 網頁版 AI 寫 `網站內容.md` | 盧小熙（老師本人資料改的） | [`templates/website/astro/README.md`](templates/website/astro/README.md)、給 AI 的 [`AGENTS.md`](templates/website/astro/AGENTS.md) |
| **社群文圖**（10 張範本、10 種風格） | `templates/posts/` | `ssot/店家/品牌資料` | 竹籬笆咖啡（虛構） | [`templates/posts/README.md`](templates/posts/README.md)、根目錄 [`AGENTS.md`](AGENTS.md) |
| **店家官網**（一頁式） | `templates/website/shop/` | `ssot/店家/品牌資料` | 竹籬笆咖啡（虛構） | [`templates/website/shop/README.md`](templates/website/shop/README.md) |
| **履歷**（WPORT 線上履歷） | `skills/gen-resume/`、`templates/resume/` | 訪談 → `ssot/個人/resume.md` | 林小範（虛構，只給履歷和表單練習） | [`skills/gen-resume/SKILL.md`](skills/gen-resume/SKILL.md) |
| **填表單、蓋章** | `skills/gen-form-filler/`、`practice/` | `ssot/個人/` | 林小範 | [`practice/README.md`](practice/README.md) |

容易搞混的地方：

- 個人網站**只有 astro 一套**。以前的一頁式 `personal/`、JSON 產網站的 `render.mjs`（cute／terminal）都已經拿掉；第 1 堂用聊天 AI 做的一頁式 `code_artifact.html` 現在放在 astro 裡，`npm run themes` 會跟 10 種風格一起列出來比較。
- 個人網站的範例人物是**盧小熙**。看到林小安（舊版 prompt 的範例）就是拿到舊資料；林小範只用在履歷和填表單練習。
- 根目錄的 `AGENTS.md` **只管店家文圖**。做個人網站時，AI 要讀的是 `templates/website/astro/AGENTS.md`。
- `skills/frontend-design` 是改版面視覺用的，不是用來從零做個人網站。

## 上課怎麼拿

需要的工具（Node.js 24、Git、GitHub CLI、Obsidian、OpenCode）照 [WPORT 課前準備](https://wport.me/services/ai-training/prepare) 一鍵安裝、自我檢查。

### Vibe Coding 工作坊（大學生、求職者）：個人網站

在桌面開一個資料夾（例如 `my-site`），用 OpenCode 打開，貼上：

```
run: git clone --depth 1 https://github.com/contactwport/wport-ai-starter-kit.git _kit
run: node -e "require('fs').cpSync('_kit/templates/website/astro','.',{recursive:true})"
run: node -e "const fs=require('fs');fs.cpSync('_kit/ssot/個人/我的資料.md','我的資料.md');fs.cpSync('_kit/ssot/個人/我的資料','我的資料',{recursive:true})"
run: node -e "require('fs').rmSync('_kit',{recursive:true,force:true})"
run: npm install
```

接下來照 [`templates/website/astro/README.md`](templates/website/astro/README.md)：

1. 用 Obsidian 打開資料夾，把 `我的資料.md`、`我的資料/` 換成你的（老師的資料當範例）。網頁版 AI 訪問你，再貼上 `網頁版AI-prompt.md`，下載它寫的 `網站內容.md` 放在「下載」。
2. `npm run import` 匯入內容，`npm run dev` 看網站（http://localhost:4321）。
3. `npm run themes` 打開 http://localhost:4400/ 比較 11 個版本（第 1 堂一頁式＋10 種風格），每一個都能點進去操作；選好改 `site.config.mjs` 的 `theme`。
4. 推上 GitHub，GitHub Pages 自動上線；聯絡表單照 `contact-worker/README.md` 接 Cloudflare D1。

### 品牌行銷 AI 加速器（小店家、個人品牌）：文圖、店家官網

| 從 `_kit` 搬這些 | 到你的資料夾變成 |
|---|---|
| `templates/posts/` | `templates/` |
| `scripts/` | `scripts/` |
| `ssot/店家/` 裡的東西 | `品牌資料.md`、`品牌資料/` |
| `照片/`、`AGENTS.md`、`.env.example` | 同名 |
| `templates/website/shop/index.html`（要做官網才搬） | `my-site.html` |

之後照根目錄 [`AGENTS.md`](AGENTS.md)：只改模板裡的 JSON、`node scripts/render.mjs` 出圖、`node scripts/post-fb.mjs` 試跑發文（店家說「發」才加 `--live`）。

以前的 `ericlu-sys/brand_template`、`ericlu-sys/teaching_template` 都已經合併到這裡，之後只更新這一份。改了什麼見 [`CHANGELOG.md`](CHANGELOG.md)。

## 資料夾

```
wport-ai-starter-kit/
├── README.md               這份：總覽、要用哪個範本
├── AGENTS.md               給 AI 的規則：只管店家文圖、發文
├── CHANGELOG.md            更新紀錄
├── .env.example            FB 粉專發文用的金鑰範本（複製成 .env）
├── ssot/                   ① 資料（用 Obsidian 打開）
│   ├── 個人/               我的資料.md＋我的資料/（老師的公開資料）、resume.md（林小範，履歷練習）
│   └── 店家/               品牌資料.md＋品牌資料/（竹籬笆咖啡）
├── templates/
│   ├── website/
│   │   ├── astro/          ② 個人網站（唯一）：10 種風格、一頁式比較、聯絡表單 contact-worker/
│   │   └── shop/           店家官網
│   ├── posts/              ③ 社群文圖：10 張範本、10 種風格
│   ├── resume/             ④ 履歷 HTML（wport JSON → render.mjs）
│   ├── report/             職涯、客製化、面試報告
│   └── shared/             WPORT 品牌色
├── scripts/                文圖出圖（render.mjs）、發 FB（post-fb.mjs）
├── 照片/                   店家自己拍的照片
├── skills/                 ⑤ 給 AI 讀的說明書（見 skills/INDEX.md）
└── practice/               練習：填 Word／Excel 表單、蓋大小章
```

跑 skill 產生的履歷、報告會寫到 `doc/`（不進 repo）。

## Skills（給 AI 讀的說明書）

把需要的 `skills/<名稱>/` 放進你 AI 工具的 skills 資料夾（OpenCode、Claude Code、Cursor 都支援），之後直接用講的。完整清單見 [`skills/INDEX.md`](skills/INDEX.md)。

| Skill | 做什麼 | 你可以這樣說 |
|---|---|---|
| [`gen-resume`](skills/gen-resume/) | 訪談做履歷，寫進 `ssot/個人/` | 「幫我從這些經歷做一份 wport 履歷」 |
| [`gen-resume-optimizer`](skills/gen-resume-optimizer/) | 照職缺客製履歷＋報告 | 「針對 enc_id `xxx` 客製履歷」 |
| [`interviewer-ai`](skills/interviewer-ai/) | 10 道面試題 | 「用這份 JD 出 10 道魔鬼題」 |
| [`gen-career-mentor`](skills/gen-career-mentor/) | 能力差距、1/3/5 年計畫 | 「我想成為 Senior 後端，給我路線圖」 |
| [`gen-form-filler`](skills/gen-form-filler/) | 用 Obsidian 資料填 Word／Excel、蓋大小章 | 「用我的資料填這份申請書並蓋章」 |
| [`exec-wport-cli`](skills/exec-wport-cli/) | `@wport/cli`：搜職缺、讀 JD、建履歷 | 「找台北的前端職缺」 |
| [`exec-vercel-cli`](skills/exec-vercel-cli/) | 用 Vercel 上線 | 「把店家官網 deploy 到 Vercel」 |
| [`exec-analytics-mcp`](skills/exec-analytics-mcp/) | GA4 報表 | 「查 GA4 過去 30 天流量」 |
| [`hypelink-brand-page-mcp`](skills/hypelink-brand-page-mcp/)、[`hypelink-event-mcp`](skills/hypelink-event-mcp/) | HypeLink 品牌頁、活動報名 | 「建一場講座，加早鳥票」 |
| [`frontend-design`](skills/frontend-design/) | 版面視覺（第三方） | 「這一頁不要長得像 AI 模板」 |

渲染履歷、報告：

```bash
node templates/resume/render.mjs doc/resume/resume.json doc/resume/resume.html
node templates/report/render.mjs doc/resume/interview-prep.json doc/resume/interview-prep.html
```

## 不要放進 repo 的東西

這個 repo 和學生的網站 repo 都是公開的：手機、地址、生日、身分證字號、銀行帳號、證件照片、帳號密碼、API Key 都不要放。金鑰只放 `.env`（已在 `.gitignore`）。

## 改範本（給老師、助教）

- 個人網站的風格怎麼做、要遵守什麼：[`templates/website/astro/src/themes/README.md`](templates/website/astro/src/themes/README.md)。改了範例內容要跑 `npm run prompt` 重新產生 `網頁版AI-prompt.md`。
- 文圖模板只改 JSON 區塊的規則寫在根目錄 `AGENTS.md`，風格在 `templates/posts/themes/`。
- 履歷格式先改 `templates/resume/`，報告先改 `templates/report/`。
- Skill 寫在 `SKILL.md`，不另建 Python runtime；executor 用 `exec-*`，generator 用 `gen-*`。
- 改動走分支＋PR，合併後在 `CHANGELOG.md` 記一筆。

## 相關連結

- [WPORT 課前準備](https://wport.me/services/ai-training/prepare)
- [@wport/cli](https://www.npmjs.com/package/@wport/cli)
- [HypeLink MCP 文件](https://hypelink.app/docs/ai/mcp)
- [Google Analytics MCP](https://github.com/googleanalytics/google-analytics-mcp)

## License

MIT
