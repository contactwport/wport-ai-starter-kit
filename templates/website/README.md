# 網站範本

| 要做什麼 | 用哪個 | 說明 |
|---|---|---|
| **個人網站**（學生、求職者、個人品牌） | [`astro/`](astro/README.md) | 唯一的個人網站範本：多頁（首頁、關於、作品、經歷、文章、聯絡）、10 種風格、網頁版 AI 寫內容＋`npm run import`、`npm run themes` 在 http://localhost:4400/ 比較 11 個版本（第 1 堂一頁式＋10 種風格）、GitHub Pages 自動部署、聯絡表單接 Cloudflare D1 |
| **店家官網**（品牌行銷課） | [`shop/`](shop/README.md) | 一頁式店家形象官網，竹籬笆咖啡（虛構）當範例，內容來自 `ssot/店家/` |

給 AI：使用者說「個人網站」「作品集」「portfolio」，一律用 `astro/`，照 `astro/AGENTS.md` 做，不要從零寫 HTML，也不要用店家的 `shop/`。範例人物是「盧小熙」，看到其他名字（林小安、林小範）都是舊資料。

舊的 `personal/`（一頁式）、`render.mjs`＋`cute.css`／`terminal.css`（JSON 產網站）已經拿掉：一頁式 `code_artifact.html` 併進 `astro/`。
