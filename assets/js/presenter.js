/* Presenter view: notes, cues and timers. Talks to the audience deck through
   a BroadcastChannel, so both windows must be open from the same site. */
(function () {
  'use strict';
  const D = window.DECK_DATA;
  const F = window.DeckFlow;
  const SLIDES = F.buildSlides();
  const TIMING = F.timingReport(SLIDES);
  const main = SLIDES.filter((s) => !s.appendix);
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const QCOL = { tl: 'var(--tl)', tr: 'var(--tr)', bl: 'var(--bl)', br: 'var(--br)' };

  const KEY = 'g4w8-presenter-timer';
  let T = { running: false, session: 0, perSlide: {}, last: 0 };
  try { const saved = JSON.parse(localStorage.getItem(KEY) || 'null'); if (saved) T = Object.assign(T, saved, { running: false }); } catch (e) { /* storage unavailable: timers still work for this window */ }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(T)); } catch (e) { /* ignore */ } };

  let cur = 0;
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('g4-week8-deck') : null;

  /* timing check */
  $('timing').innerHTML = TIMING.ok
    ? `<div class="okbox">Main flow totals exactly ${F.fmt(TIMING.total)}; every segment matches its budget.</div>`
    : `<div class="warnbox">${TIMING.problems.map(esc).join('<br>')}</div>`;

  /* run sheet */
  $('sheet').innerHTML = SLIDES.map((s, k) => `<li><button data-k="${k}" class="${s.appendix ? 'appx' : ''}" style="--q:${QCOL[s.quadrant] || '#44506E'}">
      <span class="t">${s.appendix ? 'appx' : F.fmt(s.startsAt)}</span><span>${esc(s.title || s.id)}</span><span class="t">${s.seconds ? F.fmt(s.seconds) : ''}</span></button></li>`).join('');
  $('sheet').addEventListener('click', (e) => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const k = Number(b.dataset.k);
    if (chan) chan.postMessage({ type: 'nav', action: 'go', i: k });
    show(k);
  });

  function show(k) {
    cur = k;
    const s = SLIDES[k];
    const pos = s.appendix ? 'Appendix' : `Slide ${k + 1} of ${main.length}`;
    $('cur-pos').textContent = `${pos} · ${s.segLabel || ''}${s.appendix ? '' : ' · planned start ' + F.fmt(s.startsAt)}`;
    $('cur-title').textContent = s.title || s.id;
    $('cur-who').textContent = s.presenter ? `Presenter: ${s.presenter}` : '';
    $('cur-notes').textContent = s.notes || '—';
    $('cur-cue').textContent = s.cue || '';
    $('cur-cue').style.display = s.cue ? '' : 'none';
    const n = SLIDES[k + 1];
    $('next-title').textContent = n ? n.title || n.id : 'End of deck';
    document.querySelectorAll('#sheet button').forEach((b) => b.classList.toggle('cur', Number(b.dataset.k) === k));
    const curBtn = document.querySelector('#sheet button.cur');
    if (curBtn) curBtn.scrollIntoView({ block: 'nearest' });
    render();
  }

  function render() {
    const s = SLIDES[cur];
    $('session').innerHTML = `${F.fmt(T.session)}<small>/ ${F.fmt(D.meta.sessionSeconds)}</small>`;
    const spent = T.perSlide[s.id] || 0;
    $('slide-time').textContent = `${F.fmt(spent)} on this slide`;
    $('slide-budget').textContent = s.seconds ? `budget ${F.fmt(s.seconds)}` : 'not timed';
    setBar($('slide-bar'), s.seconds ? spent / s.seconds : 0);

    const seg = D.flow.find((x) => x.id === s.segId);
    if (seg) {
      const segSpent = main.filter((x) => x.segId === seg.id).reduce((n, x) => n + (T.perSlide[x.id] || 0), 0);
      $('seg-name').textContent = seg.label + (seg.agent ? ` · ${SLIDES.find((x) => x.segId === seg.id).presenter || ''}` : '');
      $('seg-time').textContent = `${F.fmt(segSpent)} used`;
      $('seg-budget').textContent = `budget ${F.fmt(seg.seconds)}`;
      setBar($('seg-bar'), segSpent / seg.seconds);
    } else {
      $('seg-name').textContent = 'Appendix (questions)';
      $('seg-time').textContent = ''; $('seg-budget').textContent = '';
      setBar($('seg-bar'), 0);
    }

    const d = $('drift');
    if (!T.session) { d.textContent = 'Not started'; d.className = 'drift'; }
    else if (s.appendix) { d.textContent = `Q&A · ${F.fmt(T.session - D.meta.sessionSeconds)} past 20:00`; d.className = 'drift'; }
    else {
      const drift = T.session - (s.startsAt + Math.min(spent, s.seconds));
      const abs = F.fmt(Math.abs(drift));
      d.textContent = Math.abs(drift) < 5 ? 'On plan' : drift > 0 ? `${abs} behind plan` : `${abs} ahead of plan`;
      d.className = 'drift ' + (drift > 30 ? 'late' : drift > 5 ? 'behind' : 'ahead');
    }
    $('startstop').textContent = T.running ? 'Pause timer' : T.session ? 'Resume timer' : 'Start timer';
  }

  function setBar(el, ratio) {
    el.style.width = Math.min(100, ratio * 100) + '%';
    el.className = ratio > 1 ? 'bad' : ratio > 0.85 ? 'warn' : '';
  }

  /* timers tick only while running */
  setInterval(() => {
    if (!T.running) return;
    const now = Date.now();
    const dt = (now - T.last) / 1000;
    T.last = now;
    T.session += dt;
    const id = SLIDES[cur].id;
    T.perSlide[id] = (T.perSlide[id] || 0) + dt;
    render();
    save();
  }, 250);

  function toggle() {
    T.running = !T.running;
    T.last = Date.now();
    render(); save();
  }
  $('startstop').addEventListener('click', toggle);
  $('reset').addEventListener('click', () => {
    if (!confirm('Reset all timers to 0:00?')) return;
    T = { running: false, session: 0, perSlide: {}, last: 0 };
    render(); save();
  });

  const nav = (action) => {
    if (chan) chan.postMessage({ type: 'nav', action });
    else show(Math.max(0, Math.min(SLIDES.length - 1, cur + (action === 'next' ? 1 : -1))));
  };
  $('next').addEventListener('click', () => nav('next'));
  $('prev').addEventListener('click', () => nav('prev'));
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && e.target === document.body)) { e.preventDefault(); nav('next'); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); nav('prev'); }
    else if (e.key === 's' || e.key === 'S') toggle();
  });

  let stepInfo = '';
  if (chan) {
    chan.onmessage = (e) => {
      const m = e.data || {};
      if (m.type !== 'state') return;
      $('sync').textContent = 'Synced with the deck window';
      $('sync').className = 'sync on';
      stepInfo = m.steps ? ` · step ${m.step + 1} of ${m.steps + 1}` : '';
      if (m.i !== cur) show(m.i); else render();
      $('cur-pos').textContent = $('cur-pos').textContent.replace(/ · step \d+ of \d+$/, '') + stepInfo;
    };
    chan.postMessage({ type: 'hello' });
  } else {
    $('sync').textContent = 'This browser cannot sync windows; use Back/Next here and in the deck.';
  }

  const start = SLIDES.findIndex((s) => s.id === location.hash.slice(1));
  show(start >= 0 ? start : 0);
})();
