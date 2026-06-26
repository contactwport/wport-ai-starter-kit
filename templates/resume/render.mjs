#!/usr/bin/env node
/**
 * Render wport resume.json to standalone HTML matching W101-Web preview-resume.
 *
 * Usage:
 *   node templates/resume/render.mjs <input.json> [output.html]
 *
 * Template source: W101-Web/apps/user/src/views/my-resume/preview-resume/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { wportFaviconLink } from '../shared/wport-brand.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATE_DIR = __dirname;
const ICON_DIR = path.join(TEMPLATE_DIR, 'icons');

const LABELS = {
  sections: {
    memberInfo: '會員資料',
    personalBackground: '個人背景',
    autobiography: '自傳',
    experience: '經歷',
    education: '學歷',
    jobPreferences: '求職條件',
    professionalSkills: '專業技能',
    languages: '語言能力',
    certificates: '專業證照',
    portfolioLinks: '個人連結',
  },
  jobStatus: '求職狀態',
  drivingLicense: '持有駕照',
  vehicle: '具備車輛',
  employmentType: '工作性質',
  shift: '上班時段',
  availableDate: '可上班日',
  preferredLocation: '希望地點',
  preferredSalary: '希望待遇',
  preferredJobCatalogue: '希望職類',
  jobSkills: '工作技能',
  otherSkills: '其他技能描述',
  tools: '擅長工具',
  otherTools: '其他擅長工具描述',
  totalYears: '總年資',
  level: '程度',
  unfilled: '未填寫',
  noExperience: '尚無工作經歷',
  currentlyNoExperience: '目前無工作經歷',
  portfolioNoTitle: '尚未設定連結名稱',
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function display(value, fallback = LABELS.unfilled) {
  const text = value?.toString().trim();
  return text ? escapeHtml(text) : fallback;
}

function iconDataUri(name) {
  const file = path.join(ICON_DIR, `${name}.svg`);
  if (!fs.existsSync(file)) return '';
  const svg = fs.readFileSync(file, 'utf8');
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function richContent(html) {
  if (!html?.trim()) return '';
  return `<section class="rich-content ql-snow"><div class="ql-editor">${html}</div></section>`;
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

function labelValueRow(label, value) {
  return `
<div class="wport-label-value-row">
  <p class="wport-label">${escapeHtml(label)}</p>
  <p class="wport-value">${value}</p>
</div>`;
}

function timelineItem(content, { gray = false } = {}) {
  const markerClass = gray ? 'wport-timeline-marker wport-timeline-marker--gray' : 'wport-timeline-marker';
  return `
<div class="wport-timeline-item">
  <div class="wport-timeline-marker-col">
    <i class="${markerClass}"></i>
    <div class="wport-timeline-connector"></div>
  </div>
  <div class="wport-timeline-content">${content}</div>
</div>`;
}

function timelineEntry({ title, subtitle, duration, bodyHtml }) {
  return timelineItem(`
    <p class="wport-entry-title">${escapeHtml(title)}</p>
    ${subtitle ? `<p class="wport-entry-subtitle">${escapeHtml(subtitle)}</p>` : ''}
    ${duration ? `<p class="wport-entry-duration">${escapeHtml(duration)}</p>` : ''}
    ${bodyHtml || ''}
  `);
}

function sectionVisible(resume, key) {
  switch (key) {
    case 'personalBackground':
      return !!resume.background?.job_status_display;
    case 'autobiography':
      return !!resume.autobiography?.trim();
    case 'workExperience': {
      const wx = resume.work_experience;
      return !!wx?.has_no_work_experience || (wx?.work_experiences?.length ?? 0) > 0;
    }
    case 'education':
      return (resume.education?.length ?? 0) > 0;
    case 'jobPreference': {
      const jc = resume.job_condition;
      return !!(jc?.available_start_display && jc?.salary_expectation_display);
    }
    case 'professionalSkills': {
      const ps = resume.professional_skills;
      if (!ps) return false;
      return !!(
        ps.job_skill_display ||
        ps.tech_tool_display ||
        ps.other_job_skill_description ||
        ps.other_tool_description
      );
    }
    case 'languages':
      return (resume.language_skills?.length ?? 0) > 0;
    case 'certificates':
      return (resume.certificates?.length ?? 0) > 0;
    case 'portfolioLinks':
      return (resume.portfolio_links?.length ?? 0) > 0;
    default:
      return false;
  }
}

function renderMemberInfo(resume) {
  const pi = resume.personal_info ?? {};
  const homePhone =
    pi.home_phone_area_code && pi.home_phone
      ? `${pi.home_phone_area_code}-${pi.home_phone}`
      : pi.home_phone;

  const rows = [
    { icon: 'birth', value: display(pi.age_display) },
    { icon: 'email', value: display(pi.email) },
    { icon: 'mobile', value: display(pi.mobile) },
    { icon: 'phone', value: display(homePhone) },
    { icon: 'location', value: display(pi.residence_display) },
    {
      icon: 'id',
      value: pi.identity_type_display
        ? `${display(pi.country_display, LABELS.unfilled)} ｜ ${display(pi.identity_type_display)}`
        : display(pi.country_display),
    },
  ];

  if (pi.special_identity_display) {
    rows.push({ icon: 'id', value: display(pi.special_identity_display) });
  }

  const infoRows = rows
    .map(
      (row) => `
<div class="wport-info-row">
  <div class="wport-info-icon"><img src="${iconDataUri(row.icon)}" alt="" /></div>
  <div class="wport-info-value">${row.value}</div>
</div>`
    )
    .join('');

  const avatar = pi.photo_url
    ? `<img class="wport-avatar" src="${escapeHtml(pi.photo_url)}" alt="avatar" />`
    : `<div class="wport-avatar" aria-hidden="true"></div>`;

  return `
<article class="wport-card">
  <div class="wport-card-header">
    <h3 class="wport-card-title wport-card-title--simple">${LABELS.sections.memberInfo}</h3>
  </div>
  <div class="wport-display-section">
    <div class="wport-member-layout">
      <div class="wport-avatar-wrap">${avatar}</div>
      <div class="wport-member-info">
        <div class="wport-member-name">${display(pi.name, '未命名')}</div>
        <div class="wport-member-grid">${infoRows}</div>
      </div>
    </div>
  </div>
</article>`;
}

function renderPersonalBackground(resume) {
  const bg = resume.background ?? {};
  const body = `
<div class="wport-label-value-rows">
  ${labelValueRow(LABELS.jobStatus, display(bg.job_status_display))}
  ${labelValueRow(LABELS.drivingLicense, display(bg.driving_license_types_display))}
  ${labelValueRow(LABELS.vehicle, display(bg.vehicle_types_display))}
</div>`;
  return collapseCard(LABELS.sections.personalBackground, body);
}

function renderAutobiography(resume) {
  return collapseCard(
    LABELS.sections.autobiography,
    `<div class="wport-display-section">${richContent(resume.autobiography)}</div>`
  );
}

function renderWorkExperience(resume) {
  const wx = resume.work_experience ?? {};
  let inner = '';

  if (!wx.has_no_work_experience) {
    inner += `
<div class="wport-total-years">
  <p class="wport-total-years-label">${LABELS.totalYears}</p>
  <p class="flex-1">${display(wx.total_years_range_display, '')}</p>
</div>`;
  }

  if ((wx.work_experiences?.length ?? 0) > 0 && !wx.has_no_work_experience) {
    inner += wx.work_experiences
      .map((item) =>
        timelineEntry({
          title: item.job_title,
          subtitle: [item.company_name, item.job_type_display].filter(Boolean).join('．'),
          duration: item.duration_display,
          bodyHtml: richContent(item.job_description),
        })
      )
      .join('');
  } else if (wx.has_no_work_experience) {
    inner += timelineItem(
      `<p class="wport-entry-title">${LABELS.currentlyNoExperience}</p>`,
      { gray: true }
    );
  } else {
    inner += `<div class="wport-empty"><p>${LABELS.noExperience}</p></div>`;
  }

  return collapseCard(
    LABELS.sections.experience,
    `<div class="wport-display-section">${inner}</div>`
  );
}

function renderEducation(resume) {
  const items = (resume.education ?? [])
    .map((item) =>
      timelineEntry({
        title: item.school_name,
        subtitle: item.department_display,
        duration: item.duration_display,
        bodyHtml: richContent(item.experience),
      })
    )
    .join('');

  return collapseCard(
    LABELS.sections.education,
    `<div class="wport-display-section">${items}</div>`
  );
}

function renderJobPreference(resume) {
  const jc = resume.job_condition ?? {};
  const body = `
<div class="wport-display-section">
  <div class="wport-job-pref-inner">
    ${labelValueRow(LABELS.employmentType, display(jc.feature_display))}
    ${labelValueRow(LABELS.shift, display(jc.working_hour_display))}
    ${labelValueRow(LABELS.availableDate, display(jc.available_start_display))}
    ${labelValueRow(LABELS.preferredLocation, display(jc.area_display))}
    ${labelValueRow(LABELS.preferredSalary, display(jc.salary_expectation_display))}
    ${labelValueRow(LABELS.preferredJobCatalogue, display(jc.job_classification_display))}
  </div>
</div>`;
  return collapseCard(LABELS.sections.jobPreferences, body);
}

function renderProfessionalSkills(resume) {
  const ps = resume.professional_skills ?? {};
  const blocks = [];

  if (ps.job_skill_display) {
    blocks.push(`
<div class="wport-skill-block">
  <p class="wport-skill-label">${LABELS.jobSkills}</p>
  <div>${escapeHtml(ps.job_skill_display)}</div>
</div>`);
  }
  if (ps.other_job_skill_description) {
    blocks.push(`
<div class="wport-skill-block">
  <p class="wport-skill-label">${LABELS.otherSkills}</p>
  <div>${escapeHtml(ps.other_job_skill_description)}</div>
</div>`);
  }
  if (ps.tech_tool_display) {
    blocks.push(`
<div class="wport-skill-block">
  <p class="wport-skill-label">${LABELS.tools}</p>
  <div>${escapeHtml(ps.tech_tool_display)}</div>
</div>`);
  }
  if (ps.other_tool_description) {
    blocks.push(`
<div class="wport-skill-block">
  <p class="wport-skill-label">${LABELS.otherTools}</p>
  <div>${escapeHtml(ps.other_tool_description)}</div>
</div>`);
  }

  return collapseCard(
    LABELS.sections.professionalSkills,
    `<div class="wport-display-section">${blocks.join('')}</div>`
  );
}

function renderLanguages(resume) {
  const items = (resume.language_skills ?? [])
    .map(
      (lang) => `
<li>
  <p class="wport-language-name">${escapeHtml(lang.name)}</p>
  <span class="wport-language-level">${LABELS.level}:${escapeHtml(lang.level_display)}</span>
</li>`
    )
    .join('');

  return collapseCard(
    LABELS.sections.languages,
    `<div class="wport-display-section"><ul class="wport-language-list">${items}</ul></div>`
  );
}

function renderCertificates(resume) {
  const items = (resume.certificates ?? [])
    .map(
      (cert) => `
<div>
  <p class="wport-cert-name">${escapeHtml(cert.name)}</p>
  <p class="wport-cert-duration">${escapeHtml(cert.duration_display ?? '')}</p>
</div>`
    )
    .join('');

  return collapseCard(
    LABELS.sections.certificates,
    `<div class="wport-display-section"><div class="wport-cert-list">${items}</div></div>`
  );
}

function normalizeWebsiteUrl(url) {
  const raw = url?.trim();
  if (!raw) return '';
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function renderPortfolioLinks(resume) {
  const items = (resume.portfolio_links ?? [])
    .map((link) => {
      const href = normalizeWebsiteUrl(link.link_url);
      const title = link.link_title || LABELS.portfolioNoTitle;
      const urlText = link.link_url || LABELS.portfolioNoTitle;
      return `
<li>
  <p>${escapeHtml(title)}</p>
  <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(urlText)}</a>
</li>`;
    })
    .join('');

  return collapseCard(
    LABELS.sections.portfolioLinks,
    `<div class="wport-display-section"><ul class="wport-link-list">${items}</ul></div>`
  );
}

export function renderResumeHtml(resume, { cssPath } = {}) {
  const css = fs.readFileSync(cssPath ?? path.join(TEMPLATE_DIR, 'resume.css'), 'utf8');
  const sections = [renderMemberInfo(resume)];

  if (sectionVisible(resume, 'personalBackground')) sections.push(renderPersonalBackground(resume));
  if (sectionVisible(resume, 'autobiography')) sections.push(renderAutobiography(resume));
  if (sectionVisible(resume, 'workExperience')) sections.push(renderWorkExperience(resume));
  if (sectionVisible(resume, 'education')) sections.push(renderEducation(resume));
  if (sectionVisible(resume, 'jobPreference')) sections.push(renderJobPreference(resume));
  if (sectionVisible(resume, 'professionalSkills')) sections.push(renderProfessionalSkills(resume));
  if (sectionVisible(resume, 'languages')) sections.push(renderLanguages(resume));
  if (sectionVisible(resume, 'certificates')) sections.push(renderCertificates(resume));
  if (sectionVisible(resume, 'portfolioLinks')) sections.push(renderPortfolioLinks(resume));

  const title = escapeHtml(resume.resume_name || resume.personal_info?.name || '履歷');

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${wportFaviconLink()}
  <style>${css}</style>
</head>
<body>
  <main class="wport-preview-page">
    <div class="wport-preview-stack">
      ${sections.join('\n')}
    </div>
  </main>
</body>
</html>
`;
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];

  if (!input) {
    console.error('Usage: node templates/resume/render.mjs <input.json> [output.html]');
    process.exit(2);
  }

  const inputPath = path.resolve(process.cwd(), input);
  const resume = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const html = renderResumeHtml(resume);

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
