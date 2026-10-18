/* Group 4 · Week 8 deck engine.
   Renders every slide from content/deck-data.js, then handles navigation,
   step-by-step reveals, the interactive map, evidence zoom and presenter sync.
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
  const quadrantFor = (q1, q2) => ORDER.find((q) => QS[q].q1 === q1 && QS[q].q2 === q2);
  const mismatch = (a) => quadrantFor(a.placement.q1.answer, a.placement.q2.answer) !== a.quadrant;

  function mini(on, to) {
    return `<div class="mini" aria-hidden="true">${ORDER.map((q) => {
      const cls = [q === on ? 'on' : '', q === to ? 'to' : ''].join(' ');
      return `<span data-q="${q}" class="${cls}" style="--qto:var(--${q})"></span>`;
    }).join('')}</div>`;
  }

  function simpleHead(eyebrow, title, extra) {
    return `<header class="slide-head"><div class="titles"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${extra || ''}</div></header>`;
  }

  function agentHead(a, title) {
    const q = QS[a.quadrant];
    const brand = a.theme === 'mbairline' ? '<span class="brand">MBairline</span>' : '';
    if (title) {
      return `<header class="slide-head compact"><div class="titles">
        <div class="meta-line"><span class="qchip" data-q="${a.quadrant}">${esc(q.title)}</span>&ensp;·&ensp;<b>${esc(nameOf(a))}</b>&ensp;·&ensp;${t(a.presenter)}</div>
        <h2>${esc(title)}</h2></div>
        <div class="mini-wrap">${brand}${mini(a.quadrant)}</div></header>`;
    }
    return `<header class="slide-head"><div class="titles">${brand}
      <span class="qchip" data-q="${a.quadrant}">${esc(q.title)} · ${esc(q.position)}</span>
      <h2>${esc(a.name)}</h2>
      <div class="meta-line">Presenter <b>${t(a.presenter)}</b>&ensp;·&ensp;Domain <b>${t(a.domain)}</b></div></div>
      <div class="mini-wrap">${mini(a.quadrant)}<span class="small">${esc(q.position)}</span></div></header>`;
  }

  /* ----------------------------------------------------------- evidence */
  const EV = [];
  function ev(item) {
    item = item || { src: null, caption: '', missing: 'Not supplied' };
    const cap = item.caption ? `<figcaption><b>${t(item.caption)}</b></figcaption>` : '';
    if (!item.src) {
      return `<figure class="ev"><div class="ev-frame"><div class="ev-missing"><span class="t">Missing evidence</span><span class="d">${esc(item.missing || 'Screenshot not supplied')}</span></div></div>${cap}</figure>`;
    }
    const id = EV.push(item) - 1;
    const pins = (item.pins || []).map((p) => `<span class="pin" style="left:${p.x}%;top:${p.y}%">${esc(p.n)}</span>`).join('');
    const notes = (item.pins || []).length ? `<ul class="pin-notes">${item.pins.map((p) => `<li><b>${esc(p.n)}</b> ${esc(p.text || '')}</li>`).join('')}</ul>` : '';
    return `<figure class="ev"><button class="ev-frame" data-ev="${id}" aria-label="Enlarge: ${esc(item.alt || item.caption || 'evidence')}">
      <div class="ev-inner" data-focus="${esc(item.focus || '50% 0%')}" data-zoom="${Number(item.zoom) || 1}" style="position:absolute;left:0;top:0;width:100%;transform-origin:0 0">
        <img src="${esc(item.src)}" alt="${esc(item.alt || item.caption || '')}" style="position:static;display:block;width:100%;height:auto">${pins}</div>
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
        const base = Math.min(1, fh / ih);
        const s = base * zoom;
        const place = (size, frameSize, f) => {
          if (size * s <= frameSize) return (frameSize - size * s) / 2;
          return Math.min(0, Math.max(frameSize - size * s, frameSize / 2 - f * size * s));
        };
        const tx = place(iw, fw, fx), ty = place(ih, fh, fy);
        inner.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
        inner.querySelectorAll('.pin').forEach((p) => { p.style.transform = `translate(-50%, -50%) scale(${1 / s})`; });
      };
      if (img.complete) apply(); else img.addEventListener('load', apply, { once: true });
    });
  }

  /* --------------------------------------------------------------- map */
  function qmapHTML(opts) {
    const cell = (q) => {
      const a = byQ(q);
      const Qd = QS[q];
      const inner = a
        ? `<span class="qt">${esc(Qd.title)}</span><span class="an">${esc(nameOf(a))}</span><span class="dm">${t(a.domain)} · ${t(a.presenter)}</span>${opts.compact ? '' : `<span class="job">${t(a.oneLiner)}</span><span class="role"><b>The person:</b> ${esc(Qd.role.charAt(0).toLowerCase() + Qd.role.slice(1))}</span>`}`
        : `<span class="qt">${esc(Qd.title)}</span>${tbc('no agent placed here yet')}`;
      return opts.interactive
        ? `<button class="qcell" data-q="${q}" data-focus-q="${q}" aria-pressed="false" aria-label="${esc(Qd.title)}: ${esc(a ? nameOf(a) : 'empty')}">${inner}</button>`
        : `<div class="qcell" data-q="${q}">${inner}</div>`;
    };
    const head = (axis, v) => `<span class="label">${axis === 'q1' ? 'Q1' : 'Q2'} · ${v === 'yes' ? 'Yes' : 'No'}</span><span class="v">${esc(ans(axis, v))}</span>`;
    return `<div class="qmap${opts.compact ? ' compact' : ''}"${opts.interactive ? ' data-map' : ''}>
      <div class="corner"><span class="label">Q1 across<br>Q2 down</span></div>
      <div class="xhead">${head('q1', 'yes')}</div><div class="xhead">${head('q1', 'no')}</div>
      <div class="yhead">${head('q2', 'yes')}</div>${cell('tl')}${cell('tr')}
      <div class="yhead">${head('q2', 'no')}</div>${cell('bl')}${cell('br')}
    </div>`;
  }

  const panelDefault = () => `
    <p class="label" style="color:var(--gold-text)">How to read the map</p>
    <div><div class="k">Q1 · across</div><div class="v"><b>${esc(AX.q1.question)}</b><br>${esc(AX.q1.yes)} · ${esc(AX.q1.no)}</div></div>
    <div><div class="k">Q2 · down</div><div class="v"><b>${esc(AX.q2.question)}</b><br>${esc(AX.q2.yes)} · ${esc(AX.q2.no)}</div></div>
    <div><div class="k">Read the cells for</div><div class="v">the agent, its domain and presenter, its job, and what the person does there.</div></div>
    <p class="small no-print" style="margin-top:auto">Click a quadrant (or press 1–4) to focus on its agent.</p>`;

  function panelFor(q) {
    const a = byQ(q);
    const Qd = QS[q];
    if (!a) return panelDefault();
    return `<span class="qchip" data-q="${q}">${esc(Qd.position)}</span>
      <h3 style="color:var(--${q});font-size:28px">${esc(Qd.title)}</h3>
      <div><div class="k">Agent</div><div class="v"><b>${esc(a.name)}</b><br>${t(a.domain)} · ${t(a.presenter)}</div></div>
      <div><div class="k">The person</div><div class="v">${esc(Qd.role)}</div></div>
      <div class="answers">
        <div class="ans-row"><span class="q">Q1 · Right answer?</span><b>${yn(a.placement.q1.answer)}</b></div>
        <div class="ans-row"><span class="q">Q2 · Together?</span><b>${yn(a.placement.q2.answer)}</b></div>
      </div>
      ${mismatch(a) ? tbc('Placement mismatch: these answers point to a different quadrant') : ''}
      <div class="btn-row"><button class="btn" data-unfocus>← Back to full map</button><button class="btn solid" data-goto="${a.id}-problem">Go to this agent →</button></div>`;
  }

  /* ---------------------------------------------------------- renderers */
  const R = {};

  R.title = () => ({
    cls: 's-title',
    html: `<p class="eyebrow">${esc(D.meta.course)} · ${esc(D.meta.date)}</p>
      <div style="display:flex;flex-direction:column;gap:28px"><h1>${esc(D.meta.title)}</h1><p class="lead">${esc(D.meta.subtitle)}</p></div>
      <div class="title-foot"><div class="members"><span class="member group">${esc(D.meta.group)}</span>${D.members.map((m) => `<span class="member">${esc(m.name)}</span>`).join('')}</div>
      <div class="title-glyph" aria-hidden="true">${ORDER.map((q) => `<span style="background:var(--${q})"></span>`).join('')}</div></div>`
  });

  R.axes = () => ({
    html: `${simpleHead('Before the agents', 'Two questions place every agent')}
      <div class="axes-grid">${['q1', 'q2'].map((k, i) => `
        <div class="axis-card"><span class="qnum">Question ${i + 1}</span><h3>${esc(AX[k].question)}</h3>
          <div class="axis-ans"><div><div class="k">Yes</div><div class="v">${esc(AX[k].yes)}</div></div><div><div class="k">No</div><div class="v">${esc(AX[k].no)}</div></div></div>
          <p class="body">${i === 0 ? 'Shapes the person’s task: <b>verify</b> an answer, or <b>judge</b> between good options.' : 'Shapes where the person stands: <b>inside</b> the work, or <b>outside</b> it, checking or deciding.'}</p>
        </div>`).join('')}</div>
      <div class="traps"><p class="trap">A person checking the output does not, by itself, mean people and AI must work together.</p>
        <p class="trap">Human accountability alone does not separate the two right-hand quadrants.</p></div>`
  });

  R.map = () => ({
    html: `${simpleHead('Four agents, one map', 'How does the task decide the person’s role?')}
      <div class="map-layout">${qmapHTML({ interactive: true })}<aside class="map-panel" data-panel aria-live="polite">${panelDefault()}</aside></div>`
  });

  R['agent-problem'] = (s) => {
    const a = AG[s.agentId];
    const c = a.card;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a)}
      <div class="problem-layout">
        <div class="problem-main">
          <p class="label">The business problem</p>
          <p class="statement">${t(a.problem.statement)}</p>
          <div class="facts">
            <div class="fact"><div class="k">Who is affected</div><div class="v">${t(a.problem.affected)}</div></div>
            <div class="fact"><div class="k">What is hard today</div><div class="v">${t(a.problem.difficulty)}</div></div>
            <div class="fact expected"><div class="k">Benefit</div><div class="v">${t(a.problem.benefit)}</div></div>
          </div>
        </div>
        <ol class="card-five" aria-label="Five-line agent card">
          <li><span class="n">1</span><span class="k">Job</span><span class="v">${t(c.job)}</span></li>
          <li><span class="n">2</span><span class="k">Trigger</span><span class="v">${t(c.trigger)}</span></li>
          <li><span class="n">3</span><span class="k">Tools &amp; actions</span><span class="v">${t(c.tools)}</span></li>
          <li><span class="n">4</span><span class="k">Must never</span><span class="v">${t(c.never.rule)}<span class="set">Enforced by: ${t(c.never.setting)}</span></span></li>
          <li class="checkpoint"><span class="n">5</span><span class="k">Human checkpoint</span><span class="v">${t(c.checkpoint)}</span></li>
        </ol>
      </div>`
    };
  };

  const TYPE = { trigger: 'Trigger', ai: 'AI generates', rule: 'Fixed rule', action: 'Automated action', human: 'Person' };

  R['agent-build'] = (s) => {
    const a = AG[s.agentId];
    const n = a.workflow.length;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme, steps: n - 1,
      html: `${agentHead(a, 'How it runs, from trigger to person')}
      <div class="legend"><span><i class="trigger"></i>Trigger</span><span><i class="ai"></i>AI generates: output can vary</span><span><i class="rule"></i>Fixed rule: same input, same result</span><span><i class="action"></i>Automated action</span><span><i class="human"></i>The person</span></div>
      <div class="workflow${n >= 6 ? ' dense' : ''}" style="grid-template-columns:repeat(${n}, 1fr)">${a.workflow.map((w, i) => `
        <div class="wf-cell"><div class="wf-step ${w.type}" data-frag="${i}"><span class="type">${TYPE[w.type] || esc(w.type)}</span><span class="lbl">${t(w.label)}</span><span class="det">${t(w.detail)}</span></div><span class="arrow" aria-hidden="true">→</span></div>`).join('')}
      </div>
      <div class="build-foot">
        <div class="config-row">${(a.config || []).slice(0, 3).map(ev).join('')}</div>
        <div class="wf-controls no-print"><button class="btn" data-showall>Show all steps</button><span class="small">→ reveals the next step</span></div>
      </div>`
    };
  };

  const CHECK_TITLE = {
    tl: 'Where the person signs off',
    tr: 'Where the person judges',
    bl: 'The spot check',
    br: 'What the agent prepares, what the person decides'
  };

  function checkRows(a) {
    const c = a.check;
    const rows = {
      tl: [['Who signs off', c.who], ['What they check', c.what], ['When', c.when], ['If they reject it', c.ifFails]],
      tr: [['Who judges', c.who], ['When', c.when], ['Chooses between', null, (c.options || []).length ? `<span class="options">${c.options.map((o) => `<span>${t(o)}</span>`).join('')}</span>` : tbc('the actual options')], ['What they weigh', c.what], ['If no option fits', c.ifFails]],
      bl: [['Who checks', c.who], ['How often', c.when], ['What they inspect', c.what], ['If it is wrong', c.ifFails]],
      br: [['Agent prepares', c.prepares], ['Person decides', c.decides], ['Who checks', c.who], ['When', c.when], ['What they check', c.what], ['If it fails', c.ifFails]]
    }[a.quadrant];
    return rows.map(([k, v, html]) => `<div class="kv2-item${k === 'Chooses between' ? ' wide' : ''}"><span class="k">${esc(k)}</span><span class="v">${html || t(v)}</span></div>`).join('');
  }

  function placeRows(a) {
    const p = a.placement;
    return `<div class="kv"><span class="k">Q1 · Right answer?</span><span><span class="ansbadge">${yn(p.q1.answer)}.</span>${t(p.q1.why)}</span></div>
      <div class="kv"><span class="k">Q2 · Together?</span><span><span class="ansbadge">${yn(p.q2.answer)}.</span>${t(p.q2.why)}</span></div>
      ${mismatch(a) ? tbc('Placement mismatch: these answers point to a different quadrant') : ''}`;
  }

  R['agent-run'] = (s) => {
    const a = AG[s.agentId];
    const r = a.run;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${agentHead(a, 'One run, matched to its record')}
      <div class="matchbar"><span class="k">Same run?</span><span>${esc(r.matchKey.label)}: ${t(r.matchKey.value)}</span></div>
      <div class="trio">${ev(r.input)}<span class="arrow" aria-hidden="true">→</span>${ev(r.output)}<span class="arrow" aria-hidden="true">↔</span>${ev(r.record)}</div>
      <div class="run-bottom">
        <div class="checkbox"><h3>${esc(CHECK_TITLE[a.quadrant])}</h3><div class="kv2">${checkRows(a)}</div></div>
        <div class="placebox"><h3>Why “${esc(QS[a.quadrant].title)}”</h3>${placeRows(a)}</div>
      </div>`
    };
  };

  R.compare = () => ({
    html: `${simpleHead('Back to the full map', 'Both questions, four agents')}
      <div class="compare-layout">${qmapHTML({ compact: true })}
        <div class="compare-right">
          <table class="ctable"><thead><tr><th style="width:34%">Agent</th><th style="width:15%">Right answer?</th><th style="width:15%">Together?</th><th>What the person does</th></tr></thead>
          <tbody>${ORDER.map((q) => {
            const a = byQ(q);
            if (!a) return '';
            return `<tr><td class="agent"><span class="qchip" data-q="${q}">${esc(QS[q].title)}</span>${esc(nameOf(a))}</td><td><b>${yn(a.placement.q1.answer)}</b></td><td><b>${yn(a.placement.q2.answer)}</b></td><td>${esc(QS[q].role)}</td></tr>`;
          }).join('')}</tbody></table>
          <div class="insights">
            <p><b>Q1 changes the person’s task.</b> With a right answer they verify; without one they judge.</p>
            <p><b>Q2 changes where they stand.</b> Together, they are inside the work; alone, they check or decide from outside it.</p>
          </div>
        </div>
      </div>`
  });

  R.moves = () => ({
    html: `${simpleHead('What would move each agent?', 'Change the work, and the quadrant follows', '<p class="small">Proposed changes for discussion. Removing an approval does not by itself move an agent: an answer to one of the two questions has to change.</p>')}
      <div class="moves-grid">${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return '';
        const m = a.move;
        const expected = m.question === 'q1' ? quadrantFor(m.to, QS[q].q2) : quadrantFor(QS[q].q1, m.to);
        return `<div class="move" data-q="${q}" data-move role="button" tabindex="0" aria-label="Step through the move for ${esc(nameOf(a))}">
          <div class="head"><span class="qchip" data-q="${q}">${esc(QS[q].title)}</span><span class="step-hint no-print">Click to step through</span></div>
          <div class="steps"><span class="an">${esc(nameOf(a))}</span>
            <div class="st" data-st="0"><span class="n">1</span><span><b>Change:</b> ${t(m.change)}</span></div>
            <div class="st" data-st="1"><span class="n">2</span><span><b>${m.question === 'q1' ? 'Q1' : 'Q2'} changes:</b> <s>${esc(ans(m.question, m.from))}</s> → ${esc(ans(m.question, m.to))}</span></div>
            <div class="st" data-st="2"><span class="n">3</span><span><b>Lands in:</b> <span style="color:var(--${m.result});font-weight:700">${esc(QS[m.result].title)}</span>${expected !== m.result ? ' ' + tbc('check: this change points to ' + QS[expected].title) : ''}</span></div>
          </div>
          <div class="result">${mini(q, m.result)}<span class="small">${esc(QS[q].position)} → ${esc(QS[m.result].position)}</span></div>
          <p class="caveat">${t(m.caveat)}</p></div>`;
      }).join('')}</div>`
  });

  R.closing = () => ({
    cls: 's-closing',
    html: `<p class="eyebrow">Questions</p><h1>${esc(D.meta.closingQuestion)}</h1>
      <p class="lead">We will answer with evidence from our runs and their Zap history records.</p>
      <div class="title-glyph" aria-hidden="true" style="width:110px;height:110px">${ORDER.map((q) => `<span style="background:var(--${q})"></span>`).join('')}</div>`
  });

  /* ----------------------------------------------------------- appendix */
  function agentStatus(a) {
    return [
      ['Presenter', !isTBC(a.presenter)],
      ['Problem', !hasTBC(a.problem)],
      ['Card', !hasTBC(a.card)],
      ['Workflow', !hasTBC(a.workflow)],
      ['Config shots', (a.config || []).length > 0 && a.config.every((e) => e.src)],
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
    })({ agents: D.agents, members: D.members, faq: D.faq });
    return { tbcs, shots };
  }

  R['evidence-status'] = () => {
    const cols = agentStatus(D.agents[0]).map((x) => x[0]);
    const n = countAll();
    return {
      html: `${simpleHead('Evidence status', 'What is ready, and what is still missing')}
      <table class="status-table"><thead><tr><th>Agent</th>${cols.map((c) => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return `<tr><td>${esc(QS[q].position)}</td><td colspan="${cols.length}"><span class="st-miss">No agent</span></td></tr>`;
        return `<tr><td><span class="qchip" data-q="${q}">${esc(QS[q].position)}</span><br><b>${esc(nameOf(a))}</b></td>${agentStatus(a).map(([, ok]) => `<td>${ok ? '<span class="st-ok">Ready</span>' : '<span class="st-miss">Missing</span>'}</td>`).join('')}</tr>`;
      }).join('')}</tbody></table>
      <p class="status-total">Counted live from <b>content/deck-data.js</b>: <b>${n.tbcs}</b> TBC fields and <b>${n.shots}</b> screenshots still to supply. A screenshot only counts as evidence of a run when its run ID or timestamp matches the Zap history record.</p>`
    };
  };

  R.lessons = (s) => {
    const a = AG[s.agentId || s.agent];
    if (!a) return R.unknown(s);
    const lessons = a.lessons || [];
    const shot = (lessons.find((l) => l.evidence) || {}).evidence;
    return {
      cls: 'agent', q: a.quadrant, theme: a.theme,
      html: `${simpleHead(`${nameOf(a)} · testing`, 'What testing taught us, and what we can prove')}
      <div class="lesson-layout"><div class="lessons">${lessons.map((l, i) => `
        <div class="lesson"><span class="n">${i + 1}</span><div><p class="t">${t(l.title)}</p><p class="d">${t(l.detail)}</p><p class="s">Status: ${t(l.status)}</p></div></div>`).join('')}</div>
        <div style="display:flex;flex-direction:column;min-height:0">${ev(shot)}</div></div>`
    };
  };

  R.placement = () => ({
    html: `${simpleHead('Placement checks', 'Where each placement could be challenged')}
      <div class="place-grid">${ORDER.map((q) => {
        const a = byQ(q);
        if (!a) return '';
        return `<div class="place-card" data-q="${q}"><span class="qchip" data-q="${q}">${esc(QS[q].title)}</span>
          <h3>${esc(nameOf(a))}</h3>
          <p class="small"><b>Q1</b> ${yn(a.placement.q1.answer)} · <b>Q2</b> ${yn(a.placement.q2.answer)}${mismatch(a) ? ' · ' + tbc('mismatch with quadrant') : ''}</p>
          <p class="body">${t(a.placement.concern)}</p></div>`;
      }).join('')}</div>`
  });

  R.config = () => ({
    html: `${simpleHead('Configuration evidence', 'How each Zap is set up')}
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

  R.faq = (s) => ({
    html: `${simpleHead('Anticipated questions', s.from ? 'More questions we expect' : 'Questions we expect, and how we will answer')}
      <div class="faq-grid">${D.faq.slice(s.from || 0, s.to || D.faq.length).map((f) => `
        <div class="faq-card"><p class="q">${t(f.q)}</p><p class="a">${t(f.a)}</p></div>`).join('')}</div>`
  });

  R.unknown = (s) => ({ html: simpleHead('Unknown slide type', s.type || '?') });

  /* ------------------------------------------------------------- build */
  const stage = document.getElementById('stage');
  SLIDES.forEach((s, i) => {
    const r = (R[s.type] || R.unknown)(s);
    s.steps = r.steps || 0;
    const wrap = document.createElement('div');
    wrap.className = 'slide-wrap';
    const sec = document.createElement('section');
    sec.className = ['slide', r.cls || '', s.appendix ? 'appendix' : '', r.theme ? 'theme-' + r.theme : ''].join(' ').trim();
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

  function applyFrags(s, step) {
    s.el.querySelectorAll('[data-frag]').forEach((el) => {
      el.classList.toggle('frag-hidden', Number(el.dataset.frag) > step);
    });
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
    state.i = i; state.step = step;
    applyFrags(s, step);
    layoutEvidence(s.el);
    updateChrome();
    if (!(opts && opts.noHash)) history.replaceState(null, '', '#' + s.id);
    broadcast();
  }

  function next() {
    const s = SLIDES[state.i];
    if (!document.body.classList.contains('reading') && state.step < s.steps) go(state.i, state.step + 1);
    else if (state.i < SLIDES.length - 1) go(state.i + 1, 0);
  }
  function prev() {
    if (!document.body.classList.contains('reading') && state.step > 0) go(state.i, state.step - 1);
    else if (state.i > 0) go(state.i - 1, 'end');
  }
  const indexOf = (id) => SLIDES.findIndex((s) => s.id === id);

  /* ------------------------------------------------------------ chrome */
  const where = document.getElementById('where');
  const progress = document.getElementById('progress');
  progress.innerHTML = SLIDES.map((s, k) => {
    const segStart = k > 0 && SLIDES[k - 1].segId !== s.segId;
    return `<span class="${s.appendix ? 'appx' : ''} ${segStart ? 'seg-start' : ''}" title="${esc((k + 1) + '. ' + (s.title || s.id))}"></span>`;
  }).join('');
  const bars = [...progress.children];

  function updateChrome() {
    const s = SLIDES[state.i];
    const pos = s.appendix ? `Appendix ${SLIDES.filter((x) => x.appendix).indexOf(s) + 1}` : `${state.i + 1} / ${mainCount}`;
    where.innerHTML = `<b>${pos}</b>&ensp;${esc(s.segLabel || '')}${s.steps ? `&ensp;·&ensp;step ${state.step + 1} of ${s.steps + 1}` : ''}`;
    bars.forEach((b, k) => { b.classList.toggle('done', k < state.i); b.classList.toggle('cur', k === state.i); });
    document.title = `${s.title || s.id} · ${D.meta.group} Week 8`;
  }

  function fit() {
    const reading = document.body.classList.contains('reading');
    if (reading) {
      document.body.style.setProperty('--rs', String(window.innerWidth / 1600));
      return;
    }
    const vw = window.innerWidth, vh = window.innerHeight - 56;
    const scale = Math.min(vw / 1600, vh / 900);
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
    const panel = root.querySelector('[data-panel]');
    if (!map || !panel) return;
    map.classList.add('focused');
    map.querySelectorAll('.qcell').forEach((c) => {
      const on = c.dataset.q === q;
      c.classList.toggle('sel', on);
      c.setAttribute('aria-pressed', String(on));
    });
    panel.innerHTML = panelFor(q);
    const back = panel.querySelector('[data-unfocus]');
    if (back) back.focus({ preventScroll: true });
  }
  function unfocusMap(root) {
    const map = root && root.querySelector('[data-map]');
    if (!map || !map.classList.contains('focused')) return false;
    map.classList.remove('focused');
    map.querySelectorAll('.qcell').forEach((c) => { c.classList.remove('sel'); c.setAttribute('aria-pressed', 'false'); });
    root.querySelector('[data-panel]').innerHTML = panelDefault();
    return true;
  }

  /* "What would move this agent?": change → which answer changes → new quadrant.
     Each click reveals one more step; a click after the last shows the card whole again. */
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
    miniEl.style.opacity = at >= sts.length - 1 ? '1' : '.2';
  }

  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, [data-move]');
    if (!el) return;
    const slide = el.closest('.slide');
    if (el.matches('[data-focus-q]')) { focusMap(slide, el.dataset.focusQ); return; }
    if (el.matches('[data-unfocus]')) { unfocusMap(slide); return; }
    if (el.matches('[data-goto]')) { const k = indexOf(el.dataset.goto); if (k >= 0) go(k, 0); return; }
    if (el.matches('[data-showall]')) { go(state.i, 'end'); return; }
    if (el.matches('[data-move]')) { stepMove(el); return; }
    if (el.matches('[data-ev]')) { openLightbox(Number(el.dataset.ev)); return; }
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

  function openLightbox(id) {
    const item = EV[id];
    if (!item) return;
    const pins = (item.pins || []).map((p) => `<span class="pin" style="left:${p.x}%;top:${p.y}%">${esc(p.n)}</span>`).join('');
    lb.querySelector('.lb-inner').classList.remove('zoomed');
    lb.querySelector('.lb-inner').innerHTML = `<div class="lb-img-wrap"><img src="${esc(item.src)}" alt="${esc(item.alt || item.caption || '')}">${pins}</div>`;
    lb.querySelector('.lb-cap').textContent = [item.caption, ...(item.pins || []).map((p) => `${p.n}: ${p.text || ''}`)].filter(Boolean).join('  ·  ');
    openOverlay(lb);
  }
  lb.addEventListener('click', (e) => {
    if (e.target.closest('img')) { lb.querySelector('.lb-inner').classList.toggle('zoomed'); return; }
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
  document.getElementById('btn-reading').addEventListener('click', () => setReading(!document.body.classList.contains('reading')));

  document.addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const k = e.key;
    if (k === 'Escape') {
      if (closeOverlays()) return;
      unfocusMap(SLIDES[state.i].el);
      return;
    }
    if (lb.classList.contains('open') || ov.classList.contains('open') || help.classList.contains('open')) return;
    const onControl = e.target.closest && e.target.closest('button, [role="button"]');
    if (k === 'ArrowRight' || k === 'PageDown' || (k === ' ' && !onControl)) { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'PageUp') { e.preventDefault(); prev(); }
    else if (k === 'ArrowDown') { e.preventDefault(); next(); }
    else if (k === 'ArrowUp') { e.preventDefault(); prev(); }
    else if (k === 'Home') { e.preventDefault(); go(0, 0); }
    else if (k === 'End') { e.preventDefault(); go(mainCount - 1, 'end'); }
    else if (k === 'm' || k === 'M') go(indexOf('map'), 0);
    else if (k === 'o' || k === 'O') openOverlay(ov);
    else if (k === 'p' || k === 'P') openPresenter();
    else if (k === 'f' || k === 'F') toggleFullscreen();
    else if (k === 'r' || k === 'R') setReading(!document.body.classList.contains('reading'));
    else if (k === '?') openOverlay(help);
    else if (/^[1-4]$/.test(k) && SLIDES[state.i].type === 'map') focusMap(SLIDES[state.i].el, ORDER[Number(k) - 1]);
    else if ((k === 'Enter') && e.target.matches('[data-move]')) { e.preventDefault(); e.target.click(); }
  });

  /* touch: swipe left/right */
  let tx = null;
  stage.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener('touchend', (e) => {
    if (tx == null || document.body.classList.contains('reading')) return;
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
  document.documentElement.classList.add('ready');
  if (!TIMING.ok) console.warn('[deck] Timing check:', TIMING.problems.join(' '));

  window.__deck = { SLIDES, go, state, timing: TIMING };
})();
