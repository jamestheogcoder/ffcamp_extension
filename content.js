/* FFCamp content script: page extraction + MCQ detection + answer applying.
   Injected on demand via chrome.scripting. Sets window.__ffcamp* globals. */

(() => {
  try {
    /* ================= 1) readable page text (for Summarize) ============== */
    const BAD =
      'script,style,noscript,svg,canvas,iframe,nav,footer,header,aside,form,button,select,input,textarea,template,[aria-hidden="true"]';
    const root = document.body.cloneNode(true);
    root.querySelectorAll(BAD).forEach((n) => n.remove());

    const seen = new Set();
    const chunks = [];
    root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,pre,blockquote,td').forEach((el) => {
      const txt = el.textContent.replace(/\s+/g, ' ').trim();
      if (!txt || txt.length < 3 || seen.has(txt)) return;
      seen.add(txt);
      const tag = el.tagName.toLowerCase();
      if (tag[0] === 'h') chunks.push('\n\n' + '#'.repeat(+tag[1]) + ' ' + txt);
      else if (tag === 'li') chunks.push('\n- ' + txt);
      else chunks.push('\n\n' + txt);
    });

    window.__ffcampPageData = {
      title: document.title || location.hostname,
      url: location.href,
      text: chunks.join('').replace(/\n{3,}/g, '\n\n').trim(),
      extractedAt: new Date().toISOString()
    };

    /* ===================== 2) MCQ auto-detection ========================== */

    const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
    const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);

    const questions = [];
    const tag = (el, q, c) => {
      el.setAttribute('data-ffcamp-q', String(q));
      el.setAttribute('data-ffcamp-c', String(c));
    };

    /* --- option text for an input/role element --- */
    const optionText = (el) => {
      if (el.tagName === 'INPUT') {
        let l = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
        if (!l) l = el.closest('label');
        if (!l && el.parentElement && el.parentElement.tagName === 'LABEL') l = el.parentElement;
        if (!l && el.nextElementSibling && !el.nextElementSibling.querySelector('input')) l = el.nextElementSibling;
        return clean(l ? l.textContent : '') || clean(el.value);
      }
      return clean(el.getAttribute('aria-label') || el.textContent);
    };

    /* --- question text near a scope --- */
    const questionText = (scope, optEls) => {
      const cand = scope.querySelector(
        'legend,[class*="question" i],[class*="Question"],h1,h2,h3,h4,h5,h6'
      );
      if (cand && !optEls.some((o) => cand.contains(o))) return clean(cand.textContent).slice(0, 400);

      if (scope !== document.body) {
        const clone = scope.cloneNode(true);
        clone.querySelectorAll('input,[role=radio],[role=checkbox]').forEach((n) => n.remove());
        const t = clean(clone.textContent);
        if (t.length >= 8) return t.slice(0, 400);
      }

      let p = scope.previousElementSibling;
      for (let guard = 0; p && guard < 4; guard++) {
        const pt = clean(p.textContent);
        if (pt.length >= 8) return pt.slice(0, 400);
        p = p.previousElementSibling;
      }
      return '';
    };

    /* --- group clickable options and build questions --- */
    const clickables = [
      ...document.querySelectorAll(
        'input[type="radio"],input[type="checkbox"],[role="radio"],[role="checkbox"]'
      )
    ].filter(visible);

    const scopes = new Map(); // scopeEl -> Map(key -> els[])
    for (const el of clickables) {
      const scope =
        el.closest('fieldset,[role=radiogroup],[role=group]') ||
        (el.tagName === 'INPUT' ? el.closest('form') : el.closest('[role=listitem],li')) ||
        document.body;
      const key = el.getAttribute('name') || '__grp__';
      let byKey = scopes.get(scope);
      if (!byKey) {
        byKey = new Map();
        scopes.set(scope, byKey);
      }
      let arr = byKey.get(key);
      if (!arr) {
        arr = [];
        byKey.set(key, arr);
      }
      arr.push(el);
    }

    for (const [scope, byKey] of scopes) {
      for (const [, els] of byKey) {
        if (els.length < 2 || els.length > 10) continue;

        // split body-level anonymous groups that actually contain several questions
        // (heuristic: inputs sharing a name are one question; role-based in body may mix,
        //  so only accept body-scope groups when every element has a name)
        if (scope === document.body && els.some((e) => !e.getAttribute('name'))) continue;

        const opts = els.map(optionText);
        if (opts.some((t) => !t)) continue;

        const qText = questionText(scope, els);
        if (!qText || qText.length < 8) continue;

        const qid = questions.length;
        els.forEach((el, i) => tag(el, qid, i));
        questions.push({ qid, text: qText, options: opts });
      }
    }

    /* --- text-only fallback: "1. Question?\nA) ..\nB) .." patterns --- */
    if (questions.length === 0) {
      const txt = document.body.innerText || '';
      const blocks = txt.split(/\n(?=\d+[.)]\s)/g);
      const re = /^([A-H])[\).\]]\s*(.+)$/i;
      for (const block of blocks) {
        const lines = block.split('\n').map(clean).filter(Boolean);
        if (lines.length < 3) continue;
        const stem = lines[0].replace(/^\d+[.)]\s*/, '');
        const opts = [];
        for (const line of lines.slice(1)) {
          const m = re.exec(line);
          if (m) opts[m[1].toUpperCase().charCodeAt(0) - 65] = m[2];
          else break;
        }
        if (stem.length >= 8 && opts.filter(Boolean).length >= 2) {
          questions.push({ qid: questions.length, text: stem.slice(0, 400), options: opts });
        }
        if (questions.length >= 30) break;
      }
    }
    if (questions.length > 30) questions.length = 30;

    window.__ffcampMcqData = {
      url: location.href,
      title: document.title || location.hostname,
      detectedAt: new Date().toISOString(),
      questions
    };
  } catch (e) {
    window.__ffcampMcqData = { error: String(e), questions: [] };
  }
})();
