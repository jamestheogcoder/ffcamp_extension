'use strict';

/* ============================== constants =============================== */

const DEFAULTS = {
  cat: 'openai',            // 'openai' (OpenAI-compatible) | 'anthropic'
  presetId: 'openrouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKey: '',
  model: 'openrouter/free',
  accounts: [],             // [{id, enabled, cat, presetId, baseUrl, apiKey, model}]
  activeId: '',
  githubToken: '',
  repo: '',
  branch: 'main',
  folder: 'docs/summaries'
};

const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID().slice(0, 8) : Date.now().toString(36));

const PRESETS = {
  openai: [
    { id: 'openrouter', name: 'OpenRouter', url: 'https://openrouter.ai/api/v1',
      models: ['openrouter/free', 'meta-llama/llama-3.3-70b-instruct:free', 'deepseek/deepseek-r1:free', 'google/gemma-3-12b-it:free'] },
    { id: 'openai', name: 'OpenAI', url: 'https://api.openai.com/v1',
      models: ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'] },
    { id: 'groq', name: 'Groq', url: 'https://api.groq.com/openai/v1',
      models: ['llama-3.3-70b-versatile'] },
    { id: 'deepseek', name: 'DeepSeek', url: 'https://api.deepseek.com/v1',
      models: ['deepseek-chat', 'deepseek-reasoner'] },
    { id: 'ollama', name: 'Ollama (local)', url: 'http://localhost:11434/v1',
      models: ['llama3.2', 'qwen2.5'] },
    { id: 'custom', name: 'Custom…', url: '', models: [] }
  ],
  anthropic: [
    { id: 'anthropic', name: 'Anthropic', url: 'https://api.anthropic.com/v1',
      models: ['claude-sonnet-4-5', 'claude-haiku-4-5'] },
    { id: 'custom', name: 'Custom…', url: '', models: [] }
  ]
};

const MAX_PAGE_CHARS = 60000;

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
let currentUrl = '';

/* map a page URL -> nested folder path + file name
   e.g. .../learn/javascript-v9/lecture-x/what-is-y
   -> { dir: 'javascript-v9/lecture-x', file: 'what-is-y' }        */
function sanitizeSeg(s) {
  return String(s)
    .toLowerCase()
    .replace(/\.(html?|php|aspx)$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function urlToNotePath(url) {
  try {
    const u = new URL(url);
    const SKIP_FIRST = new Set([
      'learn', 'courses', 'course', 'challenges', 'challenge', 'tutorial',
      'tutorials', 'docs', 'documentation', 'wiki', 'lesson', 'lessons',
      'module', 'modules', 'questions', 'quiz', 'quizzes', 'practice', 'exercises'
    ]);
    let segs = u.pathname
      .split('/')
      .filter(Boolean)
      .map((s) => sanitizeSeg(decodeURIComponent(s)))
      .filter(Boolean);
    while (segs.length && SKIP_FIRST.has(segs[0])) segs.shift();
    if (!segs.length) return null;
    const file = segs.pop();
    const dir = segs.slice(-4).join('/'); // cap folder depth at 4
    return { dir, file };
  } catch {
    return null;
  }
}

const $ = (id) => document.getElementById(id);

/* =============================== settings =============================== */

async function getSettings() {
  const stored = await chrome.storage.local.get(null);
  const merged = { ...DEFAULTS, ...stored };

  /* ---- v1.8.0 migration: single provider -> accounts[] ---- */
  if (!Array.isArray(merged.accounts)) {
    const legacyKey = (stored.apiKey || stored.openrouterKey || '').trim();
    merged.accounts = legacyKey
      ? [{
          id: uid(), enabled: true,
          cat: stored.cat || 'openai',
          presetId: stored.presetId || 'openrouter',
          baseUrl: (stored.baseUrl || 'https://openrouter.ai/api/v1').replace(/\/+$/, ''),
          apiKey: legacyKey,
          model: stored.model || DEFAULTS.model
        }]
      : [];
    if (!merged.accounts.length && !legacyKey) {
      merged.accounts = [{
        id: uid(), enabled: true, cat: 'openai', presetId: 'openrouter',
        baseUrl: DEFAULTS.baseUrl, apiKey: '', model: DEFAULTS.model
      }];
    }
    merged.activeId = merged.accounts[0].id;
    chrome.storage.local.set({ accounts: merged.accounts, activeId: merged.activeId });
  }
  if (!merged.accounts.length) {
    merged.accounts = [{ id: uid(), enabled: false, cat: 'openai', presetId: 'custom', baseUrl: '', apiKey: '', model: '' }];
  }
  let act = merged.accounts.find((a) => a.id === merged.activeId) || merged.accounts[0];
  merged.activeId = act.id;

  /* derive flat mirrors so all existing code paths keep working */
  Object.assign(merged, {
    cat: act.cat, presetId: act.presetId, baseUrl: act.baseUrl,
    apiKey: act.apiKey, model: act.model
  });

  // legacy/broken folder values -> Pages-served docs path
  const BAD_FOLDERS = ['', 'ffcamp-summaries', 'ffcamp_extension'];
  const norm = (merged.folder || '').replace(/^\/+|\/+$/g, '');
  if (BAD_FOLDERS.includes(norm)) {
    merged.folder = DEFAULTS.folder;
    chrome.storage.local.set({ folder: merged.folder });
  }
  return merged;
}

async function persistAccounts(accounts, activeId) {
  await chrome.storage.local.set({ accounts, ...(activeId ? { activeId } : {}) });
}

function fillSettingsForm(s) {
  document.querySelectorAll('.ptab').forEach((t) =>
    t.classList.toggle('active', t.dataset.cat === s.cat)
  );
  fillPresetSelect(s.cat, s.presetId);
  $('set-base').value = s.baseUrl;
  $('set-prov-key').value = s.apiKey;
  $('set-model').value = s.model;
  $('set-gh-token').value = s.githubToken;
  $('set-repo').value = s.repo;
  $('set-branch').value = s.branch;
  $('set-folder').value = s.folder;
}

function fillPresetSelect(cat, presetId) {
  const sel = $('set-base-select');
  sel.innerHTML = PRESETS[cat]
    .map((p) => `<option value="${p.id}">${p.name}</option>`)
    .join('');
  sel.value = PRESETS[cat].some((p) => p.id === presetId) ? presetId : 'custom';
  applyPreset(sel.value);
}

function applyPreset(pid) {
  const cat = currentCat();
  const p = PRESETS[cat].find((x) => x.id === pid) || PRESETS[cat].at(-1);
  const baseInput = $('set-base');
  if (p.url) {
    baseInput.value = p.url;
    baseInput.readOnly = true;
  } else {
    baseInput.value = '';
    baseInput.readOnly = false;
    baseInput.placeholder = 'https://your-endpoint/v1';
  }
  $('set-model').setAttribute('list', `models-${cat}-${pid}`);
  let dl = $(`models-${cat}-${pid}`);
  if (!dl) {
    dl = document.createElement('datalist');
    dl.id = `models-${cat}-${pid}`;
    document.body.appendChild(dl);
  }
  dl.innerHTML = p.models.map((m) => `<option value="${m}">`).join('');
}

function currentCat() {
  return document.querySelector('.ptab.active')?.dataset.cat || 'openai';
}

async function saveSettings() {
  const stored = await getSettings();
  const accounts = (stored.accounts || []).map((a) => ({ ...a }));
  let act = accounts.find((a) => a.id === stored.activeId) || accounts[0];
  if (!act) {
    act = { id: uid(), enabled: true };
    accounts.push(act);
  }

  /* form -> active account */
  act.cat = currentCat();
  act.presetId = $('set-base-select').value;
  act.baseUrl = $('set-base').value.trim().replace(/\/+$/, '');
  act.apiKey = $('set-prov-key').value.trim();
  act.model = $('set-model').value.trim() || DEFAULTS.model;

  await chrome.storage.local.set({ accounts, activeId: act.id });

  const warnings = [];
  if (!act.apiKey) warnings.push('⚠️ Active account has no API key.');
  if (!act.baseUrl) warnings.push('⚠️ Base URL is empty.');
  const enabled = accounts.filter((a) => a.enabled !== false).length;
  logLine(`💾 SAVED account "${act.presetId}:${act.model}" @ ${act.baseUrl} · key ${maskKey(act.apiKey)} · ${enabled} racing`, 'ok');
  flashStatus(
    $('settings-status'),
    warnings.length ? 'err' : 'ok',
    warnings.length
      ? warnings.join(' ')
      : `Saved · "${act.presetId}:${act.model}" · ${enabled} account(s) racing ⚡`
  );
  editorForced = false; // back to the list view, ready to add another
  renderAccounts();
}

async function saveGithub() {
  const github = {
    githubToken: $('set-gh-token').value.trim(),
    repo: $('set-repo').value.trim(),
    branch: $('set-branch').value.trim() || DEFAULTS.branch,
    folder: $('set-folder').value.trim() || DEFAULTS.folder
  };
  await chrome.storage.local.set(github);

  const warnings = [];
  if (github.githubToken && !/^(ghp_|github_pat_|gho_)/.test(github.githubToken)) {
    warnings.push('⚠️ Token format looks wrong (expected ghp_/github_pat_/gho_).');
  }
  if (!/^[\w.-]+\/[\w.-]+$/.test(github.repo)) {
    warnings.push('⚠️ Repo must be owner/name - exactly: jamestheogcoder/ffcamp_extension');
  }
  flashStatus(
    $('gh-status'),
    warnings.length ? 'err' : 'ok',
    warnings.length
      ? warnings.join(' ')
      : 'GitHub settings saved ✓'
  );
}

/* provider editor visibility: hidden until an account is clicked,
   auto-shown when there are no accounts yet */
let editorForced = false;
function applyEditorVisibility(accCount) {
  const el = $('provider-editor');
  if (!el) return; // older markup without editor section
  const show = accCount === 0 || editorForced;
  el.hidden = !show;
}

/* ============================ accounts list ============================== */

function renderAccounts() {
  const box = $('acct-list');
  getSettings().then((s) => {
    const accs = s.accounts || [];
    if (!accs.length) {
      box.innerHTML = '<p class="hint">No accounts yet — configure below and press “+ Add”.</p>';
      applyEditorVisibility(0);
      return;
    }
    box.innerHTML = accs
      .map((a) => {
        const on = a.enabled !== false;
        return `<div class="acct${a.id === s.activeId ? ' active' : ''}${on ? '' : ' off'}" data-id="${a.id}">
          <input type="checkbox" data-toggle="${a.id}" ${on ? 'checked' : ''} title="Include in race" />
          <span class="acct-name" data-select="${a.id}">${on ? '⚡' : '⏸'} ${esc(a.presetId)} · ${esc(a.model || '?')}</span>
          <button class="abtn" data-edit="${a.id}" title="Edit in form below">✏️</button>
          <button class="abtn" data-del="${a.id}" title="Delete">🗑️</button>
        </div>`;
      })
      .join('');
    applyEditorVisibility(accs.length);
  });
}

function revealEditor() {
  editorForced = true;
  const el = $('provider-editor');
  if (el) el.hidden = false;
}

$('acct-list').addEventListener('click', async (e) => {
  const del = e.target.closest('[data-del]');
  if (del) {
    const s = await getSettings();
    const accounts = s.accounts.filter((a) => a.id !== del.dataset.del);
    const activeId = accounts[0]?.id || '';
    await persistAccounts(accounts, activeId);
    fillSettingsForm(await getSettings());
    renderAccounts();
    return;
  }
  const edit = e.target.closest('[data-edit]');
  if (edit) {
    await persistAccounts(undefined, edit.dataset.edit);
    fillSettingsForm(await getSettings());
    renderAccounts();
    revealEditor();
    return;
  }
  const sel = e.target.closest('[data-select]');
  if (sel) {
    await persistAccounts(undefined, sel.dataset.select);
    fillSettingsForm(await getSettings());
    renderAccounts();
    revealEditor(); // clicking an account reveals its provider form
  }
});

$('acct-list').addEventListener('change', async (e) => {
  const t = e.target.closest('[data-toggle]');
  if (!t) return;
  const s = await getSettings();
  const accounts = s.accounts.map((a) =>
    a.id === t.dataset.toggle ? { ...a, enabled: t.checked } : a
  );
  await persistAccounts(accounts);
  renderAccounts();
});

$('b-acct-add').addEventListener('click', async () => {
  const s = await getSettings();
  const acct = {
    id: uid(), enabled: true,
    cat: 'openai', presetId: 'openrouter',
    baseUrl: DEFAULTS.baseUrl, apiKey: '', model: DEFAULTS.model
  };
  const accounts = [...(s.accounts || []), acct];
  await persistAccounts(accounts, acct.id);
  fillSettingsForm(await getSettings());
  renderAccounts();
  revealEditor();
  flashStatus(
    $('settings-status'),
    null,
    'Pick OpenAI-Compatible or Anthropic-Compatible, paste key + model, then “Save account”.'
  );
});

/* ============================== AI calls ================================ */

/* strip classifier noise like "User Safety: safe", lone verdict lines,
   code fences, and any preamble before the first markdown heading */
function sanitizeModelOutput(text) {
  let t = String(text ?? "").trim();
  const fenced = /^```(?:markdown|md)?\n([\s\S]*?)\n?```$/i.exec(t);
  if (fenced) t = fenced[1];
  t = t
    .replace(/^\s*\*{0,2}(?:user\s+)?safety\b[^#\n]*$/gim, "")
    .replace(/^\s*(?:safe|unsafe|clean|harmless)\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n");
  const h = t.search(/^#{1,3}\s/m);
  if (h > 0) t = t.slice(h);
  return t.trim();
}

let LAST_RACE = null; // { name, ms } of the winning account
let LAST_URL = null;  // endpoint URL that actually worked last

async function askAI(messages, opts = {}) {
  const s = await getSettings();
  const accs = (s.accounts || []).filter(
    (a) => a.enabled !== false && (a.apiKey || '').trim() && (a.baseUrl || '').trim()
  );
  if (!accs.length)
    throw new Error('No enabled AI accounts with a key. Settings → Accounts → add one.');

  if (accs.length === 1) {
    LAST_RACE = null;
    return runAccount(accs[0], messages, opts);
  }
  return raceAccounts(accs, messages, opts);
}

async function runAccount(a, messages, opts = {}) {
  const key = (a.apiKey || '').trim();
  const base = (a.baseUrl || '').trim().replace(/\/+$/, '');
  if (!key) throw new Error('account has no API key');
  if (!base) throw new Error('account has no base URL');
  return a.cat === 'anthropic'
    ? anthropicChat(a, base, key, messages, opts)
    : openaiChat(a, base, key, messages, opts);
}

/* fan out ONE request per enabled account in parallel;
   first successful reply wins, losers get aborted */
function raceAccounts(accs, messages, opts = {}) {
  return new Promise((resolve, reject) => {
    const ctrl = new AbortController();
    const errors = [];
    let done = false;

    accs.forEach((a) => {
      const t0 = performance.now();
      runAccount(a, messages, { ...opts, signal: ctrl.signal })
        .then((text) => {
          if (done) return;
          done = true;
          LAST_RACE = {
            name: `${a.presetId}:${a.model}`,
            ms: Math.round(performance.now() - t0),
            raced: accs.length
          };
          ctrl.abort(); // cancel the losing requests
          resolve(text);
        })
        .catch((e) => {
          if (done) return;
          if (e?.name === 'AbortError') return;
          errors.push(`[${a.presetId}:${a.model}] ${String(e.message || e).slice(0, 90)}`);
          if (errors.length >= accs.length && !done) {
            done = true;
            LAST_RACE = null;
            reject(new Error(`All ${accs.length} accounts failed:\n` + errors.join('\n')));
          }
        });
    });
  });
}

/* OpenAI-compatible: OpenRouter / OpenAI / Groq / DeepSeek / Ollama / custom */
async function openaiChat(a, base, key, messages, opts) {
  const body = { model: a.model, messages };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;

  /* gateways differ: some serve /chat/completions at root, most under /v1 */
  const candidates = [`${base}/chat/completions`];
  if (!/\/v\d+\/?$/i.test(base)) candidates.push(`${base}/v1/chat/completions`);

  const init = {
    method: 'POST',
    signal: opts.signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
      'HTTP-Referer': 'https://github.com/ffcamp-extension',
      'X-Title': 'FFCamp Extension'
    },
    body: JSON.stringify(body)
  };

  let lastErr = null;
  for (const url of candidates) {
    let res;
    try {
      res = await fetch(url, init);
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      lastErr = e;
      continue;
    }
    if (res.ok) {
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('json')) {
        lastErr = new Error(`non-JSON response from ${url} — wrong path?`);
        continue;
      }
      const data = await res.json();
      LAST_URL = url;
      const content =
        data.choices?.[0]?.message?.content ??
        (Array.isArray(data.choices?.[0]?.message?.content)
          ? data.choices[0].message.content.map((c) => c.text || '').join('')
          : null);
      if (!content) throw new Error('Provider returned an empty response.');
      return sanitizeModelOutput(String(content).trim());
    }
    if (res.status === 401 || res.status === 403) throw await apiError(res, 'OpenAI-compatible');
    if (res.status === 404 || res.status === 405) {
      lastErr = new Error(`HTTP ${res.status} from ${url}`);
      continue;
    }
    throw await apiError(res, 'OpenAI-compatible');
  }
  throw lastErr || new Error('No working endpoint path found.');
}

/* Anthropic-compatible: Claude & anything speaking /messages */
async function anthropicChat(a, base, key, messages, opts) {
  const system = messages
    .filter((m) => m.role === 'system')
    .map((m) => m.content)
    .join('\n\n');
  const rest = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role, content: m.content }));

  const body = { model: a.model, max_tokens: opts.maxTokens ?? 8192, messages: rest };
  if (opts.temperature !== undefined) body.temperature = opts.temperature;
  if (system) body.system = system;

  const candidates = [`${base}/messages`];
  if (!/\/v\d+\/?$/i.test(base)) candidates.push(`${base}/v1/messages`);

  const init = {
    method: 'POST',
    signal: opts.signal,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(body)
  };

  let lastErr = null;
  for (const url of candidates) {
    let res;
    try {
      res = await fetch(url, init);
    } catch (e) {
      if (e?.name === 'AbortError') throw e;
      lastErr = e;
      continue;
    }
    if (res.ok) {
      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('json')) {
        lastErr = new Error(`non-JSON response from ${url} — wrong path?`);
        continue;
      }
      const data = await res.json();
      LAST_URL = url;
      const content = (data.content || [])
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('');
      if (!content) throw new Error('Provider returned an empty response.');
      return sanitizeModelOutput(content.trim());
    }
    if (res.status === 401 || res.status === 403) throw await apiError(res, 'Anthropic-compatible');
    if (res.status === 404 || res.status === 405) {
      lastErr = new Error(`HTTP ${res.status} from ${url}`);
      continue;
    }
    throw await apiError(res, 'Anthropic-compatible');
  }
  throw lastErr || new Error('No working endpoint path found.');
}

async function apiError(res, label) {
  const text = await res.text().catch(() => '');
  if (res.status === 401 || res.status === 403) {
    return new Error(
      `${label} ${res.status} - authentication failed. Check the API key ("${text.slice(0, 100)}").`
    );
  }
  return new Error(`${label} ${res.status}: ${text.slice(0, 300)}`);
}

async function testConnections() {
  const out = $('test-results');
  unhide(out);
  out.textContent = 'Testing...\n';
  setBusy($('btn-test'), true);
  const s = await getSettings();
  const lines = [];

  try {
    const accs = (s.accounts || []).filter(
      (a) => a.enabled !== false && (a.apiKey || '').trim() && (a.baseUrl || '').trim()
    );
    lines.push(`Accounts: ${accs.length} enabled (all race in parallel on real calls)`);

    /* ping each account, measure speed */
    const results = [];
    for (const a of accs) {
      const t0 = performance.now();
      try {
        const reply = await runAccount(a, [{ role: 'user', content: 'Reply with exactly: OK' }], {
          temperature: 0
        });
        results.push({ name: `${a.presetId}:${a.model}`, ms: Math.round(performance.now() - t0), ok: true, reply });
        lines.push(`  ⚡ ${a.presetId}:${a.model} → OK ${Math.round(performance.now() - t0)}ms`);
      } catch (e) {
        results.push({ name: `${a.presetId}:${a.model}`, ok: false });
        lines.push(`  ✖ ${a.presetId}:${a.model} → ${String(e.message).slice(0, 120)}`);
      }
    }
    const winner = results.filter((r) => r.ok).sort((x, y) => x.ms - y.ms)[0];
    if (winner) lines.push(`Fastest: 🏆 ${winner.name} (${winner.ms}ms) — races are won by whoever replies first`);

    lines.push('');
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
      func: (o) => window.__ffcampRun(o),
      args: [{ scroll: true }]
    });

    if (!result?.page?.text) {
      throw new Error(
        'Could not read this page. Reload the tab, then click the FFCamp icon once more and retry (browser pages like chrome:// are not readable).'
      );
    }

    const pageText = result.page.text.slice(0, MAX_PAGE_CHARS);

    /* MCQs found on the page -> embedded verbatim in Variation 1,
       formatted as REAL markdown so it stays human-readable */
    let mcqsSection = '';
    const qs = (result.mcqs ?? []).filter((q) => q.options?.length >= 2).slice(0, 30);
    if (qs.length) {
      const list = qs
        .map((q) => {
          const opts = q.options
            .map((o, i) => `- **${String.fromCharCode(65+i)}.** ${o}`)
            .join('\n');
          return `**Q${q.qid + 1}. ${q.text}**\n\n${opts}`;
        })
        .join('\n\n');
      mcqsSection = `\n\n### 📝 MCQs on this page\n\n${list}\n`;
    }

    currentTitle = result.page.title;
    currentUrl = result.page.url;

    /* Variation 1 - the ACTUAL scraped string, no AI.
       Headings demoted (+3 levels) so they nest under the document,
       and NO code fence -> renders as real formatted content. */
    const demoted = pageText.replace(/^(#{1,3})(\s)/gm, (_m, hashes, sp) => '#'.repeat(hashes.length + 3) + sp);
    const part1 = '## Original Content\n\n' + demoted + mcqsSection;

    const sourceMsg = `TITLE: ${result.page.title}\nURL: ${result.page.url}\n\nCONTENT:\n${pageText}`;

    showStatus($('sum-status'), null, 'AI is writing the study analysis...');
    const part2 = await askAI(
      [
        { role: 'system', content: ANALYSIS_SYSTEM },
        { role: 'user', content: sourceMsg }
      ],
      { temperature: 0.3 }
    );

    currentMarkdown =
      `# ${currentTitle}\n\n` +
      `> Source: ${result.page.url} · Saved ${new Date().toLocaleString()}\n\n` +
      `${part1}\n\n<!--FFCAMP-SPLIT-->\n\n${part2}\n`;

    const preview = $('md-preview');
    preview.textContent = currentMarkdown;
    unhide(preview);
    unhide($('sum-actions'));
    showStatus(
      $('sum-status'),
      'ok',
      'Done - raw content + AI analysis ready.' +
        (LAST_RACE ? ` ⚡ won by ${LAST_RACE.name} (${LAST_RACE.ms}ms of ${LAST_RACE.raced})` : '')
    );
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

    /* URL-mirrored path: docs/summaries/<course>/<lecture>/<slug>.md */
    const base = s.folder.replace(/^\/+|\/+$/g, '');
    const fromUrl = currentUrl ? urlToNotePath(currentUrl) : null;
    let dirPart = base;
    let fName;
    if (fromUrl) {
      if (fromUrl.dir) dirPart = `${base}/${fromUrl.dir}`;
      fName = `${fromUrl.file}.md`;
    } else {
      fName = `${fileName(currentTitle)}.md`;
    }
    const path = `${dirPart}/${fName}`;
    const altPath = `${dirPart}/${(fromUrl ? fromUrl.file : fileName(currentTitle))}-${Date.now()}.md`;
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
      res = await commit(altPath);
      if (res.ok) {
        showStatus($('sum-status'), 'ok', `Committed to ${s.repo} (${altPath}). ${pagesLink(s.repo, altPath)}`);
        return;
      }
    }

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(`GitHub ${res.status}: ${body.message ?? 'upload failed'}`);
    }
    showStatus($('sum-status'), 'ok', `Committed to ${s.repo} (${path}). ${pagesLink(s.repo, path)}`);
  } catch (err) {
    showStatus($('sum-status'), 'err', err.message);
  } finally {
    setBusy(el, false);
  }
}

function pagesLink(repo, path) {
  const [owner, repoName] = repo.split('/');
  return `Live: https://${owner}.github.io/${repoName}/?p=${encodeURIComponent(path)}`;
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
    showStatus($('mcq-status'), null, 'Scrolling & scanning page for MCQs...');

    const tab = await getActiveTab();
    if (!tab?.id) throw new Error('No active tab found.');

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });
    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (o) => window.__ffcampRun(o),
      args: [{ scroll: true }]
    });

    const qs = (result?.mcqs ?? []).filter((q) => q.options?.length >= 2);
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
  if (!el) return;
  showStatus(el, kind, msg);
  setTimeout(() => hide(el), 2500);
}

function hide(el) {
  if (el) el.hidden = true;
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

document.querySelectorAll('.ptab').forEach((tabBtn) => {
  tabBtn.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach((t) => t.classList.remove('active'));
    tabBtn.classList.add('active');
    const cat = tabBtn.dataset.cat;
    const first = PRESETS[cat][0];
    fillPresetSelect(cat, first.id);
  });
});
$('set-base-select').addEventListener('change', (e) => applyPreset(e.target.value));

$('btn-summarize').addEventListener('click', summarizePage);
$('btn-github').addEventListener('click', saveSummaryToGithub);
$('btn-download').addEventListener('click', downloadSummary);
$('btn-solve').addEventListener('click', solveMcq);
$('btn-autosolve').addEventListener('click', autoSolvePage);
$('btn-next').addEventListener('click', pressNextOnPage);
$('btn-save-acct').addEventListener('click', saveSettings);
$('btn-save-github').addEventListener('click', saveGithub);

/* ------- mini console (logs every live-test / save event) ------- */
function logLine(msg, kind = '') {
  const box = $('live-log');
  if (!box) return;
  const t = new Date().toLocaleTimeString();
  const row = document.createElement('div');
  if (kind) row.className = kind;
  row.textContent = `[${t}] ${msg}`;
  box.appendChild(row);
  while (box.childElementCount > 80) box.firstChild.remove();
  box.scrollTop = box.scrollHeight;
}

const maskKey = (k) => (k ? `${k.slice(0, 6)}…${k.slice(-4)} (${k.length})` : 'none');

/* live-test the form as typed (no save needed): "what is 2+2" */
$('btn-live-test').addEventListener('click', async () => {
  const acct = {
    id: 'live-test', enabled: true,
    cat: currentCat(),
    presetId: $('set-base-select').value,
    baseUrl: $('set-base').value.trim().replace(/\/+$/, ''),
    apiKey: $('set-prov-key').value.trim(),
    model: $('set-model').value.trim()
  };
  const box = $('live-log');
  box.hidden = false;

  if (!acct.baseUrl || !acct.model)
    return logLine('❌ TEST skipped — Base URL and Model are required.', 'err');
  if (!acct.apiKey && !/localhost|127\.0\.0\.1/.test(acct.baseUrl))
    return logLine('❌ TEST skipped — paste an API key first.', 'err');

  setBusy($('btn-live-test'), true);
  logLine(`⚡ TEST ${acct.cat} · preset "${acct.presetId}"`, 'info');
  logLine(`   url  : ${acct.baseUrl}/… (auto-trying /v1 when needed)`);
  logLine(`   model: ${acct.model} · key: ${maskKey(acct.apiKey)}`);

  const t0 = performance.now();
  try {
    const reply = await runAccount(
      acct,
      [{ role: 'user', content: 'What is 2+2? Reply with only the number, nothing else.' }],
      { temperature: 0 }
    );
    const ms = Math.round(performance.now() - t0);
    logLine(`   via  : ${LAST_URL || acct.baseUrl}`, 'info');
    if (/\b4\b/.test(reply)) {
      logLine(`✅ Working — replied "${reply.slice(0, 30)}" in ${ms}ms`, 'ok');
    } else {
      logLine(`⚠️ Responded (${ms}ms) but reply was: "${reply.slice(0, 60)}"`);
    }
  } catch (e) {
    logLine(`❌ Not working — ${String(e.message).slice(0, 200)}`, 'err');
  } finally {
    setBusy($('btn-live-test'), false);
  }
});
$('btn-test').addEventListener('click', testConnections);

getSettings().then(fillSettingsForm);
