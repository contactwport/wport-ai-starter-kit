# 練習題：讓 AI 幫你填表單

核心觀念只有一個 — **資料只寫一次（Obsidian），其他表單交給 AI 抄**。

| # | 練習 | 填什麼 | 用到的能力 |
|---|------|--------|-----------|
| 1 | [離線表單](01-fill-forms/) | Word 補助計畫申請書（含自傳、商業計畫書）+ Excel 個人資料彙整表 | 讀 Obsidian → 填 docx/xlsx → **蓋大小章** |

## 開始之前

```bash
pip install python-docx openpyxl
```

**資料來源**：預設是 repo 內的 [`ssot/個人/resume.md`](../ssot/個人/README.md)（虛構人物「林小範」，可直接拿來試跑）。
換成你自己的，就把 Obsidian 筆記路徑告訴 AI，例如：

> 用 `~/Documents/obsidian/my-vault/個人履歷.md` 的資料填 `practice/01-fill-forms/forms/補助計畫申請書_空白.docx`

還沒有 Obsidian 筆記？先跑 [`gen-resume`](../skills/gen-resume/) 做一次訪談，它會幫你寫進 `ssot/個人/`。

## 三個規矩

1. **個資不進 git** — 填好的檔案一律放 `01-fill-forms/output/`（已 gitignore）。要交件自己搬走。
2. **印章是模擬圖** — `assets/*.png` 只是練習用的紅色圖檔，不是法定印鑑，不能拿去交真的申請案。
3. **AI 不准編資料** — 缺的欄位它應該回頭問你，看到它自己生出一組身分證字號就是出錯了。
