/* Group 4 · Week 8 deck engine.
   Renders every slide from content/deck-data.js, then handles navigation,
   step-by-step reveals, the zooming map, evidence enlargement and presenter sync.
   Content changes belong in content/deck-data.js, not here. */
(function () {
  'use strict';

  const D = window.DECK_DATA;
  const F = window.DeckFlow;
  if (!D || !F) {
    document.getElementById('stage').innerHTML = '<p style="color:#fff;font:24px sans-serif;padding:48px">The deck content (content/deck-data.js) did not load. Check the browser console for a syntax error in that file.</p>';
    return;
  }

  const SLIDES = F.buildSlides();
  const TIMING = F.timingReport(SLIDES);
  const AG = {};
  D.agents.forEach((a) => { AG[a.id] = a; });
  const QS = D.quadrants;
  const AX = D.axes;
  const ORDER = ['tl', 'tr', 'bl', 'br'];
  const byQ = (q) => D.agents.find((a) => a.quadrant === q);

  /* ----------------------------------------------------------- helpers */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isTBC = F.isTBC;
  const tbc = (m) => `<span class="tbc"><b>TBC</b>${esc(m)}</span>`;
  /* *word* in a heading becomes the italic accent, as on the group site */
  const md = (s) => esc(s).replace(/\*(.+?)\*/g, '<em>$1</em>');
  const plainText = (s) => String(s).replace(/\*/g, '');
  const pad2 = (n) => String(n).padStart(2, '0');

  /* Simple line drawings that hint at each agent's business scene.
     An agent can use one with `motif: "receipt" | "chat" | "calendar" | "plane"`. */
  const MOTIFS = {
    receipt: '<path d="M26 8h48v84l-8-6-8 6-8-6-8 6-8-6-8 6z"/><path d="M36 26h28M36 38h28M36 50h18M36 66h28"/><circle cx="64" cy="66" r="0.5"/>',
    chat: '<path d="M10 16h52a6 6 0 0 1 6 6v26a6 6 0 0 1-6 6H34l-14 12V54H10a6 6 0 0 1-6-6V22a6 6 0 0 1 6-6z"/><path d="M74 38h14a6 6 0 0 1 6 6v22a6 6 0 0 1-6 6h-6v12L70 72H52a6 6 0 0 1-6-6v-4"/><path d="M18 30h36M18 40h24"/>',
    calendar: '<rect x="10" y="18" width="80" height="72" rx="6"/><path d="M10 36h80M30 10v16M70 10v16"/><path d="M22 50h10M45 50h10M68 50h10M22 64h10M45 64h10M68 64h10M22 78h10M45 78h10"/>',
    plane: '<path d="M8 58l30-6 22-30 8 2-12 28 26-4 8-10 6 2-4 16 4 16-6 2-8-10-26-4 12 28-8 2-22-30-30-6z"/>'
  };
  const motif = (name) => (MOTIFS[name] ? `<svg class="motif" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MOTIFS[name]}</svg>` : '');
  function t(s) {
    if (s == null || s === '') return tbc('not supplied');
    if (isTBC(s)) return tbc(String(s).replace(/^\s*TBC:?\s*/, '') || 'to confirm');
    return esc(s);
  }
  function hasTBC(v) {
    if (v == null) return false;
    if (typeof v === 'string') return isTBC(v);
    if (Array.isArray(v)) return v.some(hasTBC);
    if (typeof v === 'object') return Object.values(v).some(hasTBC);
    return false;
  }
  const ans = (axis, v) => (v === 'yes' ? AX[axis].yes : AX[axis].no);
  const yn = (v) => (v === 'yes' ? 'Yes' : 'No');
  const nameOf = (a) => a.shortName || a.name;
  const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const quadrantFor = (q1, q2) => ORDER.find((q) => QS[q].q1 === q1 && QS[q].q2 === q2);
  const mismatch = (a) => quadrantFor(a.placement.q1.answer, a.placement.q2.answer) !== a.quadrant;
  const mismatchChip = (a) => (mismatch(a) ? ' ' + tbc('these answers point to a different quadrant') : '');

  function mini(on, to) {
    return `<div class="mini" aria-hidden="true">${ORDER.map((q) => {
      const cls = [q === on ? 'on' : '', q === to ? 'to' : ''].join(' ');
      return `<span data-q="${q}" class="${cls}" style="--qto:var(--${q})"></span>`;
    }).join('')}</div>`;
  }

  const chips = (a) => `<div class="chips">
      <span class="chip">Right answer? <b>${yn(a.placement.q1.answer)}</b></span>
      <span class="chip">Must work together? <b>${yn(a.placement.q2.answer)}</b></span></div>`;

  function head(eyebrow, title, right) {
    return `<header class="head"><div class="titles"><p class="eyebrow">${esc(eyebrow)}</p><h2>${md(title)}</h2></div>${right || ''}</header>`;
  }

  /* Header for the agent's inner slides: quadrant, agent, presenter, then a big title. */
  function agentHead(a, title) {
    const q = QS[a.quadrant];
    return `<header class="head"><div class="titles">
        <div class="who-line"><span class="qchip" data-q="${a.quadrant}">${esc(q.title)}</span>&ensp;·&ensp;<b>${esc(nameOf(a))}</b>&ensp;·&ensp;${t(a.presenter)}</div>
        <h2>${md(title)}</h2></div>
        <div class="head-right">${mini(a.quadrant)}</div></header>`;
  }

  /* ----------------------------------------------------------- evidence */
  const EV = [];
  /* Markers: a see-through ring around the target, and a small numbered tag
     beside it (side: "right" by default, or "left"), so nothing is covered. */
  const pinHTML = (pins) => (pins || []).map((p) => `<span class="pin p-${p.side === 'left' ? 'left' : 'right'}${p.ring === false ? ' no-ring' : ''}" style="left:${p.x}%;top:${p.y}%"><i class="ring"></i><b class="tag">${esc(p.n)}</b></span>`).join('');
  function ev(item, label, num, opts) {
    item = item || { src: null, caption: '', missing: 'Not supplied' };
    const lab = label ? `<div class="ev-label">${num ? `<span class="num">${num}</span>` : ''}${esc(label)}</div>` : '';
    const cap = item.caption && !label ? `<figcaption>${t(item.caption)}</figcaption>` : '';
    if (!item.src) {
      return `<figure class="ev">${lab}<div class="ev-frame"><div class="ev-missing"><span class="t">Screenshot goes here</span><span class="d">${esc(item.missing || 'Screenshot not supplied')}</span></div></div>${cap}</figure>`;
    }
    const id = EV.push(item) - 1;
    const pins = pinHTML(item.pins);
    const notes = (item.pins || []).length && !(opts && opts.noNotes) ? `<ul class="pin-notes">${item.pins.map((p) => `<li><b>${esc(p.n)}</b> ${esc(p.text || '')}</li>`).join('')}</ul>` : '';
    return `<figure class="ev">${lab}<button class="ev-frame" data-ev="${id}" aria-label="Enlarge: ${esc(item.alt || item.caption || 'evidence')}">
      <div class="ev-inner" data-focus="${esc(item.focus || '50% 0%')}" data-zoom="${Number(item.zoom) || 1}" style="position:absolute;left:0;top:0;width:100%;transform-origin:0 0">
        <img src="${esc(item.src)}" alt="${esc(item.alt || item.caption || '')}" style="display:block;width:100%;height:auto">${pins}</div>
      <span class="zoom-hint no-print">Click to enlarge</span></button>${cap}${notes}</figure>`;
  }

  /* Crop/zoom a screenshot so its focus point sits in the frame centre. */
  function layoutEvidence(root) {
    root.querySelectorAll('.ev-inner').forEach((inner) => {
      const img = inner.querySelector('img');
      const frame = inner.parentElement;
      const apply = () => {
        if (!img.naturalWidth) return;
        const fw = frame.offsetWidth, fh = frame.offsetHeight;
        const iw = fw, ih = fw * img.naturalHeight / img.naturalWidth;
        const zoom = Number(inner.dataset.zoom) || 1;
        const [fx, fy] = (inner.dataset.focus || '50% 0%').split(/\s+/).map((v) => parseFloat(v) / 100);
        const s = Math.min(1, fh / ih) * zoom;
        const place = (size, frameSize, f) => {
          if (size * s <= frameSize) return (frameSize - size * s) / 2;
          return Math.min(0, Math.max(frameSize - size * s, frameSize / 2 - f * size * s));
        };
        inner.style.transform = `translate(${place(iw, fw, fx)}px, ${place(ih, fh, fy)}px) scale(${s})`;
        inner.querySelectorAll('.pin').forEach((p) => { p.style.transform = `scale(${1 / s})`; });
      };
      if (img.complete) apply(); else img.addEventListener('load', apply, { once: true });
    });
  }

  /* --------------------------------------------------------------- map */
  function qmapHTML(mode) {
    const cell = (q) => {
      const a = byQ(q);
      const Qd = QS[q];
      if (!a) return `<div class="qcell" data-q="${q}"><span class="qt">${esc(Qd.title)}</span>${tbc('no agent placed here yet')}</div>`;
      const num = `<span class="num" aria-hidden="true">${pad2(ORDER.indexOf(q) + 1)}</span>`;
      const tag = `<span class="tag">${Qd.q1 === 'yes' ? 'Right answer' : 'No single answer'} · ${Qd.q2 === 'yes' ? 'Work together' : 'Either alone'}</span>`;
      const basics = `${num}${tag}<span class="qt">${esc(Qd.title)}</span><span class="an">${esc(nameOf(a))}</span><span class="dm">${t(a.domain)} · ${t(a.presenter)}</span>`;
      if (mode === 'compare') {
        return `<div class="qcell" data-q="${q}">${num}<span class="qt">${esc(Qd.title)}</span><span class="an">${esc(nameOf(a))}</span>
          <span class="role"><b>The person</b> ${esc(lc(Qd.role))}</span></div>`;
      }
      return `<div class="qcell" data-q="${q}" data-focus-q="${q}" role="button" tabindex="0" aria-label="Zoom into ${esc(Qd.title)}: ${esc(nameOf(a))}">${basics}
        <span class="hint no-print">Click to zoom in</span>
        <div class="more">
          <div class="wide"><div class="k">The job</div><div class="v">${t(a.oneLiner)}</div></div>
          <div><div class="k">The person</div><div class="v">${esc(Qd.role)}</div></div>
          <div><div class="k">Our answers</div><div class="v">Right answer? <b>${yn(a.placement.q1.answer)}</b><br>Must work together? <b>${yn(a.placement.q2.answer)}</b>${mismatchChip(a)}</div></div>
          <div class="wide btn-row"><button class="btn" data-unfocus>← Back to the map</button><button class="btn solid" data-goto="${a.id}-intro">Go to this agent →</button></div>
        </div></div>`;
    };
    const xh = (v) => `<div class="xh"><span class="ax">Q1 · ${yn(v)}</span><span class="av">${esc(ans('q1', v))}</span></div>`;
    const yh = (v) => `<div class="yh"><span class="ax">Q2 · ${yn(v)}</span><span class="av">${esc(ans('q2', v))}</span></div>`;
    return `<div class="qmap"${mode === 'interactive' ? ' data-map' : ''}>
      <div class="corner">Q1 across<br>Q2 down</div>${xh('yes')}${xh('no')}
      ${yh('yes')}${cell('tl')}${cell('tr')}
      ${yh('no')}${cell('bl')}${cell('br')}
    </div>`;
  }

  /* ---------------------------------------------------------- renderers */
  const R = {};

  const glyph = (size) => `<div class="glyph" aria-hidden="true"${size ? ` style="width:${size}px;height:${size}px"` : ''}>${ORDER.map((q, k) => `<span style="background:var(--${q}-soft);color:var(--${q})"><b>${pad2(k + 1)}</b></span>`).join('')}</div>`;

  R.title = () => ({
    cls: 's-title',
    html: `<p class="eyebrow">${esc(D.meta.course)} · ${esc(D.meta.date)}</p>
      <div><h1>${md(D.meta.title)}</h1><p class="lead">${esc(D.meta.subtitle)}</p></div>
      <div class="foot"><div class="members"><span class="member group">${esc(D.meta.group)}</span>${D.members.map((m) => `<span class="member">${esc(m.name)}</span>`).join('')}</div>
      ${glyph()}</div>`
  });

  R.axes = () => ({
    html: `${head('Before the agents', 'Two questions place *every* agent')}
      <div class="axes">${['q1', 'q2'].map((k, i) => `
        <div class="axis"><span class="num">Question ${i + 1}</span><h3>${esc(AX[k].question)}</h3>
          <div class="answers2"><div><div class="yn">Yes</div><div class="v">${esc(AX[k].yes)}</div></div><div><div class="yn">No</div><div class="v">${esc(AX[k].no)}</div></div></div>
          <p class="body">${i === 0 ? 'Decides the person’s task: <b>verify</b> an answer, or <b>judge</b> between good options.' : 'Decides where the person stands: <b>inside</b> the work, or <b>outside</b> it.'}</p>
        </div>`).join('')}</div>
      <p class="trapline">A person checking the output does not, by itself, mean they must work together.</p>`
  });

  R.map = () => ({
    html: `${head('Four agents, one map', 'Our four agents, *one* per quadrant')}${qmapHTML('interactive')}`
  });

  /* 1 · the opener: quadrant, both answers, the business problem, and the scene */
  R['agent-intro'] = (s) => {
    const a = AG[s.agentId];
    const q = QS[a.quadrant];
    const banner = a.banner && a.banner.src
      ? `<div class="banner" role="img" aria-label="${esc(a.banner.alt || '')}" style="background-image:linear-gradient(180deg, rgba(251,250,246,0) 0%, rgba(251,250,246,0) 32%, rgba(251,250,246,.18) 46%, rgba(251,250,246,.45) 58%, rgba(251,250,246,.75) 70%, rgba(251,250,246,.94) 80%, #FBFAF6 88%, #FBFAF6 100%), url('${esc(a.banner.src)}');background-position:center, ${esc(a.banner.position || 'center')}"></div>`
      : '';
    return {
      cls: 's-intro' + (banner ? ' has-banner' : ''), q: a.quadrant, theme: a.theme,
      html: `${banner}${banner ? '' : `<span class="ghost" aria-hidden="true">${pad2(s.quadrantNo)}</span>${motif(a.motif)}`}
        <div class="left">
          <p class="eyebrow">Quadrant ${s.quadrantNo} of 4 · ${esc(q.position)}</p>
          <h1>${esc(q.title)}</h1>
          ${chips(a)}
          <p class="who-line"><b>${esc(a.name)}</b><br>${t(a.domain)} · presented by ${t(a.presenter)}</p>
          ${(a.problem.alsoFor || []).length ? `<div class="alsofor"><span class="k">Also works for</span><ul>${a.problem.alsoFor.map(([biz, use]) => `<li><b>${esc(biz)}</b><span>${esc(use)}</span></li>`).join('')}</ul></div>` : ''}
        </div>
        <div class="card">
          <span class="k">The business problem</span>
          <p class="statement">${t(a.problem.statement)}</p>
          <hr>
          <div><span class="k">Who it helps</span><p class="v">${t(a.problem.affected)}</p></div>
          <div><span class="k">What improves <span class="exp">· expected, not measured</span></span><p class="v">${t(a.problem.benefit)}</p></div>
        </div>
        ${a.problem.scope ? `<p class="scope-foot"><b>Scope.</b> ${t(a.problem.scope)}</p>` : ''}`
    };
  };

  /* 2 · the five-line card, big */
  /* A friendly face for each agent; the accessory follows its business scene. */
  const ACCESSORY = {
    plane: '<path d="M46 72 Q100 22 154 72 Z" style="fill:#142544"/><rect x="34" y="68" width="132" height="14" rx="7" style="fill:#142544"/><path d="M86 52 l14 -6 l14 6 l-14 4 z" style="fill:#C9A25A"/><circle cx="100" cy="51" r="4" style="fill:#C9A25A"/>',
    receipt: '<circle cx="78" cy="104" r="17" fill="none" stroke-width="4" style="stroke:var(--ink)"/><circle cx="122" cy="104" r="17" fill="none" stroke-width="4" style="stroke:var(--ink)"/><path d="M95 104 h10" stroke-width="4" style="stroke:var(--ink)"/>',
    chat: '<path d="M40 104 Q40 38 100 38 Q160 38 160 104" fill="none" stroke-width="7" stroke-linecap="round" style="stroke:var(--ink)"/><rect x="28" y="92" width="18" height="34" rx="8" style="fill:var(--ink)"/><rect x="154" y="92" width="18" height="34" rx="8" style="fill:var(--ink)"/><path d="M38 126 Q44 150 76 146" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--ink)"/><circle cx="80" cy="146" r="6" style="fill:var(--ink)"/>',
    calendar: '<path d="M66 168 L92 192 M134 168 L108 192" stroke-width="5" style="stroke:var(--qc)"/><rect x="84" y="182" width="32" height="18" rx="4" style="fill:var(--card);stroke:var(--qc)" stroke-width="3"/>',
    /* customer service manager: navy suit, white shirt, gold tie, pocket square and name badge */
    suit: '<path d="M40 200 Q40 164 100 164 Q160 164 160 200 Z" style="fill:#142544"/>' +
      '<path d="M84 164 L100 198 L116 164 Z" fill="#fff"/>' +
      '<path d="M84 164 L95 192 L86 182 L78 168 Z M116 164 L105 192 L114 182 L122 168 Z" style="fill:#0B1A33"/>' +
      '<path d="M96 168 h8 l-1 5 h-6 z M97 173 h6 l3 20 l-6 6 l-6 -6 z" style="fill:#C9A25A"/>' +
      '<path d="M58 182 l10 -4 l2 6 z" style="fill:#C9A25A"/><rect x="126" y="180" width="18" height="8" rx="2" style="fill:#C9A25A"/>'
  };
  function face(a) {
    const acc = ACCESSORY[a.avatar || a.motif] || '';
    const antenna = (a.avatar || a.motif) === 'plane' ? '' : '<path d="M100 54 V32" stroke-width="5" stroke-linecap="round" style="stroke:var(--ink)"/><circle cx="100" cy="28" r="8" style="fill:var(--qdot)"/>';
    return `<svg class="face" viewBox="0 0 200 200" aria-hidden="true">
      <path d="M44 200 Q44 162 100 162 Q156 162 156 200 Z" style="fill:var(--qdot);opacity:.55"/>
      ${antenna}
      <rect x="42" y="52" width="116" height="112" rx="42" style="fill:#fff;stroke:var(--ink)" stroke-width="5"/>
      <g class="eyes"><ellipse cx="78" cy="104" rx="8" ry="11" style="fill:var(--ink)"/><ellipse cx="122" cy="104" rx="8" ry="11" style="fill:var(--ink)"/>
        <circle cx="81" cy="99" r="3" fill="#fff"/><circle cx="125" cy="99" r="3" fill="#fff"/></g>
      <circle cx="62" cy="128" r="9" style="fill:var(--qdot);opacity:.4"/><circle cx="138" cy="128" r="9" style="fill:var(--qdot);opacity:.4"/>
      <path d="M84 130 Q100 146 116 130" fill="none" stroke-width="5" stroke-linecap="round" style="stroke:var(--ink)"/>
      ${acc}
    </svg>`;
  }
  const ICON = {
    mission: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
    trigger: '<path d="M13 2 L4 14 h7 l-1 8 9-12 h-7 z"/>',
    gear: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    human: '<circle cx="12" cy="7" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/>'
  };
  const icon = (n) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n]}</svg>`;

  /* 2 · the agent card as a collectible card: each tap unlocks one of its five lines */
  R['agent-card'] = (s) => {
    const a = AG[s.agentId];
    const c = a.card;
    const q = QS[a.quadrant];
    const abilities = [
      ['mission', 'The job', t(c.job), ''],
      ['trigger', 'The trigger', t(c.trigger), ''],
      ['gear', 'The tools', t(c.tools), ''],
      ['lock', 'It must never', `${t(c.never.rule)}<span class="set">Locked by: ${t(c.never.setting)}</span>`, 'never'],
      ['human', 'Where a person checks', t(c.checkpoint), 'human']
    ];
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme, steps: abilities.length,
      html: `${agentHead(a, 'Meet the *agent*')}
        <div class="cardstage">
          <div class="tcard" data-tap role="button" tabindex="0" aria-label="Tap the card to unlock its next ability">
            <div class="tc-top"><span>Agent card</span><span class="tc-no">No. ${pad2(s.quadrantNo)}</span></div>
            <div class="tc-class">${esc(q.title)}</div>
            <div class="tc-portrait">${face(a)}${a.catchphrase ? `<span class="tc-bubble" aria-hidden="true">${esc(a.catchphrase)}</span>` : ''}</div>
            <div class="tc-name">${esc(nameOf(a))}</div>
            <div class="tc-sub">${t(a.domain)} · ${t(a.presenter)}</div>
            <div class="tc-stats"><span>Right answer <b>${yn(a.placement.q1.answer)}</b></span><span>Together <b>${yn(a.placement.q2.answer)}</b></span></div>
            <div class="tc-foot"><span class="tc-chip" aria-hidden="true"></span>
              <span class="tc-waves" aria-hidden="true"><i></i><i></i><i></i></span><span class="tc-tap no-print">Tap to activate</span></div>
          </div>
          <ol class="abil" aria-label="The five lines of the agent card">${abilities.map(([ic, k, v, cls], i) => `
            <li class="${cls}" data-frag="${i + 1}"><span class="ico">${icon(ic)}</span><div><span class="k">${i + 1} · ${esc(k)}</span><p class="v">${v}</p></div></li>`).join('')}
          </ol>
        </div>`
    };
  };

  /* 3 · the workflow, revealed one step at a time */
  const TYPE = { trigger: 'Trigger', ai: 'AI generates', rule: 'Fixed rule', action: 'Automated action', human: 'The person' };
  R['agent-build'] = (s) => {
    const a = AG[s.agentId];
    const n = a.workflow.length;
    const cols = n <= 5 ? n : 4;
    const shot = (a.config || []).find((c) => c.src);
    const evId = shot ? EV.push(shot) - 1 : -1;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme, steps: n - 1,
      html: `${agentHead(a, 'How it *runs*')}
        <div class="legend"><span><i class="ai"></i>AI generates: output can vary</span><span><i class="rule"></i>Fixed rule: same input, same result</span><span><i class="human"></i>The person</span></div>
        <div class="steps" style="grid-template-columns:repeat(${cols}, 1fr);row-gap:34px">${a.workflow.map((w, i) => `
          <div class="step ${w.type}" data-frag="${i}"><span class="no">${i + 1}</span><span class="type">${TYPE[w.type] || esc(w.type)}</span><span class="lbl">${t(w.label)}</span><span class="det">${t(w.detail)}</span></div>`).join('')}
        </div>
        <div class="build-foot no-print">
          <span class="small">Press → to reveal each step</span>
          <div class="btn-row">${evId >= 0 ? `<button class="btn small-btn" data-ev="${evId}">See it in Zapier ↗</button>` : `<span class="small">${tbc('Zap editor screenshot not added yet')}</span>`}
          <button class="btn small-btn" data-showall>Show all steps</button></div>
        </div>`
    };
  };

  /* 4 · one real run: what came in, what came out */
  R['agent-run'] = (s) => {
    const a = AG[s.agentId];
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a, 'One *real* run')}
        <div class="pair">${ev(a.run.input, a.run.input.caption || 'What came in', 1)}<span class="arrow" aria-hidden="true">→</span>${ev(a.run.output, a.run.output.caption || 'What the agent produced', 2)}</div>`
    };
  };

  /* 4b · the run as a journey: one stop per slide under a shared timeline */
  R['agent-journey'] = (s) => {
    const a = AG[s.agentId];
    const stops = a.journey;
    const st = stops[s.stop];
    const timeline = `<ol class="jline" aria-label="Journey: stop ${s.stop + 1} of ${stops.length}">${stops.map((x, j) => `
      <li class="${j < s.stop ? 'done' : ''}${j === s.stop ? ' cur' : ''}${x.human ? ' human' : ''}"><span class="dot">${j < s.stop ? '✓' : j + 1}</span><span class="jt"><span class="jw">${esc(x.who)}</span>${esc(x.short || x.title)}</span></li>`).join('')}</ol>`;
    const pins = (st.shots || []).flatMap((sh) => sh.pins || []);
    const info = `<div class="jinfo">
        <span class="jno">${pad2(s.stop + 1)}</span>
        <span class="k">${esc(st.who)}${st.time ? `<span class="jtime">${esc(st.time)}</span>` : ''}</span>
        <h3>${esc(st.title)}</h3>
        <p class="body">${t(st.note)}</p>
        ${pins.length ? `<ul class="jpins">${pins.map((p) => `<li><span class="pin-dot">${esc(p.n)}</span>${esc(p.text || '')}</li>`).join('')}</ul>` : ''}
      </div>`;
    let stage;
    if (st.human) {
      stage = `<div class="jhuman"><span class="k">The person decides</span>
          <p class="jh-title">${t(a.check.who)}</p>
          <ul>${(st.options || []).map((o) => `<li>${t(o)}</li>`).join('')}</ul>
          <p class="jh-foot">The agent prepared everything. Nothing reaches Kerry until the manager chooses.</p></div>`;
    } else {
      stage = `<div class="jshots${st.layout === 'stack' ? ' stack' : ''}">${st.shots.map((sh) => ev(sh, sh.caption, null, { noNotes: true })).join('')}</div>`;
    }
    return {
      cls: 'agent journey', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a, 'One run, start to *finish*')}${timeline}
        <div class="jbody">${info}${stage}</div>`
    };
  };

  /* 5 · the same run in Zap history, full width */
  R['agent-record'] = (s) => {
    const a = AG[s.agentId];
    const r = a.run;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a, 'The same run, in *Zap history*')}
        <div class="matchbar"><span class="k">Same run?</span><span>${esc(r.matchKey.label)}: ${t(r.matchKey.value)}</span></div>
        ${Array.isArray(r.recordShots) && r.recordShots.length
          ? `<div class="jshots">${r.recordShots.map((sh) => ev(sh, sh.caption)).join('')}</div>`
          : ev(r.record)}`
    };
  };

  /* 6 · the person in the loop, and why this quadrant */
  const PERSON = {
    tl: { title: 'The person *signs off*', rows: (c) => [['Who signs off', c.who, true], ['What they check', c.what], ['When', c.when], ['If they reject it', c.ifFails]] },
    tr: { title: 'The person *judges*', rows: (c) => [['Who judges', c.who], ['Chooses between', null, true, (c.options || []).length ? `<span class="options">${c.options.map((o) => `<span>${t(o)}</span>`).join('')}</span>` : tbc('the actual options')], ['When', c.when], ['If no option fits', c.ifFails]] },
    bl: { title: 'The *spot check*', rows: (c) => [['Who checks', c.who], ['How often', c.when, true], ['What they inspect', c.what], ['If it is wrong', c.ifFails]] },
    br: { title: 'AI prepares, the person *decides*', rows: (c) => [['The agent prepares', c.prepares], ['The manager decides', c.decides, true], ['What they check', c.what], ['When', c.when]] }
  };
  R['agent-person'] = (s) => {
    const a = AG[s.agentId];
    const P = PERSON[a.quadrant];
    const c = a.check;
    const p = a.placement;
    const fail = a.quadrant === 'br' ? `<p class="iffail"><b>If the check fails:</b> ${t(c.ifFails)}</p>` : '';
    const who = a.quadrant === 'br' ? `<p class="iffail" style="margin:-14px 0 18px"><b style="color:var(--gold-text)">Who checks:</b> ${t(c.who)}</p>` : '';
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a, P.title)}${who}
        <div class="tiles">${P.rows(c).map(([k, v, hero, html]) => `<div class="tile${hero ? ' hero' : ''}"><span class="k">${esc(k)}</span><span class="v">${html || t(v)}</span></div>`).join('')}</div>
        ${fail}
        <div class="why">
          <div><span class="q">Right answer? <b>${yn(p.q1.answer)}.</b></span><span class="r">${t(p.q1.why)}</span></div>
          <div><span class="q">Must work together? <b>${yn(p.q2.answer)}.</b>${mismatchChip(a)}</span><span class="r">${t(p.q2.why)}</span></div>
        </div>`
    };
  };

  R.compare = () => ({
    cls: 'compare',
    html: `${head('Back to the map', 'How the person’s *job* changes')}${qmapHTML('compare')}
      <div class="takeaway">
        <p><b>Q1, right answer?</b> Yes: the person verifies. No: the person judges.</p>
        <p><b>Q2, together?</b> Yes: the person is inside the work. No: they check or decide from outside.</p>
      </div>`
  });

  R.moves = () => ({
    html: `${head('What would move each agent?', 'Change the work, and the *quadrant* follows')}
      <div class="moves">${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return '';
        const m = a.move;
        const expected = m.question === 'q1' ? quadrantFor(m.to, QS[q].q2) : quadrantFor(QS[q].q1, m.to);
        return `<div class="move" data-q="${q}" data-move role="button" tabindex="0" aria-label="Step through the move for ${esc(nameOf(a))}">
          <div class="an"><span>${esc(nameOf(a))}</span><span class="small no-print">click to step through</span></div>
          <div>
            <p class="st" data-st="0"><b>If:</b> ${t(m.change)}</p>
            <p class="st" data-st="1"><b>${m.question === 'q1' ? 'Q1' : 'Q2'} flips:</b> <s>${esc(ans(m.question, m.from))}</s> → ${esc(ans(m.question, m.to))}</p>
            <p class="st dest" data-st="2">→ <span style="color:var(--${m.result})">${esc(QS[m.result].title)}</span>${expected !== m.result ? ' ' + tbc('check: points to ' + QS[expected].title) : ''}</p>
          </div>
          <div class="result">${mini(q, m.result)}<span class="small" style="font-size:17px;text-align:center">${esc(QS[q].position)} →<br>${esc(QS[m.result].position)}</span></div>
        </div>`;
      }).join('')}</div>`
  });

  R.closing = () => ({
    cls: 's-closing',
    html: `<p class="eyebrow">Questions</p><h1>${md(D.meta.closingQuestion)}</h1>
      <p class="lead">We will answer with evidence from our runs and their Zap history records.</p>
      ${glyph(130)}`
  });

  /* ----------------------------------------------------------- appendix */
  function agentStatus(a) {
    return [
      ['Presenter', !isTBC(a.presenter)],
      ['Problem', !hasTBC(a.problem)],
      ['Card', !hasTBC(a.card)],
      ['Workflow', !hasTBC(a.workflow)],
      ['Zap setup shots', (a.config || []).length > 0 && a.config.every((e) => e.src)],
      ['Input', !!a.run.input.src],
      ['Output', !!a.run.output.src],
      ['Zap record', !!a.run.record.src],
      ['Run match', !isTBC(a.run.matchKey.value)],
      ['Checker', !hasTBC(a.check)],
      ['Placement', !hasTBC(a.placement.q1) && !hasTBC(a.placement.q2) && !mismatch(a)]
    ];
  }
  function countAll() {
    let tbcs = 0, shots = 0;
    (function walk(v, k) {
      if (v == null) { if (k === 'src') shots++; return; }
      if (typeof v === 'string') { if (isTBC(v)) tbcs++; return; }
      if (Array.isArray(v)) { v.forEach((x) => walk(x)); return; }
      if (typeof v === 'object') Object.keys(v).forEach((key) => walk(v[key], key));
    })({ agents: D.agents, members: D.members });
    return { tbcs, shots };
  }

  R['evidence-status'] = () => {
    const cols = agentStatus(D.agents[0]).map((x) => x[0]);
    const n = countAll();
    return {
      html: `${head('Evidence status', 'What is ready, and what is still missing')}
      <table class="status-table"><thead><tr><th>Agent</th>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return `<tr><td>${esc(QS[q].position)}</td><td colspan="${cols.length}"><span class="st-miss">No agent</span></td></tr>`;
        return `<tr><td><span class="qchip" data-q="${q}">${esc(QS[q].position)}</span><br><b>${esc(nameOf(a))}</b></td>${agentStatus(a).map(([, ok]) => `<td>${ok ? '<span class="st-ok">Ready</span>' : '<span class="st-miss">Missing</span>'}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table>
      <p class="status-total">Counted live from <b>content/deck-data.js</b>: <b>${n.tbcs}</b> TBC fields and <b>${n.shots}</b> screenshots still to supply. A screenshot only proves a run when its run ID or timestamp matches the Zap history record.</p>`
    };
  };

  R.lessons = (s) => {
    const a = AG[s.agentId || s.agent];
    if (!a) return R.unknown(s);
    const lessons = a.lessons || [];
    const shot = (lessons.find((l) => l.evidence) || {}).evidence;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${head(`${nameOf(a)} · testing`, 'What testing taught us, and what we can prove')}
      <div class="lesson-layout"><div class="lessons">${lessons.map((l, i) => `
        <div class="lesson"><span class="n">${i + 1}</span><div><p class="t">${t(l.title)}</p><p class="d">${t(l.detail)}</p><p class="s">Status: ${t(l.status)}</p></div></div>`).join('')}</div>
        <div style="display:flex;flex-direction:column;min-height:0">${ev(shot)}</div></div>`
    };
  };

  /* Every step of one run, with the time it ran: appendix proof */
  R['run-trace'] = (s) => {
    const a = AG[s.agentId || s.agent];
    if (!a || !a.trace) return R.unknown(s);
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${head(`${nameOf(a)} · run trace`, 'Every step of the Kerry Tan run')}
        <div class="trace">${a.trace.map((x) => `
          <div class="trace-step">
            <div class="trace-head"><span class="jtime">${esc(x.time)}</span><b>${esc(x.step)}</b></div>
            ${ev({ src: x.src, caption: x.step, alt: `${x.step}: ${x.note}`, focus: x.focus, zoom: x.zoom })}
            <p class="trace-note">${esc(x.note)}</p>
          </div>`).join('')}</div>`
    };
  };

  R.placement = () => ({
    html: `${head('Placement checks', 'Where each placement could be challenged')}
      <div class="grid2">${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return '';
        return `<div class="acard" data-q="${q}"><span class="qchip" data-q="${q}">${esc(QS[q].title)}</span>
          <h3>${esc(nameOf(a))}</h3>
          <p class="small">Right answer? <b>${yn(a.placement.q1.answer)}</b> · Together? <b>${yn(a.placement.q2.answer)}</b>${mismatchChip(a)}</p>
          <p class="body">${t(a.placement.concern)}</p></div>`;
      }).join('')}</div>`
  });

  R.config = () => ({
    html: `${head('Configuration evidence', 'How each Zap is set up')}
      <div class="config-grid">${ORDER.map((q) => {
        const a = byQ(q);
        return `<div class="colhead"><span class="qchip" data-q="${q}">${esc(QS[q].position)}</span><b>${a ? esc(nameOf(a)) : ''}</b></div>`;
      }).join('')}
      ${[0, 1, 2].map((row) => ORDER.map((q) => {
        const a = byQ(q);
        const item = a && a.config && a.config[row];
        return item ? ev(item) : '<div></div>';
      }).join('')).join('')}</div>`
  });

  R.unknown = (s) => ({ html: head('Unknown slide type', s.type || '?') });

  /* ------------------------------------------------------------- build */
  const stage = document.getElementById('stage');
  SLIDES.forEach((s, i) => {
    const r = (R[s.type] || R.unknown)(s);
    s.steps = r.steps || 0;
    const wrap = document.createElement('div');
    wrap.className = 'slide-wrap';
    const sec = document.createElement('section');
    sec.className = ['slide', r.cls || '', s.appendix ? 'appendix' : '', r.theme ? 'theme-' + r.theme : ''].join(' ').replace(/\s+/g, ' ').trim();
    if (r.q) sec.dataset.q = r.q;
    sec.id = 's-' + s.id;
    sec.setAttribute('aria-roledescription', 'slide');
    sec.setAttribute('aria-label', `${i + 1} of ${SLIDES.length}: ${s.title || s.id}`);
    sec.innerHTML = r.html;
    wrap.appendChild(sec);
    stage.appendChild(wrap);
    s.el = sec;
  });

  /* ------------------------------------------------------- navigation */
  const state = { i: 0, step: 0 };
  const mainCount = SLIDES.filter((s) => !s.appendix).length;
  const chan = 'BroadcastChannel' in window ? new BroadcastChannel('g4-week8-deck') : null;
  const reading = () => document.body.classList.contains('reading');

  function applyFrags(s, step) {
    s.el.querySelectorAll('[data-frag]').forEach((el) => {
      el.classList.toggle('frag-hidden', Number(el.dataset.frag) > step);
    });
  }

  /* The agent's catchphrase pops up in a speech bubble for a moment after each tap. */
  function speak(card) {
    if (!card.querySelector('.tc-bubble')) return;
    card.classList.add('speak');
    clearTimeout(card._speakTimer);
    card._speakTimer = setTimeout(() => card.classList.remove('speak'), 2400);
  }

  function go(i, step, opts) {
    i = Math.max(0, Math.min(SLIDES.length - 1, i));
    const s = SLIDES[i];
    if (step === 'end') step = s.steps;
    step = Math.max(0, Math.min(s.steps, step || 0));
    if (i !== state.i) unfocusMap(SLIDES[state.i].el);
    SLIDES.forEach((x, k) => {
      x.el.classList.toggle('active', k === i);
      x.el.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    const tapped = s.type === 'agent-card' && i === state.i && step > state.step;
    state.i = i; state.step = step;
    applyFrags(s, step);
    if (tapped) {
      const card = s.el.querySelector('.tcard');
      card.classList.remove('tap');
      void card.offsetWidth; // restart the tap animation
      card.classList.add('tap');
      speak(card);
    }
    layoutEvidence(s.el);
    updateChrome();
    if (!(opts && opts.noHash)) history.replaceState(null, '', location.pathname + location.search + '#' + s.id);
    broadcast();
  }

  function next() {
    const s = SLIDES[state.i];
    if (!reading() && state.step < s.steps) go(state.i, state.step + 1);
    else if (state.i < SLIDES.length - 1) go(state.i + 1, 0);
  }
  function prev() {
    if (!reading() && state.step > 0) go(state.i, state.step - 1);
    else if (state.i > 0) go(state.i - 1, 'end');
  }
  const indexOf = (id) => SLIDES.findIndex((s) => s.id === id);

  /* ------------------------------------------------------------ chrome */
  const count = document.getElementById('count');
  const segsEl = document.getElementById('segs');
  const segGroups = [];
  SLIDES.forEach((s, k) => {
    const last = segGroups[segGroups.length - 1];
    if (last && last.id === s.segId) last.idx.push(k);
    else segGroups.push({ id: s.segId, label: s.segLabel, q: s.quadrant, appx: !!s.appendix, idx: [k] });
  });
  segsEl.innerHTML = segGroups.map((g, n) => `<button class="seg${g.appx ? ' appx' : ''}" data-seg="${n}" ${g.q ? `data-q="${g.q}"` : ''} style="flex:${g.idx.length}" title="${esc(g.label)}">
      <span class="sl">${esc(g.label)}</span><span class="ticks">${g.idx.map((k) => `<i data-k="${k}"></i>`).join('')}</span></button>`).join('');
  segsEl.addEventListener('click', (e) => {
    const b = e.target.closest('[data-seg]');
    if (b) go(segGroups[Number(b.dataset.seg)].idx[0], 0);
  });
  const ticks = [...segsEl.querySelectorAll('i[data-k]')];
  const segBtns = [...segsEl.querySelectorAll('.seg')];

  function updateChrome() {
    const s = SLIDES[state.i];
    count.textContent = s.appendix ? `A${SLIDES.filter((x) => x.appendix).indexOf(s) + 1}` : `${state.i + 1} / ${mainCount}`;
    ticks.forEach((b) => { const k = Number(b.dataset.k); b.classList.toggle('done', k < state.i); b.classList.toggle('cur', k === state.i); });
    segBtns.forEach((b, n) => b.classList.toggle('cur', segGroups[n].idx.includes(state.i)));
    document.title = `${s.title || s.id} · ${D.meta.group} Week 8`;
  }

  function fit() {
    if (reading()) { document.body.style.setProperty('--rs', String(window.innerWidth / 1600)); return; }
    const scale = Math.min(window.innerWidth / 1600, (window.innerHeight - 64) / 900);
    stage.style.transform = `scale(${scale})`;
  }

  function setReading(on) {
    document.body.classList.toggle('reading', on);
    stage.style.transform = '';
    fit();
    SLIDES.forEach((s) => applyFrags(s, on ? 99 : (s === SLIDES[state.i] ? state.step : 0)));
    if (on) SLIDES.forEach((s) => layoutEvidence(s.el));
    document.getElementById('btn-reading').setAttribute('aria-pressed', String(on));
  }

  /* ------------------------------------------------------ interactions */
  function focusMap(root, q) {
    const map = root.querySelector('[data-map]');
    if (!map) return;
    map.classList.add('focused');
    map.querySelectorAll('.qcell').forEach((c) => c.classList.toggle('sel', c.dataset.q === q));
    const back = map.querySelector('.qcell.sel [data-unfocus]');
    if (back) back.focus({ preventScroll: true });
  }
  function unfocusMap(root) {
    const map = root && root.querySelector('[data-map]');
    if (!map || !map.classList.contains('focused')) return false;
    map.classList.remove('focused');
    map.querySelectorAll('.qcell').forEach((c) => c.classList.remove('sel'));
    return true;
  }

  /* "What would move this agent?": each click reveals one more step;
     a click after the last shows the card whole again. */
  function stepMove(card) {
    const sts = [...card.querySelectorAll('.st')];
    const at = card.classList.contains('stepping') ? Number(card.dataset.at) + 1 : 0;
    const miniEl = card.querySelector('.result .mini');
    if (at >= sts.length) {
      card.classList.remove('stepping');
      sts.forEach((x) => x.classList.remove('dim'));
      miniEl.style.opacity = '';
      return;
    }
    card.classList.add('stepping');
    card.dataset.at = String(at);
    sts.forEach((x, k) => x.classList.toggle('dim', k > at));
    miniEl.style.opacity = at >= sts.length - 1 ? '1' : '.15';
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, [data-move], [data-focus-q], [data-tap]');
    if (!el || el.closest('.chrome')) return;
    const slide = el.closest('.slide');
    if (el.matches('[data-tap]')) {
      const s = SLIDES[state.i];
      if (state.step < s.steps) go(state.i, state.step + 1);
      else { const card = el; card.classList.remove('tap'); void card.offsetWidth; card.classList.add('tap'); speak(card); }
      return;
    }
    if (el.matches('[data-unfocus]')) { unfocusMap(slide); return; }
    if (el.matches('[data-goto]')) { const k = indexOf(el.dataset.goto); if (k >= 0) go(k, 0); return; }
    if (el.matches('[data-showall]')) { go(state.i, 'end'); return; }
    if (el.matches('[data-ev]')) {
      const im = el.querySelector('img');
      openLightbox(Number(el.dataset.ev), im && im.naturalWidth ? im.getBoundingClientRect().width / im.naturalWidth : 0);
      return;
    }
    if (el.matches('[data-move]')) { stepMove(el); return; }
    if (el.matches('[data-focus-q]')) { if (!el.classList.contains('sel')) focusMap(slide, el.dataset.focusQ); }
  });

  /* ---------------------------------------------------------- overlays */
  const lb = document.getElementById('lightbox');
  const ov = document.getElementById('overview');
  const help = document.getElementById('help');
  let lastFocus = null;

  function openOverlay(o) { lastFocus = document.activeElement; o.classList.add('open'); o.setAttribute('aria-hidden', 'false'); const f = o.querySelector('button'); if (f) f.focus(); }
  function closeOverlays() {
    let closed = false;
    [lb, ov, help].forEach((o) => { if (o.classList.contains('open')) { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); closed = true; } });
    if (closed && lastFocus) lastFocus.focus({ preventScroll: true });
    return closed;
  }
  const anyOverlay = () => [lb, ov, help].some((o) => o.classList.contains('open'));

  function openLightbox(id, slideScale) {
    const item = EV[id];
    if (!item) return;
    const pins = pinHTML(item.pins);
    const inner = lb.querySelector('.lb-inner');
    inner.classList.remove('zoomed');
    inner.innerHTML = `<div class="lb-img-wrap"><img src="${esc(item.src)}" alt="${esc(item.alt || item.caption || '')}">${pins}</div>`;
    lb.querySelector('.lb-cap').textContent = [item.caption, ...(item.pins || []).map((p) => `${p.n}: ${p.text || ''}`)].filter(Boolean).join('  ·  ');
    lb.dataset.focus = item.focus || '50% 50%';
    lb.dataset.slideScale = String(slideScale || 0);
    openOverlay(lb);
    const img = inner.querySelector('img');
    if (img.complete) sizeLightbox(); else img.addEventListener('load', sizeLightbox, { once: true });
  }
  /* Fit the screenshot to the screen, scaling small screenshots UP (not just down).
     Zoomed: twice that size, scrolled to the screenshot's focus point. */
  function sizeLightbox() {
    const inner = lb.querySelector('.lb-inner');
    const wrap = inner.querySelector('.lb-img-wrap');
    const img = inner.querySelector('img');
    if (!img || !img.naturalWidth) return;
    const widthFit = (window.innerWidth * 0.94) / img.naturalWidth;
    const fit = Math.min(widthFit, (window.innerHeight - 130) / img.naturalHeight);
    /* never smaller than the slide showed it: at least 1.5× the on-slide size, up to full width */
    const base = Math.min(widthFit, Math.max(fit, (Number(lb.dataset.slideScale) || 0) * 1.5));
    const zoomed = inner.classList.contains('zoomed');
    const w = img.naturalWidth * base * (zoomed ? 2 : 1);
    wrap.style.width = `${Math.round(w)}px`;
    /* centre the view on the screenshot's focus point when it is larger than the screen */
    const [fx, fy] = (lb.dataset.focus || '50% 50%').split(/\s+/).map((v) => parseFloat(v) / 100);
    const h = w * img.naturalHeight / img.naturalWidth;
    inner.scrollLeft = Math.max(0, fx * w - inner.clientWidth / 2);
    inner.scrollTop = Math.max(0, fy * h - inner.clientHeight / 2);
  }
  window.addEventListener('resize', () => { if (lb.classList.contains('open')) sizeLightbox(); });
  lb.addEventListener('click', (e) => {
    if (e.target.closest('.lb-img-wrap')) { lb.querySelector('.lb-inner').classList.toggle('zoomed'); sizeLightbox(); return; }
    if (e.target.closest('[data-close]') || e.target === lb) closeOverlays();
  });

  ov.querySelector('.ov-grid').innerHTML = SLIDES.map((s, k) => `
    <button class="ov-item" data-ov="${k}" ${s.quadrant ? `data-q="${s.quadrant}"` : ''}>
      <span class="n">${s.appendix ? 'Appendix' : k + 1} · ${esc(s.segLabel || '')}${s.seconds ? ' · ' + F.fmt(s.seconds) : ''}</span><span class="t">${esc(s.title || s.id)}</span></button>`).join('');
  ov.addEventListener('click', (e) => {
    const b = e.target.closest('[data-ov]');
    if (b) { closeOverlays(); go(Number(b.dataset.ov), 0); return; }
    if (e.target.closest('[data-close]') || e.target === ov) closeOverlays();
  });
  help.addEventListener('click', (e) => { if (e.target.closest('[data-close]') || e.target === help) closeOverlays(); });

  function openPresenter() {
    const w = window.open('presenter.html' + location.hash, 'g4-presenter', 'width=1200,height=800');
    toast(w ? 'Presenter view opened in a new window' : 'Allow pop-ups to open the presenter view');
  }
  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => toast('Full screen is not available here'));
  }
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2200);
  }

  document.getElementById('btn-prev').addEventListener('click', prev);
  document.getElementById('btn-next').addEventListener('click', next);
  document.getElementById('btn-map').addEventListener('click', () => go(indexOf('map'), 0));
  document.getElementById('btn-overview').addEventListener('click', () => openOverlay(ov));
  document.getElementById('btn-presenter').addEventListener('click', openPresenter);
  document.getElementById('btn-full').addEventListener('click', toggleFullscreen);
  document.getElementById('btn-help').addEventListener('click', () => openOverlay(help));
  document.getElementById('btn-reading').addEventListener('click', () => setReading(!reading()));

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') {
      if (closeOverlays()) return;
      unfocusMap(SLIDES[state.i].el);
      return;
    }
    if (anyOverlay()) return;
    const onRoleButton = e.target.matches && e.target.matches('[role="button"]');
    if ((k === 'Enter' || k === ' ') && onRoleButton) { e.preventDefault(); e.target.click(); return; }
    const onButton = e.target.closest && e.target.closest('button');
    if (k === 'ArrowRight' || k === 'PageDown' || k === 'ArrowDown' || (k === ' ' && !onButton)) { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0, 0); }
    else if (k === 'End') { e.preventDefault(); go(mainCount - 1, 'end'); }
    else if (k === 'm' || k === 'M') go(indexOf('map'), 0);
    else if (k === 'o' || k === 'O') openOverlay(ov);
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === 'r' || k === 'R') setReading(!reading());
    else if (k === '?') openOverlay(help);
    else if (/^[1-4]$/.test(k) && SLIDES[state.i].type === 'map') focusMap(SLIDES[state.i].el, ORDER[Number(k) - 1]);
  });

  /* touch: swipe left/right */
  let tx = null;
  stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (tx == null || reading()) return;
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 60) (dx < 0 ? next : prev)();
    tx = null;
  });

  /* ------------------------------------------------- presenter sync */
  function broadcast() {
    if (!chan) return;
    const s = SLIDES[state.i];
    chan.postMessage({ type: 'state', i: state.i, step: state.step, steps: s.steps, id: s.id });
  }
  if (chan) {
    chan.onmessage = (e) => {
      const m = e.data || {};
      if (m.type === 'hello') broadcast();
      else if (m.type === 'nav') {
        if (m.action === 'next') next();
        else if (m.action === 'prev') prev();
        else if (m.action === 'go') go(m.i, 0);
      }
    };
  }

  /* ------------------------------------------------------------ start */
  window.addEventListener('resize', fit);
  if ('ResizeObserver' in window) new ResizeObserver(fit).observe(document.documentElement);
  window.addEventListener('hashchange', () => { const k = indexOf(location.hash.slice(1)); if (k >= 0 && k !== state.i) go(k, 0, { noHash: true }); });
  window.addEventListener('beforeprint', () => SLIDES.forEach((s) => { applyFrags(s, 99); layoutEvidence(s.el); }));
  window.addEventListener('afterprint', () => SLIDES.forEach((s, k) => applyFrags(s, k === state.i ? state.step : 0)));

  const params = new URLSearchParams(location.search);
  if (params.get('mode') === 'reading' || (window.innerWidth < 760 && params.get('mode') !== 'present')) setReading(true);
  fit();
  const startAt = indexOf(location.hash.slice(1));
  go(startAt >= 0 ? startAt : 0, 0, { noHash: startAt < 0 });
  if (!TIMING.ok) console.warn('[deck] Timing check:', TIMING.problems.join(' '));

  window.__deck = { SLIDES, go, state, timing: TIMING };
})();
