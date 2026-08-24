(() => {
  try {
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

    const text = chunks.join('').replace(/\n{3,}/g, '\n\n').trim();

    window.__ffcampPageData = {
      title: document.title || location.hostname,
      url: location.href,
      text,
      extractedAt: new Date().toISOString()
    };
  } catch (e) {
    window.__ffcampPageData = null;
  }
})();
