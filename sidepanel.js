'use strict';

/* ============================== constants =============================== */

const DEFAULTS = {
  openrouterKey: '',
  model: 'openrouter/free',
  githubToken: '',
  repo: '',
  branch: 'main',
  folder: 'docs/summaries'
};

const MAX_PAGE_CHARS = 60000;

const VERBATIM_SYSTEM = [
  'You transcribe web-page content into Markdown with total fidelity.',
  'Reproduce ALL meaningful content of the provided page: headings, paragraphs, lists,',
  'tables, code snippets, definitions - cleaned of ads/navigation.',
  'If a "=== MCQs ON THIS PAGE ===" block is present, include it EXACTLY as given',
  'under a "### MCQs" subsection, preserving numbering and lettered options.',
  'Do NOT answer the MCQs. Do not summarize, shorten, interpret or add commentary.',
  'Output ONLY Markdown. Start directly with the heading "## Original Content".'
].join('\n');

const ANALYSIS_SYSTEM = [
  'You are an expert study-notes analyst.',
  'Given page content (and any MCQs on it), output Markdown with EXACTLY these four',
  'sections, in this order, each a "## " heading:',
  '## What the topic is explaining',
  '## What the MCQs are asking',
  '## What it means',
  '## Most important things to know',
  'Use concise bullets. Explain concepts in simple terms and connect the questions to',
  'the underlying ideas. No preamble before the first heading, nothing after the last.',
  'Start directly with "## What the topic is explaining".'
].join('\n');

const MCQ_SYSTEM = [
  'You are an expert tutor solving multiple-choice questions.',
  'For EACH question choose the single best option.',
  'Respond ONLY with a valid JSON array and nothing else:',
  '[{"question": "...", "answer": "B", "reasoning": "1-3 sentence justification"}]',
  'No markdown fences, no extra text before or after the JSON.'
].join('\n');

const MCQ_SYSTEM_AUTO = [
  'You are an expert tutor answering multiple-choice questions scraped from a web page.',
  'Each question starts with a [Q<number>] tag followed by lettered options A) B) C) ...',
  'Reason silently, then respond ONLY with a valid JSON array, one object per question,',
  'in the EXACT SAME ORDER as the input:',
  '[{"question": "[Q0] ...", "answer": "B", "reasoning": "1-2 sentence justification"}]',
  '"answer" MUST be the single capital letter of the best option.',
  'Do NOT output safety classifications, disclaimers, explanations of your process,',
  'markdown fences, or ANY text before/after the JSON array.'
].join('\n');

/* ================================ state ================================= */

let currentMarkdown = '';
let currentTitle = '';

const $ = (id) => document.getElementById(id);

/* =============================== settings =============================== */

async function getSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
  const merged = { ...DEFAULTS, ...stored };
  // v1.2.1 migration: old summaries folder -> Pages-served docs path
  if (merged.folder === 'ffcamp-summaries') {
    merged.folder = DEFAULTS.folder;
    chrome.storage.local.set({ folder: merged.folder });
  }
  return merged;
}

function fillSettingsForm(s) {
  $('set-or-key').value = s.openrouterKey;
  $('set-model').value = s.model;
  $('set-gh-token').value = s.githubToken;
  $('set-repo').value = s.repo;
  $('set-branch').value = s.branch;
  $('set-folder').value = s.folder;
}

async function saveSettings() {
  const values = {
    openrouterKey: $('set-or-key').value.trim(),
    model: $('set-model').value.trim() || DEFAULTS.model,
    githubToken: $('set-gh-token').value.trim(),
    repo: $('set-repo').value.trim(),
    branch: $('set-branch').value.trim() || DEFAULTS.branch,
    folder: $('set-folder').value.trim() || DEFAULTS.folder
  };
  await chrome.storage.local.set(values);

  const warnings = [];
  if (values.openrouterKey && !values.openrouterKey.startsWith('sk-or-v1-')) {
    warnings.push('⚠️ That does not look like an OpenRouter key - it should start with "sk-or-v1-".');
  }
  if (values.githubToken && !/^(ghp_|github_pat_|gho_)/.test(values.githubToken)) {
    warnings.push('⚠️ That does not look like a GitHub token (expected ghp_/github_pat_/gho_).');
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(values.repo)) {
    warnings.push('⚠️ Repo must be owner/name - exactly: jamestheogcoder/ffcamp_extension');
  }
  flashStatus(
    $('settings-status'),
    warnings.length ? 'err' : 'ok',
    warnings.length ? warnings.join(' ') : 'Settings saved.'
  );
}

/* ============================== OpenRouter ============================== */

/* strip classifier noise like "User Safety: safe", code fences, and any
   preamble before the first markdown heading */
function sanitizeModelOutput(text) {
  let t = String(text ?? '').trim();
  const fenced = /^```(?:markdown|md)?\n([\s\S]*?)\n?```$/i.exec(t);
  if (fenced) t = fenced[1];
  const h = t.search(/^#{1,3}\s/m);
  if (h > 0) t = t.slice(h);
  t = t.replace(/^(?:user\s+)?safety[^\n]*\n+/i, '').trim();
  return t;
}

async function askAI(messages, opts = {}) {
  const s = await getSettings();
  const key = (s.openrouterKey || '').trim();
  if (!key) throw new Error('Add your OpenRouter API key in Settings first.');

  const headers = new Headers({
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://github.com/ffcamp-extension',
    'X-Title': 'FFCamp Extension'
  });
  headers.set('Authorization', `Bearer ${key}`);

  const body = { model: s.model, messages };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 401) {
      throw new Error(
        `OpenRouter 401 (${body.slice(0, 120)}...). Your saved key looks wrong - open Settings, re-paste ONLY the sk-or-v1-... string, Save, then hit "Test connections".`
      );
    }
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter returned an empty response.');
  return sanitizeModelOutput(content.trim());
}

async function testConnections() {
  const out = $('test-results');
  unhide(out);
  out.textContent = 'Testing...\n';
  setBusy($('btn-test'), true);
  const s = await getSettings();
  const lines = [];

  try {
    const key = (s.openrouterKey || '').trim();
    const keyLooksValid = /^sk-or-v1-[\w-]+$/.test(key);
    lines.push(
      `OpenRouter key stored: ${key ? `${key.slice(0, 12)}...${key.slice(-4)} (${key.length} chars) ${keyLooksValid ? '[format OK]' : '❌ WRONG FORMAT - must start with sk-or-v1-'}` : 'MISSING'}`
    );
    const orRes = await fetch('https://openrouter.ai/api/v1/key', {
      headers: { Authorization: `Bearer ${key}` }
    });
    const orBody = await orRes.json().catch(() => ({}));
    lines.push(
      `OpenRouter API: ${orRes.ok ? `OK - label "${orBody.data?.label}", used $${orBody.data?.usage ?? 0}` : `FAIL HTTP ${orRes.status} ${JSON.stringify(orBody).slice(0, 150)}`}`
    );

    lines.push(`GitHub token stored: ${s.githubToken ? `${s.githubToken.slice(0, 9)}... (${s.githubToken.length} chars)` : 'MISSING'}`);
    lines.push(`Repo setting: ${s.repo || 'MISSING'} | branch: ${s.branch}`);
    if (/^[\w.-]+\/[\w.-]+$/.test(s.repo)) {
      const gh = await fetch(`https://api.github.com/repos/${s.repo}`, {
        headers: { Authorization: `Bearer ${s.githubToken.trim()}` }
      });
      const ghBody = await gh.json().catch(() => ({}));
      lines.push(
        `GitHub API: ${gh.ok ? `OK - owner "${ghBody.owner?.login}", push access: ${ghBody.permissions?.push}` : `FAIL HTTP ${gh.status} ${ghBody.message ?? ''}`}`
      );
    } else {
      lines.push('GitHub API: SKIPPED - repo must be owner/name');
    }
  } catch (err) {
    lines.push(`Unexpected error: ${err.message}`);
  }

  out.textContent = lines.join('\n');
  setBusy($('btn-test'), false);
}

/* ============================= page summary ============================= */

async function summarizePage() {
  hide($('sum-status'));
  hide($('md-preview'));
  hide($('sum-actions'));

  setBusy($('btn-summarize'), true);
  try {
    showStatus($('sum-status'), null, 'Extracting page content...');

    const tab = await getActiveTab();
    if (!tab?.id) throw new Error('No active tab found.');

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__ffcampPageData ?? null
    });

    if (!result?.text) {
      throw new Error(
        'Could not read this page. Reload the tab, then click the FFCamp icon once more and retry (browser pages like chrome:// are not readable).'
      );
    }

    const pageText = result.text.slice(0, MAX_PAGE_CHARS);

    /* also grab MCQs detected on the page (for Variation 1) */
    let mcqBlock = '';
    try {
      const [{ result: mq }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => window.__ffcampMcqData ?? null
      });
      const qs = (mq?.questions ?? []).filter((q) => q.options?.length >= 2).slice(0, 30);
      if (qs.length) {
        const list = qs
          .map((q) => {
            const opts = q.options.map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`).join('\n');
            return `${q.qid + 1}. ${q.text}\n${opts}`;
          })
          .join('\n\n');
        mcqBlock = `\n\n=== MCQs ON THIS PAGE ===\n${list}`;
      }
    } catch {
      /* MCQ detection is optional for summaries */
    }

    currentTitle = result.title;
    const sourceMsg = `TITLE: ${result.title}\nURL: ${result.url}\n\nCONTENT:\n${pageText}${mcqBlock}`;

    showStatus($('sum-status'), null, 'Part 1/2 - transcribing original content...');
    const part1 = await askAI(
      [
        { role: 'system', content: VERBATIM_SYSTEM },
        { role: 'user', content: sourceMsg }
      ],
      { temperature: 0.2 }
    );

    showStatus($('sum-status'), null, 'Part 2/2 - writing study analysis...');
    const part2 = await askAI(
      [
        { role: 'system', content: ANALYSIS_SYSTEM },
        { role: 'user', content: sourceMsg }
      ],
      { temperature: 0.3 }
    );

    currentMarkdown =
      `# ${result.title}\n\n` +
      `> Source: ${result.url} · Saved ${new Date().toLocaleString()}\n\n` +
      `${part1}\n\n---\n\n${part2}\n`;

    const preview = $('md-preview');
    preview.textContent = currentMarkdown;
    unhide(preview);
    unhide($('sum-actions'));
    showStatus($('sum-status'), 'ok', mcqBlock ? 'Done - content + MCQs + analysis ready.' : 'Done - both sections ready.');
  } catch (err) {
    showStatus($('sum-status'), 'err', err.message);
  } finally {
    setBusy($('btn-summarize'), false);
  }
}

async function saveSummaryToGithub() {
  if (!currentMarkdown) return;
  const el = $('btn-github');
  setBusy(el, true);
  try {
    const s = await getSettings();
    if (!s.githubToken) throw new Error('Add your GitHub token in Settings first.');
    if (!/^[\w.-]+\/[\w.-]+$/.test(s.repo)) {
      throw new Error(
        'Repo setting is invalid. Open Settings and set the Repo field EXACTLY to: jamestheogcoder/ffcamp_extension  (owner/name - not just the repo name), then Save.'
      );
    }

    const path = `${s.folder.replace(/^\/+|\/+$/g, '')}/${fileName(currentTitle)}.md`;
    const api = `https://api.github.com/repos/${s.repo}/contents/${path
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;

    const commit = async (p) =>
      fetch(api.replace(/\/contents\/.*/, `/contents/${p.split('/').map(encodeURIComponent).join('/')}`), {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${s.githubToken}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `FFCamp summary: ${currentTitle}`,
          content: toBase64(currentMarkdown),
          ...(s.branch ? { branch: s.branch } : {})
        })
      });

    let res = await commit(path);
    if (res.status === 422) {
      // file already exists -> never overwrite, add timestamp
      const alt = `${s.folder.replace(/^\/+|\/+$/g, '')}/${fileName(currentTitle)}-${Date.now()}.md`;
      res = await commit(alt);
      if (res.ok) {
        showStatus($('sum-status'), 'ok', `Committed to ${s.repo} (${alt}).`);
        return;
      }
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(`GitHub ${res.status}: ${body.message ?? 'upload failed'}`);
    }
    const [owner, repoName] = s.repo.split('/');
    const pagesUrl = `https://${owner}.github.io/${repoName}/?f=${encodeURIComponent(
      `${fileName(currentTitle)}.md`
    )}`;
    showStatus($('sum-status'), 'ok', `Committed to ${s.repo} (${path}). Live: ${pagesUrl}`);
  } catch (err) {
    showStatus($('sum-status'), 'err', err.message);
  } finally {
    setBusy(el, false);
  }
}

function downloadSummary() {
  if (!currentMarkdown) return;
  const blob = new Blob([currentMarkdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download(
    { url, filename: `ffcamp/${fileName(currentTitle)}.md`, saveAs: false },
    () => URL.revokeObjectURL(url)
  );
}

/* ============================ MCQ ================================== */

async function autoSolvePage() {
  const resultsBox = $('mcq-results');
  resultsBox.textContent = '';
  hide($('mcq-status'));

  setBusy($('btn-autosolve'), true);
  try {
    showStatus($('mcq-status'), null, 'Scanning page for MCQs...');

    const tab = await getActiveTab();
    if (!tab?.id) throw new Error('No active tab found.');

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.__ffcampMcqData ?? null
    });

    const qs = (result?.questions ?? []).filter((q) => q.options?.length >= 2);
    if (!qs.length) {
      throw new Error(
        'No clickable MCQs detected on this page. Radio buttons, checkboxes, [role=radio] widgets or plain "1. ... A) ..." text are supported - or paste the questions below instead.'
      );
    }

    showStatus($('mcq-status'), null, `Found ${qs.length} question(s). Asking AI...`);

    const numbered = qs
      .map((q) => {
        const opts = q.options
          .map((o, i) => `${String.fromCharCode(65 + i)}) ${o}`)
          .join('\n');
        return `[Q${q.qid}] ${q.text}\n${opts}`;
      })
      .join('\n\n');

    const raw = await askAI(
      [
        { role: 'system', content: MCQ_SYSTEM_AUTO },
        { role: 'user', content: numbered }
      ],
      { temperature: 0.1 }
    );

    let parsed = parseAnswers(raw);
    if (!parsed) {
      showStatus($('mcq-status'), null, 'Model output was messy - retrying in strict mode...');
      const raw2 = await askAI(
        [
          {
            role: 'system',
            content:
              'You output ONLY valid JSON. No prose, no safety notes, no markdown fences. First character of your reply is "[" and last is "]".'
          },
          {
            role: 'user',
            content:
              numbered +
              '\n\nReturn ONLY the JSON array now: [{"question":"[Q0]...","answer":"B","reasoning":"..."}]'
          }
        ],
        { temperature: 0 }
      );
      parsed = parseAnswers(raw2);
    }
    if (!parsed) throw new Error(`AI returned unparsable output: ${raw.slice(0, 200)}`);

    for (let i = 0; i < parsed.length; i++) resultsBox.appendChild(mcqCard(parsed[i]));

    /* map answers -> clicks on the page */
    const choices = [];
    for (let i = 0; i < Math.min(parsed.length, qs.length); i++) {
      const idx = letterToIndex(parsed[i]?.answer, qs[i].options);
      if (idx >= 0) choices.push({ qid: qs[i].qid, choice: idx });
    }

    let clickInfo = null;
    if (choices.length) {
      showStatus($('mcq-status'), null, 'Clicking correct options on the page...');
      const [{ result: clickRes }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: applyAnswersOnPage,
        args: [choices]
      });
      clickInfo = clickRes;
    }

    showStatus(
      $('mcq-status'),
      'ok',
      `Answered ${parsed.length}/${qs.length}` +
        (clickInfo ? ` · clicked ${clickInfo.clicked} option(s) on the page` : ' · text-only page (no inputs to click)')
    );
  } catch (err) {
    showStatus($('mcq-status'), 'err', err.message);
  } finally {
    setBusy($('btn-autosolve'), false);
  }
}

/* injected into the page; must be self-contained */
function clickCheckAnswerButton() {
  const buttons = [
    ...document.querySelectorAll('button[type="button"], button, [role="button"]')
  ].filter((b) => b.offsetParent !== null || b.getClientRects().length);

  const exact = ['check your answer', 'check answer'];
  let target = null;
  for (const phrase of exact) {
    target = buttons.find((b) => b.textContent.trim().toLowerCase() === phrase);
    if (target) break;
  }
  if (!target) {
    const re = /check\s*(your\s*)?answer|^check$|^submit$|^verify$/i;
    target = buttons.find((b) => re.test(b.textContent.trim()));
  }
  if (!target) return { clicked: false };

  if (target.scrollIntoView) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  target.click();
  return { clicked: true, text: target.textContent.trim().slice(0, 60) };
}

/* injected into the page; must be self-contained */
function probeAndClickSubmitNext() {
  const re = /submit\s*and\s*go\s*to\s*next|go\s*to\s*next\s*challenge/i;
  const buttons = [
    ...document.querySelectorAll('button[type="button"], button, [role="button"]')
  ].filter((b) => b.getClientRects().length > 0);
  const t = buttons.find(
    (b) => re.test(b.textContent.trim()) && b.getAttribute('aria-disabled') !== 'true'
  );
  if (!t) return false;
  if (t.scrollIntoView) t.scrollIntoView({ behavior: 'smooth', block: 'center' });
  t.click();
  return true;
}

async function pressNextOnPage() {
  setBusy($('btn-next'), true);
  try {
    const tab = await getActiveTab();
    if (!tab?.id) throw new Error('No active tab found.');
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: clickCheckAnswerButton
    });
    if (!result?.clicked) {
      // no check button - maybe page already shows the submit-next button
      const [{ result: direct }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: probeAndClickSubmitNext
      });
      if (direct) {
        showStatus($('mcq-status'), 'ok', 'Advanced to next challenge.');
      } else {
        showStatus($('mcq-status'), 'err', 'No "Check your answer" button found on this page.');
      }
      return;
    }

    showStatus(
      $('mcq-status'),
      null,
      'Checked answer - waiting for "Submit and go to next challenge"...'
    );

    const deadline = Date.now() + 12000;
    let advanced = false;
    while (Date.now() < deadline && !advanced) {
      await new Promise((r) => setTimeout(r, 700));
      const [{ result: hit }] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: probeAndClickSubmitNext
      });
      advanced = !!hit;
    }

    if (advanced) {
      showStatus($('mcq-status'), 'ok', 'Checked answer + moved to next challenge.');
    } else {
      showStatus($('mcq-status'), 'ok', `Clicked "${result.text}" on the page.`);
    }
  } catch (err) {
    showStatus($('mcq-status'), 'err', err.message);
  } finally {
    setBusy($('btn-next'), false);
  }
}

/* injected into the page; must be self-contained */
function applyAnswersOnPage(choices) {
  let clicked = 0;
  let missing = 0;
  let first = null;
  for (const a of choices) {
    const target = document.querySelector(
      `[data-ffcamp-q="${a.qid}"][data-ffcamp-c="${a.choice}"]`
    );
    if (!target) {
      missing++;
      continue;
    }
    try {
      target.click();
      clicked++;
    } catch {
      missing++;
    }
    const wrap = target.closest('label') || target.parentElement || target;
    wrap.style.outline = '2px solid #22c55e';
    wrap.style.borderRadius = '4px';
    if (!first) first = target;
  }
  if (first && first.scrollIntoView) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
  return { clicked, missing };
}

function letterToIndex(answer, options) {
  const s = String(answer ?? '').trim();
  const m = /^\(?([A-H])\b/i.exec(s);
  if (m) return m[1].toUpperCase().charCodeAt(0) - 65;
  const norm = s.replace(/^\(?[A-H]\)?[\.\):]?\s*/i, '').toLowerCase();
  const byText = options.findIndex(
    (o) => o.toLowerCase() === norm || norm.includes(o.toLowerCase())
  );
  return byText;
}

async function solveMcq() {
  const input = $('mcq-input').value.trim();
  const resultsBox = $('mcq-results');
  resultsBox.textContent = '';
  hide($('mcq-status'));

  if (!input) {
    showStatus($('mcq-status'), 'err', 'Paste at least one question first.');
    return;
  }

  setBusy($('btn-solve'), true);
  try {
    showStatus($('mcq-status'), null, 'Thinking...');
    const raw = await askAI(
      [
        { role: 'system', content: MCQ_SYSTEM },
        { role: 'user', content: input }
      ],
      { temperature: 0.1 }
    );

    const answers = parseAnswers(raw);
    if (answers) {
      for (const item of answers) resultsBox.appendChild(mcqCard(item));
      showStatus($('mcq-status'), 'ok', `${answers.length} question(s) answered.`);
    } else {
      const pre = document.createElement('pre');
      pre.className = 'raw';
      pre.textContent = raw;
      resultsBox.appendChild(pre);
      showStatus($('mcq-status'), null, 'Model replied in free text (JSON parse failed).');
    }
  } catch (err) {
    showStatus($('mcq-status'), 'err', err.message);
  } finally {
    setBusy($('btn-solve'), false);
  }
}

function mcqCard(item) {
  const card = document.createElement('div');
  card.className = 'card';

  const q = document.createElement('div');
  q.className = 'q';
  q.textContent = item.question ?? '(question)';
  card.appendChild(q);

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = String(item.answer ?? '?');
  card.appendChild(badge);

  if (item.reasoning) {
    const why = document.createElement('div');
    why.className = 'why';
    why.textContent = item.reasoning;
    card.appendChild(why);
  }
  return card;
}

function parseAnswers(raw) {
  let t = String(raw ?? '').replace(/```(?:json)?/gi, '');

  // direct array / wrapped-object attempts
  const attempts = [t];
  const s = t.indexOf('[');
  const e = t.lastIndexOf(']');
  if (s !== -1 && e > s) attempts.push(t.slice(s, e + 1));
  for (const a of attempts) {
    try {
      const j = JSON.parse(a.trim());
      if (Array.isArray(j)) return j;
      if (Array.isArray(j?.questions)) return j.questions;
      if (Array.isArray(j?.answers)) return j.answers;
    } catch {
      /* next */
    }
  }

  /* last-resort letter scan: "[Q2] B", "Q2: b)", "answer is C", "2) A" */
  const found = new Map();
  const qRe = /\[?\bQ\s*(\d+)\b\]?[^A-Ha-h\n]{0,20}?\(?([A-H])\b/gi;
  for (const m of t.matchAll(qRe)) found.set(+m[1], m[2].toUpperCase());
  if (found.size === 0) {
    const looseRe = /(?:answer|option|choice)\D{0,12}\(?([A-H])\b/gi;
    let i = 0;
    for (const m of t.matchAll(looseRe)) found.set(i++, m[1].toUpperCase());
  }
  if (found.size > 0) {
    return [...found.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([q, ans]) => ({ question: `[Q${q}]`, answer: ans, reasoning: '(parsed from noisy model output)' }));
  }
  return null;
}

/* ================================ helpers =============================== */

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

async function getModelLabel() {
  return (await getSettings()).model;
}

function fileName(title) {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return base || 'page';
}

function toBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(bin);
}

function setBusy(btn, busy) {
  btn.disabled = busy;
  if (busy && !btn.dataset.label) btn.dataset.label = btn.textContent;
  btn.textContent = busy ? 'Working...' : (btn.dataset.label ?? btn.textContent);
}

function showStatus(el, kind, msg) {
  el.hidden = false;
  el.className = `status${kind ? ` ${kind}` : ''}`;
  el.textContent = msg;
}

function flashStatus(el, kind, msg) {
  showStatus(el, kind, msg);
  setTimeout(() => hide(el), 2500);
}

function hide(el) {
  el.hidden = true;
}
function unhide(el) {
  el.hidden = false;
}

/* ============================ tabs + wiring ============================= */

document.querySelectorAll('.tab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));
    tabBtn.classList.add('active');
    $(`tab-${tabBtn.dataset.tab}`).classList.add('active');
  });
});

$('btn-summarize').addEventListener('click', summarizePage);
$('btn-github').addEventListener('click', saveSummaryToGithub);
$('btn-download').addEventListener('click', downloadSummary);
$('btn-solve').addEventListener('click', solveMcq);
$('btn-autosolve').addEventListener('click', autoSolvePage);
$('btn-next').addEventListener('click', pressNextOnPage);
$('btn-save-settings').addEventListener('click', saveSettings);
$('btn-test').addEventListener('click', testConnections);

getSettings().then(fillSettingsForm);
