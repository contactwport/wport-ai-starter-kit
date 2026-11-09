---
name: gen-form-filler
description: >-
  Fill existing Word (.docx) and Excel (.xlsx) forms with the user's own data
  from Obsidian (ssot/個人/*.md or an external vault path), then apply simulated
  red seals (大章 / 小章) to the signature block. Use when the user asks to
  「幫我填這份表單／申請書」, 「用我的 Obsidian 資料填 docx/xlsx」, 「幫我蓋大小章」,
  government grant applications (含自傳、商業計畫書), 應徵資料表, 報名表, or the
  blank forms in practice/01-fill-forms/. Not for creating a resume (gen-resume)
  and not for filling web forms in a browser.
---

# gen-form-filler

把**既有的空白表單**（.docx / .xlsx）用使用者自己的資料填滿，需要時在用印欄蓋上模擬印章。

資料來源永遠是 **Obsidian**：repo 內的 [`ssot/個人/`](../../ssot/個人/README.md)，或使用者指定的外部 vault 路徑（例如 `~/Documents/obsidian/.../個人履歷.md`）。

練習素材：[`practice/01-fill-forms/`](../../practice/01-fill-forms/README.md)

## 核心前提：表單沒有佔位符

真實的表單只有**欄位標題與空白格**，不會貼心地寫 `{{姓名}}`。所以填表不是字串取代，而是：

1. 讀懂表格左欄或表頭寫什麼
2. 到 Obsidian 找對應的事實
3. 寫進右邊那一格

空白表單的三種書寫區，都靠**標題文字**定位：

| 型態 | 長相 | 怎麼填 |
|------|------|--------|
| 標題／內容表 | 左欄「聯絡電話」、右欄空白 | 比對左欄文字 → 寫右欄 |
| 單格書寫區 | 章節標題下方一個大空框（自傳、商業計畫書各節） | 找標題後**緊接的 1×1 表格** → 寫進去 |
| 格狀表 | 表頭「經費項目／單價／數量／小計／說明」 | 比對表頭 → 一列列填 |

## 何時用哪個 skill

| 使用者要的 | Skill |
|-----------|-------|
| 填 Word／Excel 表單、蓋章 | **本 skill** |
| 從零做履歷、訪談 | `gen-resume` |
| 針對職缺客製履歷 | `gen-resume-optimizer` |
| 在**網頁**上填表單（Google 表單、wport 等） | 瀏覽器工具，不是本 skill |

## 前置

```bash
pip install python-docx openpyxl Pillow
```

## Workflow

### 1. 盤點：表單要什麼、Obsidian 有什麼

1. 讀空白表單，**列出所有欄位標題**（含章節標題與表頭），不要只看第一頁。
2. 讀資料來源（預設 `ssot/個人/resume.md`；使用者給外部路徑就讀那份）。
3. 在聊天中輸出**對照表**：

| 表單欄位 | 準備填入 | 來源 |
|---------|---------|------|
| 負責人／申請人姓名 | 林小範 | `ssot/個人/resume.md` §基本資料 |
| 統一編號／身分證字號 | **缺** | — |

4. **缺的欄位一次問完**（身分證字號、地址、金額這種 Obsidian 不會有），不要邊填邊問。
5. 需要**創作**的段落（自傳、商業計畫書、計畫摘要）先在聊天中給**大綱**讓使用者確認方向，再動筆寫進檔案。這些段落必須建立在 Obsidian 的真實經歷上，不可憑空杜撰市場數據、客戶數或營收。

### 2. 確認敏感資料的去向

填好的檔案**預設寫到 `practice/01-fill-forms/output/`**（已被 `.gitignore` 排除）。

動手前提醒使用者：

> 這份會含身分證字號／地址等個資，我會存在本機 `output/`，不會 commit。若您要另存到 Obsidian 或雲端，請告訴我路徑。

### 3. 填入 docx

寫一支**用完即丟**的腳本（不要在 repo 留下常駐 runtime）。關鍵是**依文件順序**走訪段落與表格，才能把「章節標題」和「它下面的書寫區」對起來：

```python
from docx import Document
from docx.oxml.ns import qn
from docx.table import Table
from docx.text.paragraph import Paragraph

def iter_blocks(doc):
    for child in doc.element.body.iterchildren():
        if child.tag == qn("w:p"):
            yield Paragraph(child, doc)
        elif child.tag == qn("w:tbl"):
            yield Table(child, doc)
```

- **標題／內容表**：`row.cells[0].text.strip()` 命中欄位名，就寫 `row.cells[1]`。
- **單格書寫區**：記住最近一個章節標題，遇到 `len(rows) == 1 and len(columns) == 1` 的表格就把該節內容寫進去。
- **格狀表**：用 `tuple(表頭文字)` 當 key 對應資料列；空白列不夠時 `table.add_row()`。
- 儲存格要**多行**時用 `cell.add_paragraph()`，不要塞 `\n`（Word 不會換行）。
- 新加的 run 要設中日韓字型，否則中文會掉回預設字體：

```python
run.font.name = "Times New Roman"
run.element.rPr.rFonts.set(qn("w:eastAsia"), "標楷體")
```

- 勾選框 `□` 改成 `☑`；`＿＿＿ 年 ＿＿ 月` 這種底線欄位整段換掉。
- 金額用千分位、日期問清楚是**西元或民國**（政府表單多為民國：西元 − 1911）。

### 4. 填入 xlsx

```python
from openpyxl import load_workbook
wb = load_workbook("forms/個人資料彙整表_空白.xlsx")
```

- 縱向表（第一欄是欄位名，如「基本資料」「自傳與敘事」）：比對 A 欄文字 → 寫 B 欄。
- 橫向表（第一列是表頭，如「工作經歷」）：資料比空白列多就 `ws.append()`，並沿用既有框線與 `Alignment(vertical="top", wrap_text=True)`。
- 不要動表頭列與欄寬。

### 5. 蓋章（大小章）

用印欄是一個 2×2 表格：第一列是標題「申請單位印信（大章）」「負責人／申請人印章（小章）」，第二列留白等你蓋。

```python
from docx.shared import Cm

def stamp(cell, image, width_cm):
    cell.paragraphs[0].add_run().add_picture(image, width=Cm(width_cm))

# 找到表頭含「大章」的表格，蓋在它的第二列
stamp(table.cell(1, 0), "assets/seal-org.png", 3.6)       # 大章
stamp(table.cell(1, 1), "assets/seal-personal.png", 2.2)  # 小章
```

- 印章 PNG 是**透明背景**，蓋在儲存格或簽名列上不會擋住底線。
- 尺寸慣例：大章 3.5–4 cm、小章 2–2.5 cm。

### 6. 交付與自我檢查

- [ ] 每個欄位標題都有對應內容，該留白的另外列出來告訴使用者
- [ ] 沒有杜撰的公司、學歷、金額、日期、市場數據
- [ ] 民國／西元年沒有搞混
- [ ] 經費類表格：小計加總 = 合計，且與「申請補助金額」一致
- [ ] 自傳、商業計畫書各節都在對應的書寫區內，沒有寫錯格
- [ ] 大小章都貼上且沒有蓋掉文字
- [ ] 檔案在 `output/`，不在 git 追蹤範圍

回報時給**檔案路徑**與**仍需人工確認的欄位清單**。

## Guardrails

- **不杜撰**。Obsidian 沒有的就問使用者；使用者說沒有就填「（待補）」，不要自己編一個身分證字號、統一編號、市場規模或客戶數。
- 引用外部統計（市場家數、產業規模）要註明來源，或改寫成使用者可自行查證的敘述。
- **印章是模擬圖檔**，僅供練習與版面示意；不是法定印鑑，不可用於真實申請、契約或報稅文件。使用者要交件時提醒用真章重蓋。
- **不要把個資 commit 進 repo**。填好的檔案留在 `output/`；要交件請使用者自行搬移。
- 不要修改 `forms/` 下的空白表單母版；一律 `Document(空白檔)` → 另存到 `output/`。
- 表單語意不明時（例如「自籌款」該填多少）先問，不要替使用者做財務決定。
