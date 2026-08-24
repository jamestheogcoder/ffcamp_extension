'use strict';

/* ============================== constants =============================== */

const DEFAULTS = {
  openrouterKey: '',
  model: 'openrouter/free',
  githubToken: '',
  repo: '',
  branch: 'main',
  folder: 'ffcamp-summaries'
};

const MAX_PAGE_CHARS = 60000;

const SUMMARIZE_SYSTEM = [
  'You are an expert study-notes writer.',
  'Summarize the provided web page content as well-structured Markdown.',
  'Output ONLY Markdown - no preamble, no code fences, no commentary.',
  'Required structure:',
  '# <page title>',
  '## TL;DR',
  '2-3 sentence overview.',
  '## Key Points',
  '- bullet list of the most important takeaways',
  '## Details',
  'short subsections or bullets preserving important facts, numbers, dates, names and definitions',
  '## Terms & Definitions',
  'a Markdown table ONLY if technical terms exist; otherwise omit this section',
  'Stay faithful to the source. Never invent facts.'
].join('\n');

const MCQ_SYSTEM = [
  'You are an expert tutor solving multiple-choice questions.',
  'For EACH question choose the single best option.',
  'Respond ONLY with a valid JSON array and nothing else:',
  '[{"question": "...", "answer": "B", "reasoning": "1-3 sentence justification"}]',
  'No markdown fences, no extra text before or after the JSON.'
].join('\n');

/* ================================ state ================================= */

let currentMarkdown = '';
let currentTitle = '';

const $ = (id) => document.getElementById(id);

/* =============================== settings =============================== */

async function getSettings() {
  const stored = await chrome.storage.local.get(Object.keys(DEFAULTS));
  return { ...DEFAULTS, ...stored };
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
  flashStatus($('settings-status'), 'ok', 'Settings saved.');
}

/* ============================== OpenRouter ============================== */

async function askAI(messages) {
  const s = await getSettings();
  if (!s.openrouterKey) throw new Error('Add your OpenRouter API key in Settings first.');

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${s.openrouterKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://github.com/ffcamp-extension',
      'X-Title': 'FFCamp Extension'
    },
    body: JSON.stringify({ model: s.model, messages })
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenRouter returned an empty response.');
  return content.trim();
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
    showStatus($('sum-status'), null, `Asking ${await getModelLabel()} to summarize...`);

    currentTitle = result.title;
    currentMarkdown = await askAI([
      { role: 'system', content: SUMMARIZE_SYSTEM },
      {
        role: 'user',
        content: `Summarize this page.\n\nTITLE: ${result.title}\nURL: ${result.url}\n\nCONTENT:\n${pageText}`
      }
    ]);

    const preview = $('md-preview');
    preview.textContent = currentMarkdown;
    unhide(preview);
    unhide($('sum-actions'));
    showStatus($('sum-status'), 'ok', 'Summary ready. Save it below.');
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
      throw new Error('Set your repo in Settings as owner/name (e.g. you/study-notes).');
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
    showStatus($('sum-status'), 'ok', `Committed to ${s.repo} (${path}).`);
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

/* ================================= MCQ ================================== */

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
    const raw = await askAI([
      { role: 'system', content: MCQ_SYSTEM },
      { role: 'user', content: input }
    ]);

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
  const candidates = [raw];
  const bracketed = raw.match(/\[[\s\S]*\]/);
  if (bracketed) candidates.push(bracketed[0]);
  for (const c of candidates) {
    try {
      const j = JSON.parse(c);
      if (Array.isArray(j)) return j;
      if (Array.isArray(j?.questions)) return j.questions;
      if (Array.isArray(j?.answers)) return j.answers;
    } catch {
      /* try next */
    }
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
$('btn-save-settings').addEventListener('click', saveSettings);

getSettings().then(fillSettingsForm);
