# 給 AI 的工作說明（OpenCode／Claude Code 都會讀這份）

這個資料夾是一間店的「品牌大腦」加上 10 張社群文圖模板。你的工作是幫店家做行銷素材。

> 在老師的工具包（wport-ai-starter-kit）裡：模板在 `templates/posts/`、範例品牌資料在 `ssot/店家/`。搬到店家自己的資料夾後，就是下面寫的位置。

## 資料在哪
- `品牌資料.md` 和 `品牌資料/`：品牌故事、商品、客群、語氣、價格、營業資訊。**所有文案的內容都只能從這裡來**，沒寫的事不要自己編（價格、日期、地址尤其不能猜）。缺資料就先問店家，問完把答案寫回對應的筆記。
- `照片/`：店家自己拍的照片。
- `templates/`：10 張模板（1080×1350）。

## 做文圖的規則
1. 每張模板最下面有 `<script id="data" type="application/json">`。**只改這段 JSON**，不要改 HTML、CSS、`render.js`。
2. 要新的一張，就複製模板改檔名（例如 `templates/01-new-product-桂花.html`），再改 JSON。
3. 照片欄位填相對路徑，例如 `"../照片/latte.jpg"`；沒有照片就填 `""`，不要拿網路圖。
4. 風格只改 `templates/theme.css` 的那一行 `@import`（10 種風格在 `templates/themes/`），照 `品牌資料/品牌設定.md` 的「風格」。
   預設風格 `00-default` 用 `templates/brand.css` 的顏色、字型；其他風格自帶配色，店家想保留品牌色就在 `theme.css` 最下面加 `:root{--main:…;--accent:…}`。
   不要改 `templates/themes/` 裡的檔案。
5. 字數：標題 12 字內、說明 40 字內；放不下就刪字，不要縮小字體。
6. 輸出圖片：`node scripts/render.mjs 01`（數字是模板編號，不加就全部），圖在 `out/`。輸出後打開圖片確認沒有字被切掉。
7. 店家想先比較風格：`node scripts/render.mjs 01 --theme=all`，圖在 `out/themes/<風格>/`；只試一種用 `--theme=03`（不會改 theme.css）。

## 寫貼文文案
- 語氣照 `品牌資料/品牌語氣.md`。
- 同一張圖，FB、IG、LinkedIn 各寫一版：
  - IG：3–5 行，最後 3–5 個 hashtag
  - FB：可以多講一點故事，附營業資訊
  - LinkedIn：從經營者角度講心得，不放 hashtag 堆疊
- 每版存成 `out/<模板檔名>.fb.txt`、`.ig.txt`、`.linkedin.txt`。

## 發文
- FB 粉專：`node scripts/post-fb.mjs <圖片> <文案.txt>` 先試跑；店家確認後才加 `--live`。**沒有店家明確說「發」就不要加 --live。**
- 金鑰只放 `.env`，不要寫進其他檔案、不要貼進對話、不要 commit。

## 不要做的事
- 不要用 AI 生食物、商品的照片。
- 不要把手機、身分證、銀行帳號這類私人資料寫進任何檔案（這個 repo 可能是公開的）。
