#!/usr/bin/env node
// 用同一份內容做出 10 種風格，方便比較。
//   npm run themes            全部風格：建置＋截圖，最後開一個本機網址可以點進去看
//   npm run themes -- 03 07   只做 03、07
//   npm run themes -- --no-shots   不截圖（電腦沒有 Chrome／Edge 時）
//   npm run themes -- --no-images  假裝沒有任何照片，檢查沒照片時的樣子
//   DEMO_BASE=/repo/ npm run themes -- --no-shots --exit   放上 GitHub Pages 用（網址在子路徑）
//   AI（OpenCode）跑的時候預覽會丟到背景，指令不會卡住
// 截圖存在 theme-previews/<風格>.png（桌機）和 <風格>-mobile.png（手機）
// 資料夾裡有 code_artifact.html（第 1 堂用聊天 AI 做的一頁式網站），也會放進總覽，當第 11 個版本一起比
import { spawnSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const noShots = args.includes('--no-shots');
const serveOnly = args.includes('--serve');
const noImages = args.includes('--no-images');
// 放在子路徑時（GitHub Pages：/wport-ai-starter-kit/）每個風格是 <DEMO_BASE><風格>/
const demoBase = (process.env.DEMO_BASE || '/').replace(/\/?$/, '/').replace(/^\/?/, '/');
const picks = args.filter((a) => !a.startsWith('--'));
const all = fs.readdirSync(path.join(root, 'src/themes')).filter((f) => /^\d\d-/.test(f)).sort();
const themes = picks.length ? all.filter((t) => picks.some((p) => t.startsWith(p.padStart(2, '0')) || t === p)) : all;
if (!themes.length) { console.error(`找不到風格：${picks.join(' ')}。可以用的有：${all.join('、')}`); process.exit(1); }

const out = path.join(root, 'dist-themes');
const shots = path.join(root, 'theme-previews');
fs.mkdirSync(out, { recursive: true });
fs.mkdirSync(shots, { recursive: true });
const astroBin = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');

// 第 1 堂的一頁式網站：放在 dist-themes/00-one-page/
const ONE = '00-one-page';
// 上一層的是學生第 1 堂自己做的（網站放在 site/ 子資料夾時），優先用；沒有才用這裡的（範例或學生蓋掉的）
const onePage = ['../code_artifact.html', 'code_artifact.html'].map((f) => path.join(root, f)).find((f) => fs.existsSync(f));
if (!serveOnly && onePage) {
  fs.rmSync(path.join(out, ONE), { recursive: true, force: true });
  fs.mkdirSync(path.join(out, ONE), { recursive: true });
  fs.copyFileSync(onePage, path.join(out, ONE, 'index.html'));
  // 一頁式用 images/ 的照片：帶上 public/images（學生自己的照片也放這裡）
  const imgs = path.join(root, 'public', 'images');
  if (fs.existsSync(imgs)) fs.cpSync(imgs, path.join(out, ONE, 'images'), { recursive: true });
  console.log(`一頁式 ${path.relative(root, onePage)} … 完成`);
}

if (!serveOnly) {
  for (const t of themes) {
    process.stdout.write(`建置 ${t} … `);
    const r = spawnSync(process.execPath, [astroBin, 'build', '--silent'], {
      cwd: root,
      env: { ...process.env, ...(noImages ? { NO_IMAGES: '1' } : {}), THEME: t, BASE_PATH: `${demoBase}${t}/`, OUT_DIR: path.join(out, t) },
      encoding: 'utf8',
    });
    if (r.status !== 0) { console.log('失敗'); console.error(r.stdout, r.stderr); process.exit(1); }
    console.log('完成');
  }
}

// 本機伺服器：dist-themes/ 底下每個風格一個子路徑
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  if (p === '/_root') { res.writeHead(200); return res.end(root); }
  if (p === '/_frame') {
    // 手機截圖：headless Chrome 視窗最小約 500px，用 390px 寬的 iframe 模擬手機
    const src = new URL(req.url, 'http://x').searchParams.get('u');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(`<!doctype html><style>html,body{margin:0;background:#fff}iframe{border:0;width:390px;height:1600px;display:block}</style><iframe src="${src}"></iframe>`);
  }
  let f = path.join(out, p);
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
// 從 4400 開始找空的 port。被佔用時：是同一個資料夾的預覽就沿用，別的資料夾的就換下一個 port
let port = 4400, listening = false;
for (; port < 4420; port++) {
  listening = await new Promise((ok) => { server.once('error', () => ok(false)); server.listen(port, () => ok(true)); });
  if (listening) break;
  const other = await fetch(`http://localhost:${port}/_root`).then((r) => r.text()).catch(() => '');
  if (other === root) break;
}
const origin = `http://localhost:${port}`;

// 找 Chrome／Edge
function findBrowser() {
  const c = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  return c.find((p) => fs.existsSync(p));
}
function shot(browser, url, file, w, h) {
  return new Promise((ok) => {
    const p = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
      `--window-size=${w},${h}`, '--virtual-time-budget=4000', `--screenshot=${file}`, url], { stdio: 'ignore' });
    p.on('exit', ok);
  });
}

if (!noShots && !serveOnly) {
  const browser = findBrowser();
  if (!browser) console.log('沒找到 Chrome 或 Edge，跳過截圖。');
  else {
    for (const t of [...(onePage ? [ONE] : []), ...themes]) {
      process.stdout.write(`截圖 ${t} … `);
      await shot(browser, `${origin}/${t}/?shot`, path.join(shots, `${t}.png`), 1440, 2200);
      await shot(browser, `${origin}/_frame?u=${encodeURIComponent(`/${t}/?shot`)}`, path.join(shots, `${t}-mobile.png`), 390, 1600);
      console.log('完成');
    }
  }
}

// 總覽頁
const meta = await Promise.all(all.map(async (t) => ({ t, ...(await import(path.join(root, 'src/themes', t, 'theme.mjs'))).default })));
// 縮圖：這次有截圖就用新的，沒有就用 README 的 previews/*.jpg；複製到 dist-themes/_previews/，連結都用相對路徑
fs.mkdirSync(path.join(out, '_previews'), { recursive: true });
const thumb = (t) => {
  for (const f of [path.join(shots, t + '.png'), path.join(root, 'previews', t + '.jpg')]) {
    if (!fs.existsSync(f)) continue;
    const name = t + path.extname(f);
    fs.copyFileSync(f, path.join(out, '_previews', name));
    return `_previews/${name}`;
  }
};
const one = fs.existsSync(path.join(out, ONE)) ? [{ t: ONE, label: '第 1 堂的一頁式', description: '你用聊天 AI 做的 code_artifact.html，一頁到底。跟下面 10 種比一比：多頁、動畫、手機版差在哪。' }] : [];
const cards = [...one, ...meta].filter((m) => fs.existsSync(path.join(out, m.t))).map((m) => ({ ...m, img: thumb(m.t) })).map((m) => `
  <a class="c" href="${m.t}/"><div class="img">${m.img ? `<img src="${m.img}" loading="lazy" alt="${m.label}">` : ''}</div>
  <p><b>${m.t}</b>　${m.label}</p><small>${m.description}</small></a>`).join('');
fs.writeFileSync(path.join(out, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${one.length ? '11 個版本' : '10 種風格'}</title>
<style>body{margin:0;font:16px/1.6 system-ui,'Noto Sans TC',sans-serif;background:#f4f4f5;color:#111}h1{font-size:28px;margin:0 0 4px}header{padding:40px 24px 8px;max-width:1280px;margin:auto}header p{color:#666;margin:0}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px;padding:24px;max-width:1280px;margin:auto}.c{background:#fff;border-radius:14px;overflow:hidden;color:inherit;text-decoration:none;box-shadow:0 1px 3px #0001;transition:transform .3s}.c:hover{transform:translateY(-4px)}
.img{aspect-ratio:4/3;overflow:hidden;background:#e4e4e7}.img img{width:100%;display:block}.c p{margin:12px 16px 0}.c small{display:block;color:#666;margin:0 16px 16px}code{background:#e4e4e7;padding:2px 6px;border-radius:5px}</style>
<header><h1>${one.length ? '你的網站：第 1 堂的一頁式＋10 種風格' : '同一份內容，10 種風格'}</h1><p>點進去看完整網站，每一頁都能操作。選好風格後，把 <code>site.config.mjs</code> 的 <code>theme</code> 改成那個編號（01–10）。</p></header><main>${cards}</main>`);

if (args.includes('--exit')) { console.log(`\n建好了：dist-themes/、theme-previews/`); if (listening) server.close(); process.exit(0); }
if (!listening) { console.log(`\n打開 ${origin} 比較 10 種風格（預覽已經在跑）`); process.exit(0); }
// 給 AI 跑的時候（不是終端機）：預覽丟到背景，指令馬上結束，不會卡住
if (!process.stdout.isTTY && !serveOnly) {
  server.close();
  spawn(process.execPath, [fileURLToPath(import.meta.url), '--serve'], { cwd: root, detached: true, stdio: 'ignore', windowsHide: true }).unref();
  console.log(`\n打開 ${origin} 比較 10 種風格（預覽在背景執行）`);
  process.exit(0);
}
console.log(`\n打開 ${origin} 比較 10 種風格（按 Ctrl+C 結束）`);
