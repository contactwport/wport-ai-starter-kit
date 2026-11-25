# 更新紀錄

## 2026-11-25　一頁式範例重做、themes 不會再截到別的資料夾

- `templates/website/astro/code_artifact.html`：一頁式範例重做（總覽第一張 00-one-page）。內容跟 10 種風格同一份（盧小熙），有大頭照、數字、作品封面、經歷時間軸、GSAP 進場動畫；單一檔案，直接打開就能看，沒照片也不會破版。
- `npm run themes`：一頁式會帶上 `public/images/` 的照片；4400 被別的資料夾的預覽佔用時改用下一個 port，不會截到別人的畫面。

## 2026-11-24　個人網站只留 astro 一套，README 重寫

學生說「做個人網站」時，AI 可能拿到舊範本，或用舊 prompt 的範例人物「林小安」（英文名 An Lin，頭像縮寫變成 AL）。

- 拿掉 `templates/website/personal/`（一頁式＋eric-personal-site）、`templates/website/render.mjs`、`cute.css`、`terminal.css`、`examples/`（JSON 產網站），以及只給它用的 `ssot/個人/about-me.md`。一頁式 `code_artifact.html` 已在 astro 裡。
- `templates/website/README.md` 改成分流：個人網站只用 `astro/`，店家官網用 `shop/`。
- `skills/gen-resume`、`skills/INDEX.md`、`ssot/` 的 README 把「做網站」都指到 `templates/website/astro/`；`frontend-design` 只用來改視覺。
- 根目錄 `AGENTS.md` 註明只管店家文圖。
- 根目錄 README 重寫：每種成品只有一套範本的對照表、容易搞混的地方、兩種課怎麼拿、資料夾、Skills。

## 2026-11-24　第 1 堂的一頁式併進 astro，總覽變 11 個版本

- `templates/website/astro/code_artifact.html`：第 1 堂用聊天 AI 做的一頁式網站（範例是老師的，學生換成自己的）。
- `npm run themes` 會把它放到 `dist-themes/00-one-page/`，跟 10 種風格一起截圖、列在 http://localhost:4400/ 第一張，每一個都能點進去操作。資料夾上一層有 `code_artifact.html` 也會抓。
- README、AGENTS.md 補上 `code_artifact.html` 的用法。

## 2026-11-24　README 的 10 張預覽圖可以點開

之前 README 的 10 張預覽只是圖片，點了不會開。

- 預覽圖和編號連到本機 `http://localhost:4400/<編號>/`：先跑 `npm run themes`，再點就會打開那個風格的完整網站。
- `npm run themes` 總覽頁的連結與縮圖改成相對路徑；沒截圖時縮圖用 `previews/*.jpg`；支援 `DEMO_BASE`（之後要放到子路徑時用）。

## 2026-11-23　Astro 範本 10 種風格全部重做（作品集等級）

舊版 10 種風格共用同一套骨架，只換顏色和小版型，質感不夠。這次每一種都重做成一整套網站。

- 每個風格自己擁有版面：`src/themes/<編號>/` 有自己的 `Layout.astro`、9 個頁面、元件和 CSS；共用的只剩資料讀取、`<head>`、聯絡表單、動畫工具。規則見 `src/themes/README.md`。
- 加入 GSAP（ScrollTrigger、SplitText）和 Lenis 平滑捲動；`?shot` 和「減少動態」時直接顯示最後狀態。
- 範例人物改成「盧小熙」：用老師本人的照片轉成線條插畫（去背＋線稿＋幾何色塊），作品是老師真的做過的專案（WPORT、桃園青諮會國際展望組、創業人生、無白丁會所），封面是真實網站截圖、附真網址；經歷與兩篇文章取自老師個人網站。
- 內容欄位新增 `photos`（關於頁照片）、`gallery`（作品頁更多截圖）、文章 `cover`；網頁版 AI prompt 要求照片先留空。
- 每種風格都設計了「沒有照片」的版面（`npm run shoot -- <編號> --no-images` 檢查）。
- 新工具 `npm run shoot -- <編號>`：建置一個風格並把每一頁截圖（桌機＋手機）。
- 移除舊的共用骨架 `src/legacy`。
- 10 種風格拉開差異：01 瑞士海報（滿版紅）、03 像素冒險、04 液態玻璃、06 復古桌面、07 藍染雜誌、10 永遠淺色的紙本履歷；每個風格有自己的 favicon（名字第一個字＋風格配色）。
- 範例人物盧小熙的照片改成手繪向量插畫（線條＋大色塊）。

## 2026-11-23　個人網站 Astro 版：10 種風格、多頁、聯絡表單

舊版是一頁式 HTML，AI 要自己排版，免費模型做出來偏陽春。新版把版面全部寫成程式，AI 只負責內容。

- 新增 `templates/website/astro/`：Astro 7 多頁網站，首頁、關於、作品（列表＋每個作品一頁）、經歷、文章、聯絡、404。
- 10 種風格（`src/themes/01–10`）：瑞士編輯、Bento、極簡、極光暗色、新粗獷、終端機、文藝雜誌、作品集工作室、柔和黏土、履歷 CV。不只換顏色，頁首、首頁主視覺、作品列表、經歷的版型也不同。`site.config.mjs` 改一行就換。
- 內容分工：網頁版 Gemini／ChatGPT 照 `網頁版AI-prompt.md` 寫好 `網站內容.md`，`npm run import` 拆進 `src/content/` 並檢查格式；OpenCode 只跑指令。prompt 寫了內容品質要求（作品三段、成果要數字、不准編）。
- `npm run themes`：用自己的內容做出 10 種版本加截圖，在 http://localhost:4400 比較。
- `.github/workflows/deploy.yml`：推上 main 自動部署 GitHub Pages，子路徑自動處理。
- `contact-worker/`：Cloudflare Worker＋D1 聯絡表單，含擋機器人、IP 限流、只允許自己的網站；有網域可開寄信通知（寄到驗證過的自己信箱，免費）。
- `personal/` 保留為一頁式舊版；README 的課程下載表改成 `astro/`。
- `npm run import` 也會找上一層的 `網站內容.md`；網站放在 Obsidian 保管庫裡（例如 `my-portfolio/site/`）時，自動請 Obsidian 略過網站資料夾。
- `npm run dev`、`npm run themes` 給 AI 跑時會把預覽放到背景，指令不會卡住；`npm run dev` 每次先關掉舊的再開，改了 `site.config.mjs` 再跑一次就套用。

## 2026-11-09　AGENTS.md 檔名跟上課簡報一致

- 新文圖檔名改成 `<編號>-mine.html`（例如 `templates/01-mine.html`），文案存 `out/01-mine.fb.txt`，跟簡報裡的指令一樣。
- 出圖後只回報檔案路徑，不再叫 AI 打開圖片（免費模型看圖很耗額度）。
- 列出 `品牌資料/` 各份筆記的固定名稱，不准另開新檔；補上官網 `my-site.html` → `site/` 的位置。

## 2026-11-09　店家官網範本第 2 版

- `templates/website/shop/index.html` 重寫：加手機漢堡選單、底部導航／私訊按鈕列、好評左右滑、內嵌 Google 地圖、回到頂端按鈕。
- 加動畫：標題逐行浮現、捲到才浮現、照片推近、關鍵字跑馬燈、卡片滑過浮起、問答展開；支援「減少動態」。
- 新增數字區（每日限量、營業時間、評分）和本週優惠的閃爍提示。

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
