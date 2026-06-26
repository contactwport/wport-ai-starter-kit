#!/usr/bin/env node
/**
 * Render wport career report JSON to standalone HTML (shared UX with resume template).
 *
 * Usage:
 *   node templates/report/render.mjs <input.json> [output.html]
 *
 * Report types (JSON `type` field):
 *   - customization   → gen-resume-optimizer report
 *   - interview-prep  → interviewer-ai
 *   - career-plan     → gen-career-mentor
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wportFaviconLink } from '../shared/wport-brand.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESUME_DIR = path.join(__dirname, '..', 'resume');

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function collapseCard(title, body) {
  return `
<article class="wport-card wport-card--collapse">
  <div class="wport-card-header">
    <h3 class="wport-card-title">${escapeHtml(title)}</h3>
  </div>
  <div>${body}</div>
</article>`;
}

function reportShell({ title, subtitle, bodyHtml, css }) {
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${wportFaviconLink()}
  <style>${css}</style>
</head>
<body>
  <main class="wport-preview-page">
    <div class="wport-preview-stack">
      <article class="wport-card wport-card--collapse">
        <header class="wport-report-header">
          <h1 class="wport-report-title">${escapeHtml(title)}</h1>
          ${subtitle ? `<p class="wport-report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        </header>
        <div class="wport-report-body">${bodyHtml}</div>
      </article>
    </div>
  </main>
</body>
</html>
`;
}

function loadCss() {
  const resumeCss = fs.readFileSync(path.join(RESUME_DIR, 'resume.css'), 'utf8');
  const reportCss = fs.readFileSync(path.join(__dirname, 'report.css'), 'utf8');
  return `${resumeCss}\n${reportCss}`;
}

function statusClass(status) {
  const map = {
    ready: 'wport-status-ready',
    partial: 'wport-status-partial',
    missing: 'wport-status-missing',
    '已有': 'wport-status-ready',
    '部分': 'wport-status-partial',
    '缺少': 'wport-status-missing',
  };
  return map[status] ?? '';
}

function statusLabel(status) {
  const map = {
    ready: '已有',
    partial: '部分',
    missing: '缺少',
  };
  return map[status] ?? escapeHtml(status);
}

function renderList(items, { empty = '—' } = {}) {
  if (!items?.length) return `<p>${escapeHtml(empty)}</p>`;
  return `<ul class="wport-report-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderCallout(label, text) {
  if (!text?.trim()) return '';
  return `
<div class="wport-callout">
  <span class="wport-callout-label">${escapeHtml(label)}</span>
  ${escapeHtml(text)}
</div>`;
}

function clampScore(score) {
  const n = Number(score);
  if (Number.isNaN(n)) return null;
  return Math.max(1, Math.min(100, Math.round(n)));
}

function scoreColor(score, mode) {
  if (mode === 'feasibility') {
    if (score >= 81) return '#047857';
    if (score >= 61) return '#059669';
    if (score >= 41) return '#d97706';
    return '#dc2626';
  }
  if (score <= 25) return '#059669';
  if (score <= 50) return '#65a30d';
  if (score <= 75) return '#d97706';
  return '#dc2626';
}

function gapLevelLabel(score) {
  if (score <= 25) return '小幅調整';
  if (score <= 50) return '一到兩階跳躍';
  if (score <= 75) return '重大轉型';
  return '高度落差';
}

function feasibilityLevelLabel(score) {
  if (score >= 81) return '高度可行';
  if (score >= 61) return '可行';
  if (score >= 41) return '具挑戰';
  return '困難';
}

function renderScoreBlock(score, { mode, note } = {}) {
  const s = clampScore(score);
  if (s == null) return '<span>—</span>';
  const color = scoreColor(s, mode);
  const sublabel = mode === 'gap' ? gapLevelLabel(s) : feasibilityLevelLabel(s);
  const noteHtml = note?.trim() ? `<p class="wport-score-note">${escapeHtml(note)}</p>` : '';
  return `
<div class="wport-score wport-score--${mode}">
  <div class="wport-score-header">
    <span class="wport-score-value" style="color:${color}">${s}</span>
    <span class="wport-score-scale">/ 100</span>
    <span class="wport-score-sublabel" style="color:${color}">${escapeHtml(sublabel)}</span>
  </div>
  <div class="wport-score-track" aria-hidden="true">
    <div class="wport-score-fill" style="width:${s}%; background:${color}"></div>
  </div>
  ${noteHtml}
</div>`;
}

function renderCustomization(data) {
  const target = data.target_job ?? {};
  const subtitle = [target.company, target.title].filter(Boolean).join(' — ');

  const changesTable =
    data.changes?.length > 0
      ? `
<table class="wport-report-table">
  <thead>
    <tr><th>區塊</th><th>調整內容</th><th>對應職缺需求</th></tr>
  </thead>
  <tbody>
    ${data.changes
      .map(
        (row) => `
    <tr>
      <td>${escapeHtml(row.section)}</td>
      <td>${escapeHtml(row.change)}</td>
      <td>${escapeHtml(row.jd_requirement)}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>`
      : '<p>—</p>';

  const keywords = data.keywords ?? {};
  const recommendations = (data.recommendations ?? [])
    .map(
      (item) => `
<div class="wport-gap-item">
  <p class="wport-gap-name">${escapeHtml(item.gap)}</p>
  <p class="wport-gap-why">${escapeHtml(item.how_to_build)}</p>
</div>`
    )
    .join('');

  const body = `
<section class="wport-report-section">
  <h2 class="wport-report-section-title">目標職缺</h2>
  <div class="wport-report-kv">
    ${target.company ? `<div class="wport-report-kv-row"><span class="wport-report-kv-label">公司</span><span class="wport-report-kv-value">${escapeHtml(target.company)}</span></div>` : ''}
    ${target.title ? `<div class="wport-report-kv-row"><span class="wport-report-kv-label">職稱</span><span class="wport-report-kv-value">${escapeHtml(target.title)}</span></div>` : ''}
  </div>
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">變更摘要</h2>
  ${changesTable}
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">關鍵字對齊</h2>
  <div class="wport-report-kv">
    <div class="wport-report-kv-row">
      <span class="wport-report-kv-label">職缺強調</span>
      <span class="wport-report-kv-value">${renderList(keywords.jd_emphasis)}</span>
    </div>
    <div class="wport-report-kv-row">
      <span class="wport-report-kv-label">履歷已命中</span>
      <span class="wport-report-kv-value">${renderList(keywords.resume_matched)}</span>
    </div>
    <div class="wport-report-kv-row">
      <span class="wport-report-kv-label">仍缺（需實際累積）</span>
      <span class="wport-report-kv-value">${renderList(keywords.genuine_gaps)}</span>
    </div>
  </div>
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">建議補強（誠實缺口）</h2>
  ${recommendations || '<p>—</p>'}
</section>
${renderCallout('下一步', data.footer_tip ?? '可接續使用 interviewer-ai 模擬面試，或 gen-career-mentor 規劃長期能力累積。')}`;

  return {
    title: data.title ?? 'wport 履歷客製化報告',
    subtitle,
    bodyHtml: body,
  };
}

function renderQuestionItem(question, index) {
  return `
<div class="wport-question-item">
  <p class="wport-question-title">${index}. ${escapeHtml(question.question)}</p>
  <p class="wport-question-meta"><strong>面試官背後意圖：</strong>${escapeHtml(question.intent)}</p>
  <p class="wport-question-meta"><strong>黃金回答策略建議：</strong>${escapeHtml(question.strategy)}</p>
</div>`;
}

function renderInterviewPrep(data) {
  const target = data.target_job ?? {};
  const subtitle = [target.company, target.title].filter(Boolean).join(' — ');

  const categories = (data.categories ?? [])
    .map((cat) => {
      const questions = (cat.questions ?? [])
        .map((q, i) => renderQuestionItem(q, i + 1))
        .join('');
      return collapseCard(cat.title ?? '', `<div class="wport-display-section">${questions || '<p>—</p>'}</div>`);
    })
    .join('\n');

  const tip = data.interviewer_tip
    ? renderCallout('面試官的小叮嚀', data.interviewer_tip)
    : '';

  return {
    title: data.title ?? 'wport 面試官模擬 - 10 道必考魔鬼題',
    subtitle,
    bodyHtml: `${categories}${tip}`,
    useCategoriesLayout: true,
  };
}

function renderCareerPlan(data) {
  const target = data.target ?? {};
  const subtitle = target.job_title ?? '';

  const capabilityTable =
    data.capability_matrix?.length > 0
      ? `
<table class="wport-report-table">
  <thead>
    <tr><th>能力面向</th><th>目前狀態</th><th>目標要求</th><th>差距</th></tr>
  </thead>
  <tbody>
    ${data.capability_matrix
      .map((row) => {
        const cls = statusClass(row.current);
        const label = statusLabel(row.current);
        return `
    <tr>
      <td>${escapeHtml(row.dimension)}</td>
      <td class="${cls}">${label}</td>
      <td>${escapeHtml(row.requirement)}</td>
      <td>${escapeHtml(row.gap)}</td>
    </tr>`;
      })
      .join('')}
  </tbody>
</table>`
      : '<p>—</p>';

  const coreGaps = (data.core_gaps ?? [])
    .map(
      (item, i) => `
<div class="wport-gap-item">
  <p class="wport-gap-name">${i + 1}. ${escapeHtml(item.name)}</p>
  <p class="wport-gap-why">${escapeHtml(item.why)}</p>
</div>`
    )
    .join('');

  const plan1y =
    data.plan_1y?.length > 0
      ? `
<table class="wport-report-table">
  <thead>
    <tr><th>季度</th><th>目標</th><th>具體行動</th><th>驗收指標</th></tr>
  </thead>
  <tbody>
    ${data.plan_1y
      .map(
        (row) => `
    <tr>
      <td>${escapeHtml(row.quarter)}</td>
      <td>${escapeHtml(row.goal)}</td>
      <td>${escapeHtml(row.actions)}</td>
      <td>${escapeHtml(row.metrics)}</td>
    </tr>`
      )
      .join('')}
  </tbody>
</table>`
      : '<p>—</p>';

  const plan3y = data.plan_3y ?? {};
  const plan5y = data.plan_5y ?? {};

  const body = `
<section class="wport-report-section">
  <h2 class="wport-report-section-title">目標定位</h2>
  <div class="wport-report-kv">
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">目標職缺</span><span class="wport-report-kv-value">${escapeHtml(target.job_title ?? '—')}</span></div>
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">目前定位</span><span class="wport-report-kv-value">${escapeHtml(target.current_position ?? '—')}</span></div>
    <div class="wport-report-kv-row wport-report-kv-row--score"><span class="wport-report-kv-label">差距等級</span><span class="wport-report-kv-value">${renderScoreBlock(target.gap_score, { mode: 'gap', note: target.gap_note })}</span></div>
    <div class="wport-report-kv-row wport-report-kv-row--score"><span class="wport-report-kv-label">誠實評估</span><span class="wport-report-kv-value">${renderScoreBlock(target.feasibility_score, { mode: 'feasibility', note: target.feasibility_note })}</span></div>
  </div>
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">現有能力盤點</h2>
  ${capabilityTable}
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">核心缺口（按優先順序）</h2>
  ${coreGaps || '<p>—</p>'}
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">1 年計畫（立即可動手）</h2>
  ${plan1y}
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">3 年計畫（職涯位移）</h2>
  <div class="wport-report-kv">
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">目標職位</span><span class="wport-report-kv-value">${escapeHtml(plan3y.target_role ?? '—')}</span></div>
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">關鍵里程碑</span><span class="wport-report-kv-value">${plan3y.milestones?.length ? `<ul class="wport-milestone-list">${plan3y.milestones.map((m) => `<li>${escapeHtml(m)}</li>`).join('')}</ul>` : '—'}</span></div>
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">建議職涯移動</span><span class="wport-report-kv-value">${escapeHtml(plan3y.career_move ?? '—')}</span></div>
  </div>
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">5 年計畫（長期願景）</h2>
  <div class="wport-report-kv">
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">目標定位</span><span class="wport-report-kv-value">${escapeHtml(plan5y.target_role ?? '—')}</span></div>
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">累積路徑</span><span class="wport-report-kv-value">${escapeHtml(plan5y.path ?? '—')}</span></div>
    <div class="wport-report-kv-row"><span class="wport-report-kv-label">需要把握的機會</span><span class="wport-report-kv-value">${escapeHtml(plan5y.opportunities ?? '—')}</span></div>
  </div>
</section>
<section class="wport-report-section">
  <h2 class="wport-report-section-title">現在就能做的 3 件事</h2>
  ${renderList(data.immediate_actions)}
</section>
${renderCallout('導師叮嚀', data.mentor_tip ?? '')}`;

  return {
    title: data.title ?? 'wport 職涯導師 — 能力差距與成長路線圖',
    subtitle,
    bodyHtml: body,
  };
}

export function renderReportHtml(data, { css } = {}) {
  const stylesheet = css ?? loadCss();
  const type = data.type;

  let rendered;
  if (type === 'customization') {
    rendered = renderCustomization(data);
  } else if (type === 'interview-prep') {
    rendered = renderInterviewPrep(data);
  } else if (type === 'career-plan') {
    rendered = renderCareerPlan(data);
  } else {
    throw new Error(`Unknown report type: ${type}. Expected customization | interview-prep | career-plan`);
  }

  if (rendered.useCategoriesLayout) {
    const { title, subtitle, bodyHtml } = rendered;
    return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  ${wportFaviconLink()}
  <style>${stylesheet}</style>
</head>
<body>
  <main class="wport-preview-page">
    <div class="wport-preview-stack">
      <article class="wport-card wport-card--collapse">
        <header class="wport-report-header">
          <h1 class="wport-report-title">${escapeHtml(title)}</h1>
          ${subtitle ? `<p class="wport-report-subtitle">${escapeHtml(subtitle)}</p>` : ''}
        </header>
      </article>
      ${bodyHtml}
    </div>
  </main>
</body>
</html>
`;
  }

  return reportShell({ ...rendered, css: stylesheet });
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];

  if (!input) {
    console.error('Usage: node templates/report/render.mjs <input.json> [output.html]');
    process.exit(2);
  }

  const inputPath = path.resolve(process.cwd(), input);
  const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const html = renderReportHtml(data);

  if (output) {
    const outputPath = path.resolve(process.cwd(), output);
    fs.writeFileSync(outputPath, html, 'utf8');
    console.log(`Wrote ${outputPath}`);
  } else {
    process.stdout.write(html);
  }
}

function isEntryScript() {
  if (!process.argv[1]) return false;
  try {
    return (
      fs.realpathSync(path.resolve(process.argv[1])) ===
      fs.realpathSync(fileURLToPath(import.meta.url))
    );
  } catch {
    return false;
  }
}

if (isEntryScript()) {
  main();
}
