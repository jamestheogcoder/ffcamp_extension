/* FFCamp content script.
   Injected via chrome.scripting; exposes window.__ffcampRun(opts).
   opts.scroll: auto-scroll the page first (loads lazy content), then
   extract readable text + detect MCQs, returning everything in one shot. */

(() => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const clean = (t) => String(t || "").replace(/\s+/g, " ").trim();

  /* ---------- readable text ---------- */
  function extract() {
    const BAD =
      'script,style,noscript,svg,canvas,iframe,nav,footer,header,aside,form,button,select,input,textarea,template,[aria-hidden="true"]';
    const root = document.body.cloneNode(true);
    root.querySelectorAll(BAD).forEach((n) => n.remove());

    const seen = new Set();
    const chunks = [];
    root.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,pre,blockquote,td').forEach((el) => {
      const txt = el.textContent.replace(/\s+/g, " ").trim();
      if (!txt || txt.length < 3 || seen.has(txt)) return;
      seen.add(txt);
      const tag = el.tagName.toLowerCase();
      if (tag[0] === "h") chunks.push("\n\n" + "#".repeat(+tag[1]) + " " + txt);
      else if (tag === "li") chunks.push("\n- " + txt);
      else chunks.push("\n\n" + txt);
    });

    return {
      title: document.title || location.hostname,
      url: location.href,
      text: chunks
        .join("")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/([a-zA-Z0-9\.\?!])\s+(?=[A-D]\)\s)/g, "$1\n") // break inline A) B) C) D) runs
        .replace(/([a-zA-Z0-9\.\?!])\s+(?=\d+\.\s[A-Z])/g, "$1\n") // break glued numbered questions
        .trim()
    };
  }

  /* ---------- MCQ detection ---------- */
  function detectMcqs() {
    const visible = (el) => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
    const questions = [];
    const tag = (el, q, c) => {
      el.setAttribute("data-ffcamp-q", String(q));
      el.setAttribute("data-ffcamp-c", String(c));
    };

    const optionText = (el) => {
      if (el.tagName === "INPUT") {
        let l = el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null;
        if (!l) l = el.closest("label");
        if (!l && el.parentElement && el.parentElement.tagName === "LABEL") l = el.parentElement;
        if (!l && el.nextElementSibling && !el.nextElementSibling.querySelector("input")) l = el.nextElementSibling;
        return clean(l ? l.textContent : "") || clean(el.value);
      }
      return clean(el.getAttribute("aria-label") || el.textContent);
    };

    const questionText = (scope, optEls) => {
      const cand = scope.querySelector('legend,[class*="question" i],[class*="Question"],h1,h2,h3,h4,h5,h6');
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
      return "";
    };

    const clickables = [
      ...document.querySelectorAll('input[type="radio"],input[type="checkbox"],[role="radio"],[role="checkbox"]')
    ].filter(visible);

    const scopes = new Map();
    for (const el of clickables) {
      const scope =
        el.closest("fieldset,[role=radiogroup],[role=group]") ||
        (el.tagName === "INPUT" ? el.closest("form") : el.closest("[role=listitem],li")) ||
        document.body;
      const key = el.getAttribute("name") || "__grp__";
      let byKey = scopes.get(scope);
      if (!byKey) { byKey = new Map(); scopes.set(scope, byKey); }
      let arr = byKey.get(key);
      if (!arr) { arr = []; byKey.set(key, arr); }
      arr.push(el);
    }

    for (const [scope, byKey] of scopes) {
      for (const [, els] of byKey) {
        if (els.length < 2 || els.length > 10) continue;
        if (scope === document.body && els.some((e) => !e.getAttribute("name"))) continue;
        const opts = els.map(optionText);
        if (opts.some((t) => !t)) continue;
        const qText = questionText(scope, els);
        if (!qText || qText.length < 8) continue;
        const qid = questions.length;
        els.forEach((el, i) => tag(el, qid, i));
        questions.push({ qid, text: qText, options: opts });
      }
    }

    if (questions.length === 0) {
      const blocks = (document.body.innerText || "").split(/\n(?=\d+[.)]\s)/g);
      const re = /^([A-H])[\).\]]\s*(.+)$/i;
      for (const block of blocks) {
        const lines = block.split("\n").map(clean).filter(Boolean);
        if (lines.length < 3) continue;
        const stem = lines[0].replace(/^\d+[.)]\s*/, "");
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
    return questions.slice(0, 30);
  }

  /* ---------- entry point ---------- */
  window.__ffcampRun = async function ({ scroll = true } = {}) {
    if (scroll) {
      const startY = window.scrollY;
      const doc = document.documentElement;
      const step = () => Math.round(window.innerHeight * 0.9);
      for (let i = 0; i < 50; i++) {
        window.scrollBy({ top: step(), behavior: "instant" });
        await sleep(90);
        if (window.scrollY + window.innerHeight >= doc.scrollHeight - 4) break;
      }
      await sleep(120); // let lazy content settle
      window.scrollTo({ top: startY, behavior: "instant" });
    }

    let page = { title: document.title || location.hostname, url: location.href, text: "" };
    try { page = extract(); } catch (e) {}
    let mcqs = [];
    try { mcqs = detectMcqs(); } catch (e) {}

    return { page, mcqs };
  };

  /* ---------- FCC-style sidebar: completed vs incomplete blocks ---------- */
  window.__ffcampSidebar = function () {
    const headers = [
      ...document.querySelectorAll(
        'button[data-playwright-test-label="block-header-button"], button.block-header'
      )
    ];
    return headers.map((h) => {
      const passed = !!h.querySelector('[data-testid="green-pass"]');
      const notPassed = !!h.querySelector('[data-testid="green-not-completed"]');
      const sr = h.querySelector(".sr-only");
      const srText = sr ? clean(sr.textContent).toLowerCase() : "";
      const pct = srText.match(/(\d+)%\s*completed/);
      let status;
      if (passed) status = "completed";
      else if (pct) status = +pct[1] >= 100 ? "completed" : "incomplete";
      else if (notPassed) status = "incomplete";
      else if (srText.includes(", completed")) status = "completed";
      else status = "unknown";

      const spans = [...h.querySelectorAll("span")].filter((s) => !s.classList.contains("sr-only"));
      const last = spans[spans.length - 1];
      const title =
        clean(last && last.firstChild ? last.firstChild.textContent : "") ||
        clean(h.textContent).slice(0, 60);

      return {
        title,
        status,
        expanded: h.getAttribute("aria-expanded") === "true",
        panelId: h.getAttribute("aria-controls")
      };
    });
  };

  /* expand the first incomplete block and navigate into its first lesson */
  window.__ffcampOpenFirstIncomplete = function () {
    const items = window.__ffcampSidebar();
    const target = items.find((i) => i.status === "incomplete");
    if (!target) return { done: true, reason: "all completed" };

    const headers = [
      ...document.querySelectorAll(
        'button[data-playwright-test-label="block-header-button"], button.block-header'
      )
    ];
    const h = headers.find((x) => x.getAttribute("aria-controls") === target.panelId);
    if (!h) return { done: true, reason: "header vanished" };

    if (h.getAttribute("aria-expanded") !== "true") h.click();

    const res = { done: false, opened: target.title, navigatedTo: null };
    const panel = target.panelId ? document.getElementById(target.panelId) : null;
    const link =
      (panel && panel.querySelector('a[href]')) ||
      document.querySelector(`a[href*="${(target.panelId || "").replace("-panel", "")}"]`);

    if (link && link.href && link.href !== location.href) {
      const href = link.href;
      res.navigatedTo = href;
      setTimeout(() => window.location.assign(href), 350);
    }
    return res;
  };

  /* ---------- workshop / lab pages (code editor + Check Your Code) ------- */

  function findCheckBtn() {
    return [...document.querySelectorAll("button")]
      .filter((b) => b.getClientRects().length > 0)
      .find((b) => /check\s*(your\s*)?\s*code/i.test(clean(b.textContent)));
  }

  function workshopInstructions() {
    const sels = [
      "#description",
      "[data-playwright-test-label='task-description']",
      ".lab-description",
      ".instructions",
      "article",
      "main"
    ];
    for (const s of sels) {
      for (const el of document.querySelectorAll(s)) {
        const t = (el.innerText || "").trim();
        if (t.length > 60 && !el.querySelector(".cm-editor")) return t.slice(0, 9000);
      }
    }
    return clean(document.body.innerText).slice(0, 8000);
  }

  window.__ffcampWorkshop = function () {
    const checkBtn = findCheckBtn();
    if (!checkBtn) return { isWorkshop: false };
    return {
      isWorkshop: true,
      hasCheckBtn: true,
      instructions: workshopInstructions(),
      title: document.title || location.href
    };
  };

  /* write code into whichever editor exists (textarea / CM6 / Monaco) */
  window.__ffcampFillCode = function (code) {
    // 1) plain textarea
    const ta = [...document.querySelectorAll("textarea")].find(
      (t) => t.getClientRects().length > 0
    );
    if (ta) {
      ta.focus();
      ta.value = code;
      ta.dispatchEvent(new Event("input", { bubbles: true }));
      ta.dispatchEvent(new Event("change", { bubbles: true }));
      return { filled: true, kind: "textarea" };
    }

    // 2) CodeMirror 6 (.cm-content contenteditable)
    const cm = document.querySelector(".cm-content[contenteditable='true']");
    if (cm) {
      cm.focus();
      document.execCommand("selectAll", false, null);
      document.execCommand("insertText", false, code);
      return { filled: true, kind: "codemirror" };
    }

    // 3) Monaco
    if (window.monaco?.editor) {
      const model = window.monaco.editor.getModels()[0];
      if (model) {
        model.setValue(code);
        return { filled: true, kind: "monaco" };
      }
    }

    return { filled: false };
  };

  window.__ffcampClickCheck = function () {
    const b = findCheckBtn();
    if (!b) return { clicked: false };
    if (b.scrollIntoView) b.scrollIntoView({ behavior: 'smooth', block: 'center' });
    b.click();
    return { clicked: true };
  };

  /* ---------- donation / interruption popups ---------- */
  window.__ffcampDonation = function (shouldClick) {
    const btns = [...document.querySelectorAll("button")].filter(
      (b) => b.getClientRects().length > 0
    );
    const t =
      btns.find((b) => /ask\s*me\s*later/i.test(clean(b.textContent))) ||
      btns.find((b) => /^remind\s*me\s*later$/i.test(clean(b.textContent)));
    if (!t) return { found: false };
    if (!shouldClick) return { found: true };
    if (t.scrollIntoView) t.scrollIntoView({ block: "center" });
    t.click();
    return { found: true, clicked: true };
  };
})();
