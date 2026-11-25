# 個人版 SSOT（Obsidian）

用 Obsidian「開啟資料夾作為保管庫」打開這裡。範例是 Eric 盧旭熙 的公開資料，全部換成你的。

| 檔案 | 是什麼 | 誰會用 |
|---|---|---|
| `我的資料.md` | 索引，連到 `我的資料/` 每一份筆記 | 個人網站、履歷、填表單 |
| `我的資料/` | 基本資料、求職方向、技能與證照、特質和例子、興趣、公開聯絡方式，每段經歷一份 | 同上 |
| `resume.md` | 虛構人物「林小範」的履歷全文 | 只給 `gen-resume`、`gen-form-filler` 和 `practice/` 試跑；**不是**個人網站的範例 |

## 做個人網站

個人網站只有一套範本：[`templates/website/astro/`](../../templates/website/astro/README.md)。

1. 把 `我的資料.md`、`我的資料/` 交給網頁版 AI（Gemini／ChatGPT），貼上 `templates/website/astro/網頁版AI-prompt.md`，它會寫出 `網站內容.md`。
2. OpenCode 跑 `npm run import` 把內容放進網站，`npm run themes` 比較風格。

網站範例人物是「盧小熙」（老師本人資料改的），不是林小範。

## 規則

- 一份筆記講一件事，索引連到每份筆記；沒有的資料寫「待確認」，不要編。
- 手機、地址、身分證、生日、銀行帳號不要放進公開 repo。
