# Skill Index（人類快查表）

> 給開發者用的速覽手冊。**AI 不靠這份**：Cursor / Claude 會讀每個 `SKILL.md` 的 YAML `description:` 來決定何時 invoke。
> 此 INDEX 讓你 5 秒內找到「我要叫哪個 skill」。

**適用對象：** 任何想用手 AI 做履歷、求職或品牌頁的人 — 不限學生、不限年資。

---

## wport 職涯（核心）

| Skill | 類型 | 你可以這樣說 |
|-------|------|-------------|
| [`exec-wport-cli`](exec-wport-cli/) | Executor | 「用 wport CLI 搜尋台北後端職缺」 |
| [`gen-resume`](gen-resume/) | Generator | 「幫我從筆記做一份履歷」 |
| [`gen-resume-optimizer`](gen-resume-optimizer/) | Generator | 「針對這個 enc_id 客製履歷」 |
| [`gen-career-mentor`](gen-career-mentor/) | Generator | 「我想轉 Senior 後端，給我 1/3/5 年計畫」 |
| [`interviewer-ai`](interviewer-ai/) | Generator | 「模擬這份 JD 的 10 道魔鬼面試題」 |
| [`gen-form-filler`](gen-form-filler/) | Generator | 「用我的 Obsidian 資料填這份補助計畫申請書並蓋大小章」 |

---

## HypeLink 品牌與活動（MCP）

來源：[HypeLinkOfficial/hypelink_claude_skill](https://github.com/HypeLinkOfficial/hypelink_claude_skill)

| Skill | 你可以這樣說 |
|-------|-------------|
| [`hypelink-brand-page-mcp`](hypelink-brand-page-mcp/) | 「把 IG 和官網加到品牌頁」「換深色主題」 |
| [`hypelink-event-mcp`](hypelink-event-mcp/) | 「建一場講座並開放報名」「加早鳥票種」 |

**前置：** HypeLink API Token + [MCP 設定教學](https://hypelink.app/docs/ai/mcp)

---

## 設計與個人品牌站

| Skill | 來源 | 你可以這樣說 |
|-------|------|-------------|
| [`frontend-design`](frontend-design/) | [anthropics/skills](https://github.com/anthropics/skills) | 「用 ssot/個人/about-me 規劃個人品牌站視覺」「這一頁不要長得像 AI 模板」 |

內容 SSOT：[`ssot/個人/README.md`](../ssot/個人/README.md)。`frontend-design` 管視覺，不管訪談與履歷 JSON。

---

## 部署與數據（Executors）

| Skill | 你可以這樣說 |
|-------|-------------|
| [`exec-vercel-cli`](exec-vercel-cli/) | 「把履歷 HTML deploy 到 Vercel」 |
| [`exec-analytics-mcp`](exec-analytics-mcp/) | 「查 GA4 過去 30 天流量」「設定 analytics MCP」 |

---

## 常見組合

| 目標 | Skill 鏈 |
|------|---------|
| 從零到投遞 | `gen-resume` → `gen-resume-optimizer` → `interviewer-ai` |
| 轉職規劃 | `gen-career-mentor` → `gen-resume-optimizer` |
| 活動 + 品牌頁 | `hypelink-event-mcp` + `hypelink-brand-page-mcp` |
| 履歷上線 | `gen-resume` → `exec-vercel-cli` |
| 個人品牌站 | `gen-resume`（寫入 `ssot/個人/`）→ `frontend-design`（依 `about-me` 規劃／實作）→ 可選 `exec-vercel-cli` |
| 表單與申請案 | `gen-resume`（建 SSOT）→ `gen-form-filler`（填 docx／xlsx＋蓋章） |

---

## 動手練習

| 練習 | 內容 |
|------|------|
| [`practice/01-fill-forms`](../practice/01-fill-forms/) | 讀 Obsidian → 填 Word 補助計畫申請書與 Excel 個人資料表 → 蓋大小章 |

---

## 安裝方式（Cursor）

1. **Fork** [contactwport/wport-ai-starter-kit](https://github.com/contactwport/wport-ai-starter-kit) 到你的帳號。
2. 在本機 clone **你自己的 fork**（或 `gh repo fork contactwport/wport-ai-starter-kit --clone`）。

```bash
# 單一 skill（路徑改成你的 fork 本機位置）
ln -s /path/to/wport-ai-starter-kit/skills/gen-resume .cursor/skills/gen-resume

# 或整包
ln -s /path/to/wport-ai-starter-kit/skills .cursor/skills/wport-ai-starter-kit
```

---

## 找不到合適的 skill？

```text
要對外部系統下指令？     → exec-* 或 *-mcp
要產出文件／履歷？        → gen-*
要規劃／實作網站視覺？    → frontend-design（內容先看 ssot/個人/）
純查詢？                → 直接用 MCP / CLI，不必寫 skill
```
