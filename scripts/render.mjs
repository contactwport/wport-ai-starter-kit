#!/usr/bin/env node
// 把模板輸出成 PNG（1080×1350）。用電腦裡現成的 Chrome 或 Edge，不用另外安裝套件。
//   node scripts/render.mjs              → 全部 10 張
//   node scripts/render.mjs 01 05        → 只輸出 01 和 05
//   node scripts/render.mjs 01 --theme=03-cute   → 用可愛風輸出（不改 theme.css）
//   node scripts/render.mjs 01 03 --theme=all    → 10 種風格各輸出一次，存到 out/themes/
// 圖片存在 out/，檔名跟模板一樣。
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "..");
// 學員資料夾：模板在 templates/；老師的工具包：模板在 templates/posts/
const tplDir = existsSync(join(root, "templates", "01-new-product.html")) ? join(root, "templates") : join(root, "templates", "posts");
const outDir = join(root, "out");
mkdirSync(outDir, { recursive: true });

const candidates = {
  darwin: [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
  ],
  win32: [
    join(process.env["PROGRAMFILES"] || "C:\\Program Files", "Google\\Chrome\\Application\\chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Google\\Chrome\\Application\\chrome.exe"),
    join(process.env["LOCALAPPDATA"] || "", "Google\\Chrome\\Application\\chrome.exe"),
    join(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "Microsoft\\Edge\\Application\\msedge.exe"),
    join(process.env["PROGRAMFILES"] || "C:\\Program Files", "Microsoft\\Edge\\Application\\msedge.exe"),
  ],
  linux: ["/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser", "/usr/bin/microsoft-edge"],
};
const browser = (candidates[process.platform] || []).find((p) => p && existsSync(p));
if (!browser) {
  console.error("找不到 Chrome 或 Edge。請先安裝 Google Chrome：https://www.google.com/chrome/");
  process.exit(1);
}

const args = process.argv.slice(2);
const themeArg = (args.find((a) => a.startsWith("--theme=")) || "").slice(8);
const want = args.filter((a) => !a.startsWith("--"));
const themeDir = join(tplDir, "themes");
const themeFile = join(tplDir, "theme.css");
const allThemes = readdirSync(themeDir).filter((f) => f.endsWith(".css")).map((f) => f.replace(/\.css$/, "")).sort();
let themes = [null];
if (themeArg === "all") themes = allThemes;
else if (themeArg) {
  const hit = allThemes.find((t) => t === themeArg || t.startsWith(themeArg.padStart(2, "0")));
  if (!hit) {
    console.error("沒有這個風格。可用的：" + allThemes.join("、"));
    process.exit(1);
  }
  themes = [hit];
}
const files = readdirSync(tplDir)
  .filter((f) => /^\d\d-.*\.html$/.test(f))
  .filter((f) => !want.length || want.some((w) => f.startsWith(w.padStart(2, "0"))));
if (!files.length) {
  console.error("沒有符合的模板。可用的編號：01 到 10");
  process.exit(1);
}

const profile = join(tmpdir(), "brand-template-render");
const original = readFileSync(themeFile, "utf8");
const useTheme = (t) => writeFileSync(themeFile, original.replace(/@import url\("themes\/[^"]+\.css"\);/, `@import url("themes/${t}.css");`));
try {
  for (const t of themes) {
    if (t) useTheme(t);
    const dir = themeArg === "all" ? join(outDir, "themes", t) : outDir;
    mkdirSync(dir, { recursive: true });
    for (const f of files) {
      const out = join(dir, f.replace(/\.html$/, themeArg && themeArg !== "all" ? `.${t}.png` : ".png"));
      execFileSync(browser, [
        "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
        `--user-data-dir=${profile}`, "--window-size=1080,1350", "--virtual-time-budget=8000",
        `--screenshot=${out}`, pathToFileURL(join(tplDir, f)).href,
      ], { stdio: "ignore" });
      console.log("✓", out);
    }
  }
} finally {
  writeFileSync(themeFile, original);
}
