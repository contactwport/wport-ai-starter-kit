# 更新紀錄

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
