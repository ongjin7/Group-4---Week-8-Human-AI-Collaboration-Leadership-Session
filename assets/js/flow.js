/* Shared by the audience deck and the presenter view:
   turns content/deck-data.js into an ordered list of slides with timings. */
(function () {
  'use strict';
  const D = window.DECK_DATA;

  const isTBC = (s) => typeof s === 'string' && /^\s*TBC\b/.test(s);
  const plain = (s) => (isTBC(s) ? 'TBC' : s);

  function buildSlides() {
    const agents = {};
    D.agents.forEach((a) => { agents[a.id] = a; });
    const out = [];
    D.flow.forEach((seg, si) => {
      if (seg.agent) {
        const a = agents[seg.agent];
        const q = D.quadrants[a.quadrant];
        const name = a.shortName || a.name;
        const split = seg.split || [80, 80, 80];
        const next = D.flow[si + 1];
        let handover;
        if (next && next.agent) {
          const na = agents[next.agent];
          const nq = D.quadrants[na.quadrant];
          const who = isTBC(na.presenter) ? 'the next presenter' : na.presenter;
          handover = `Hand over to ${who}: “Next, ${nq.position.toLowerCase()}: ${nq.title}.”`;
        } else {
          handover = 'Hand back for the comparison: “We will now look at how our answers to the map’s two questions placed each of our four agents, and what would move each one to another quadrant.”';
        }
        const base = { agentId: a.id, segId: seg.id, segLabel: seg.label, quadrant: a.quadrant, presenter: plain(a.presenter) };
        out.push(Object.assign({}, base, {
          id: `${a.id}-problem`, type: 'agent-problem', seconds: split[0],
          title: `${q.position} · ${name} · problem and card`,
          notes: a.notes && a.notes.problem,
          cue: 'Say the business problem in plain words before showing anything technical.'
        }));
        out.push(Object.assign({}, base, {
          id: `${a.id}-build`, type: 'agent-build', seconds: split[1],
          title: `${q.position} · ${name} · how it runs`,
          notes: a.notes && a.notes.build,
          cue: 'Press → to reveal each step. Gold = the person; dashed = AI generation; solid navy = fixed rule.'
        }));
        out.push(Object.assign({}, base, {
          id: `${a.id}-run`, type: 'agent-run', seconds: split[2],
          title: `${q.position} · ${name} · one run and its record`,
          notes: a.notes && a.notes.run,
          cue: handover
        }));
      } else {
        seg.slides.forEach((s) => out.push(Object.assign({}, s, { segId: seg.id, segLabel: seg.label })));
      }
    });
    D.appendix.forEach((s) => out.push(Object.assign({ seconds: 0 }, s, { appendix: true, segId: 'appendix', segLabel: 'Appendix' })));
    return out;
  }

  function fmt(sec) {
    const neg = sec < 0;
    sec = Math.abs(Math.round(sec));
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return (neg ? '−' : '') + m + ':' + String(s).padStart(2, '0');
  }

  /* Checks that the main flow adds up to the session length, segment by segment. */
  function timingReport(slides) {
    const main = slides.filter((s) => !s.appendix);
    const total = main.reduce((n, s) => n + (s.seconds || 0), 0);
    const problems = [];
    if (total !== D.meta.sessionSeconds) problems.push(`Main flow adds up to ${fmt(total)}, not ${fmt(D.meta.sessionSeconds)}.`);
    D.flow.forEach((seg) => {
      const sum = main.filter((s) => s.segId === seg.id).reduce((n, s) => n + s.seconds, 0);
      if (sum !== seg.seconds) problems.push(`${seg.label}: slides add up to ${fmt(sum)}, budget is ${fmt(seg.seconds)}.`);
    });
    let at = 0;
    main.forEach((s) => { s.startsAt = at; at += s.seconds; });
    D.flow.forEach((seg) => {
      const first = main.find((s) => s.segId === seg.id);
      seg.startsAt = first ? first.startsAt : 0;
    });
    return { total, ok: problems.length === 0, problems };
  }

  window.DeckFlow = { buildSlides, fmt, timingReport, isTBC };
})();
