# 更新紀錄

## 2026-11-09　資料夾照用途整理

合併後同一類東西散在好幾個地方，照 README 的五項重新排：

| 原本 | 現在 |
|---|---|
| `vault/`、`vibe-coding/我的資料/`、`brand/品牌資料/`（三個 Obsidian） | `ssot/個人/`、`ssot/店家/`（一個 Obsidian，`.obsidian/` 只留一份） |
| `brand/templates/` | `templates/posts/` |
| `vibe-coding/` 的網站 | `templates/website/personal/` |
| `doc/website/`（範例成品） | `templates/website/examples/output/` |
| （新增） | `templates/website/shop/`：店家形象官網範本 |
| `brand/scripts/` | `scripts/`（`render.mjs` 兩種位置都找得到模板：學員資料夾的 `templates/`、工具包的 `templates/posts/`） |
| `brand/AGENTS.md`、`brand/.env.example`、`brand/照片/` | 放到最上層 |
| `brand/.gitignore`、`vibe-coding/.gitignore` | 併進最上層 `.gitignore` |

- Skill、練習、README 裡的 `vault/` 路徑都改成 `ssot/個人/`；履歷、報告的路徑沒變。
- 新增 `ssot/README.md`、`templates/website/shop/README.md`；README「上課怎麼拿」和目錄結構改成新位置。


## 2026-11-09　README 開頭改寫

- 開頭說明這包的來由：Eric 教了十多場 AI 課，每場都圍繞「一份 md（SSOT）做出網站、文圖、履歷」，整理出共用的模板和腳本。
- 新增「核心：一份 md，長出所有東西」流程圖。
- 新增「這包裡有什麼」五項：md as SSOT 範本、個人品牌網站、SSOT 產生的文圖、SSOT 做履歷（WPORT CLI）、CLI 和常見工具，各自對應資料夾。
- 求職相關 Skill 歸在「SSOT 做履歷」和「CLI 和常見工具」底下；適用對象加上小店家、個人品牌。

## 2026-11-09　合併課程模板

把散在個人帳號的 repo 收到這裡，之後只維護這一份。

- 新增 `brand/`：原 `ericlu-sys/brand_template`（品牌行銷 AI 加速器）。品牌資料範例、10 張文圖模板、10 種風格、`scripts/render.mjs` 出圖、`scripts/post-fb.mjs` 發 FB。
- 新增 `vibe-coding/`：原 `ericlu-sys/teaching_template`（Vibe Coding 工作坊）。我的資料範例、一頁式網站、進階個人網站。
- `ericlu-sys/ai-junior-starter-kit` 跟本 repo 內容完全一樣，課程簡報的連結改到這裡後刪除。
- README 新增「課程資料夾」說明和下載方式；兩個課程的 README 把「Use this template」改成從這裡下載。
- `.gitignore` 加 `!**/.env.example`，讓課程的設定範例檔留在 repo（金鑰本身 `.env` 仍然不會上傳）。
