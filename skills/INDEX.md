# Skill Index（人類快查表）

> 給開發者用的速覽手冊。**AI 不靠這份**：Cursor / Claude 會讀每個 `SKILL.md` 的 YAML `description:` 來決定何時 invoke。
> 此 INDEX 讓你 5 秒內找到「我要叫哪個 skill」。

**適用對象：** 任何想用手 AI 做履歷、求職、簡報或品牌頁的人 — 不限學生、不限年資。

---

## wport 職涯（核心）

| Skill | 類型 | 你可以這樣說 |
|-------|------|-------------|
| [`exec-wport-cli`](exec-wport-cli/) | Executor | 「用 wport CLI 搜尋台北後端職缺」 |
| [`gen-resume`](gen-resume/) | Generator | 「幫我從筆記做一份履歷」 |
| [`gen-resume-optimizer`](gen-resume-optimizer/) | Generator | 「針對這個 enc_id 客製履歷」 |
| [`gen-career-mentor`](gen-career-mentor/) | Generator | 「我想轉 Senior 後端，給我 1/3/5 年計畫」 |
| [`interviewer-ai`](interviewer-ai/) | Generator | 「模擬這份 JD 的 10 道魔鬼面試題」 |

---

## HypeLink 品牌與活動（MCP）

來源：[HypeLinkOfficial/hypelink_claude_skill](https://github.com/HypeLinkOfficial/hypelink_claude_skill)

| Skill | 你可以這樣說 |
|-------|-------------|
| [`hypelink-brand-page-mcp`](hypelink-brand-page-mcp/) | 「把 IG 和官網加到品牌頁」「換深色主題」 |
| [`hypelink-event-mcp`](hypelink-event-mcp/) | 「建一場講座並開放報名」「加早鳥票種」 |

**前置：** HypeLink API Token + [MCP 設定教學](https://hypelink.app/docs/ai/mcp)

---

## 簡報（open-slide）

來源：[1weiho/open-slide](https://github.com/1weiho/open-slide)

先在專案裡初始化 open-slide workspace：`npx @open-slide/cli init my-slide`

| Skill | 你可以這樣說 |
|-------|-------------|
| [`create-slide`](create-slide/) | 「幫我做一份 8 頁的產品發表簡報」 |
| [`slide-authoring`](slide-authoring/) | 技術參考：1920×1080 畫布、版型、配色（agent 內部用） |
| [`apply-comments`](apply-comments/) | 「套用簡報上的 inspector 註解」 |
| [`current-slide`](current-slide/) | 「改這一頁的標題」（當使用者指「這頁」） |
| [`create-theme`](create-theme/) | 「做一個深色科技風主題」 |

---

## 部署與數據（Executors）

| Skill | 你可以這樣說 |
|-------|-------------|
| [`exec-vercel-cli`](exec-vercel-cli/) | 「把履歷 HTML deploy 到 Vercel」「同一 repo 部署兩個站」 |
| [`exec-analytics-mcp`](exec-analytics-mcp/) | 「查 GA4 過去 30 天流量」「設定 analytics MCP」 |

---

## 常見組合

| 目標 | Skill 鏈 |
|------|---------|
| 從零到投遞 | `gen-resume` → `gen-resume-optimizer` → `interviewer-ai` |
| 轉職規劃 | `gen-career-mentor` → `gen-resume-optimizer` |
| 活動 + 品牌頁 | `hypelink-event-mcp` + `hypelink-brand-page-mcp` |
| 簡報 + 上線 | `create-slide` → `exec-vercel-cli` |
| 履歷站 + 簡報站（同 repo） | 兩個 Vercel project，見 [`exec-vercel-cli`](exec-vercel-cli/) |

---

## 安裝方式（Cursor）

```bash
git clone https://github.com/contactwport/wport-agents.git
cd your-project

# 單一 skill
ln -s /path/to/wport-agents/skills/gen-resume .cursor/skills/gen-resume

# 或整包
ln -s /path/to/wport-agents/skills .cursor/skills/wport-agents
```

---

## 找不到合適的 skill？

```text
要對外部系統下指令？     → exec-* 或 *-mcp
要產出文件／履歷／簡報？  → gen-* 或 create-slide
純查詢？                → 直接用 MCP / CLI，不必寫 skill
```
