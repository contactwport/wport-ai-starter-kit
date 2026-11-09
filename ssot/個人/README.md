# 個人版 SSOT（Obsidian）

個人敘事的單一事實來源。`gen-resume` 訪談結果寫這裡；做個人品牌站時以這裡為內容，再用 `frontend-design` 規劃視覺。

## 現況（夠用就好）

```
ssot/個人/
├── resume.md      # 履歷全文（含求職／較私密欄位）
└── about-me.md    # 公開敘事（網站／品牌用）
```

對 AI 來說：**清楚的標題階層 + 固定檔名** 就夠，不必先上複雜 YAML。

## 長大以後再分類（可選）

筆記變多時，用**資料夾**拆，比一堆 frontmatter 更好維護：

```
ssot/個人/
├── resume.md
├── about-me.md          # 總覽／hero／一句話定位（可 wiki-link 到下面）
├── projects/
│   ├── order-service.md
│   └── obs-stack.md
├── experience/          # 可選：每份工作一則
└── writing/             # 可選：文章、演講
```

`about-me.md` 保持短總覽；細節用 `[[projects/order-service]]` 連過去。建站時 agent 先讀 `about-me`，再按需展開連結。

## 要不要 YAML？

| | 建議 |
|--|------|
| **現在（2～3 份 SSOT）** | **不需要**。Markdown 標題就好。 |
| **之後（很多專案／要篩選）** | 可加**極薄** frontmatter，方便 Obsidian Bases／Dataview，不是為了「AI 才看懂」。 |

若要加，保持短：

```yaml
---
type: project          # about | resume | project | writing
status: public         # public | private
updated: 2026-07-25
---
```

原則：

- **真相在正文**，YAML 只做分類／可見性，不要把經歷全文塞進 properties。
- 公開站只吃 `status: public`（或只讀 `about-me` + `projects/`）。
- 不要為了 AI 維護第二套 schema；AI 讀標題與列表通常比讀 YAML 更穩。

## 和 skills 的關係

1. `gen-resume` → 更新 `resume.md` + `about-me.md`
2. 跟 agent 說：以 `ssot/個人/about-me.md` 為內容 → 用 `frontend-design` 規劃／實作網站
3. 上線 → `exec-vercel-cli`
