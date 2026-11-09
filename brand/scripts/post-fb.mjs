#!/usr/bin/env node
// 把一張圖發到你的 Facebook 粉專（Graph API）。
//   node scripts/post-fb.mjs out/01-new-product.png 貼文.txt          → 試跑：只檢查，不會發
//   node scripts/post-fb.mjs out/01-new-product.png 貼文.txt --live   → 真的發出去
// 需要 .env 裡的 FB_PAGE_ID 和 FB_PAGE_TOKEN（粉專權杖，不是個人權杖）。
// .env 已經寫在 .gitignore，不會被傳上 GitHub；公用電腦下課前請刪掉。
import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

const root = resolve(import.meta.dirname, "..");
const env = {};
const envFile = resolve(root, ".env");
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const [img, captionFile, flag] = process.argv.slice(2);
const live = flag === "--live" || process.argv.includes("--live");
if (!img || !captionFile) {
  console.error("用法：node scripts/post-fb.mjs <圖片.png> <文案.txt> [--live]");
  process.exit(2);
}
const pageId = env.FB_PAGE_ID, token = env.FB_PAGE_TOKEN;
if (!pageId || !token) {
  console.error("缺少 FB_PAGE_ID 或 FB_PAGE_TOKEN，請照 .env.example 建立 .env。");
  process.exit(2);
}
const caption = readFileSync(resolve(root, captionFile), "utf8").trim();
const bytes = readFileSync(resolve(root, img));
console.log(`粉專：${pageId}\n圖片：${img}（${Math.round(bytes.length / 1024)} KB）\n文案：\n${caption}\n`);

// 先確認權杖是這個粉專的，再決定要不要發
const me = await fetch(`https://graph.facebook.com/v21.0/me?fields=id,name&access_token=${encodeURIComponent(token)}`).then((r) => r.json());
if (me.error) { console.error("權杖不能用：", me.error.message); process.exit(1); }
if (me.id !== pageId) { console.error(`這把權杖屬於「${me.name}」（${me.id}），不是 FB_PAGE_ID ${pageId}。請改用粉專權杖。`); process.exit(1); }
console.log(`權杖確認：${me.name}`);
if (!live) { console.log("試跑完成，沒有發文。確定要發，請在指令最後加 --live。"); process.exit(0); }

const form = new FormData();
form.append("caption", caption);
form.append("source", new Blob([bytes], { type: "image/png" }), basename(img));
form.append("access_token", token);
const res = await fetch(`https://graph.facebook.com/v21.0/${pageId}/photos`, { method: "POST", body: form }).then((r) => r.json());
if (res.error) { console.error("發文失敗：", res.error.message); process.exit(1); }
console.log(`已發出：https://www.facebook.com/${res.post_id || res.id}`);
