/* Shared by the audience deck and the presenter view:
   turns content/deck-data.js into an ordered list of slides with timings. */
(function () {
  'use strict';
  const D = window.DECK_DATA;

  const isTBC = (s) => typeof s === 'string' && /^\s*TBC\b/.test(s);
  const plain = (s) => (isTBC(s) ? 'TBC' : s);

  /* Each agent segment is six simple slides, always in this order. */
  const AGENT_SLIDES = [
    { key: 'intro', type: 'agent-intro', label: 'the problem',
      notes: 'Name the business problem in plain words, who it helps and the expected benefit (say “expected”: nothing is measured). Say the quadrant and read both answers on the chips.',
      cue: 'Problem first, before any Zap.' },
    { key: 'card', type: 'agent-card', label: 'the agent card',
      notes: 'Introduce the agent like a character. Each tap unlocks one line of its card: mission, when it activates, its gear, its forbidden move (and the setting that locks it), and where it calls a human.',
      cue: 'Press → (or click the card) to tap it: each tap unlocks one of the five lines.' },
    { key: 'build', type: 'agent-build', label: 'how it runs',
      notes: 'Press → to reveal each step. Say which steps are AI (output can vary) and which are fixed rules. End on the gold step: the person.',
      cue: 'Press → for each step. Click “See it in Zapier” only if asked.' },
    { key: 'run', type: 'agent-run', label: 'one real run',
      notes: 'One real run: what came in, and what the agent produced. Click a screenshot to enlarge it if the room cannot read it.',
      cue: 'Point at the run ID or timestamp on the output.' },
    { key: 'record', type: 'agent-record', label: 'same run in Zap history',
      notes: 'The same run in Zap history. Read the run ID or timestamp aloud: it matches the output on the previous slide.',
      cue: 'Read the matching run ID aloud.' },
    { key: 'person', type: 'agent-person', label: 'the person',
      notes: 'Who checks, what they check, when, and what happens if it fails. Then the two map questions: why this quadrant.',
      cue: null }
  ];

  function buildSlides() {
    const agents = {};
    D.agents.forEach((a) => { agents[a.id] = a; });
    const out = [];
    let quadrantNo = 0;
    D.flow.forEach((seg, si) => {
      if (seg.agent) {
        quadrantNo += 1;
        const a = agents[seg.agent];
        const q = D.quadrants[a.quadrant];
        const name = a.shortName || a.name;
        const split = seg.split || [40, 40, 40, 40, 40, 40];
        const next = D.flow[si + 1];
        let handover;
        if (next && next.agent) {
          const na = agents[next.agent];
          const nq = D.quadrants[na.quadrant];
          const who = isTBC(na.presenter) ? 'the next presenter' : na.presenter;
          handover = `Hand over to ${who}: “Next, ${nq.position.toLowerCase()}: ${nq.title}.”`;
        } else {
          handover = 'Hand back: “We will now look at how our answers to the map’s two questions placed each of our four agents, and what would move each one to another quadrant.”';
        }
        AGENT_SLIDES.forEach((t, k) => {
          out.push({
            id: `${a.id}-${t.key}`, type: t.type, seconds: split[k] || 0,
            agentId: a.id, segId: seg.id, segLabel: seg.label, quadrant: a.quadrant, quadrantNo,
            presenter: plain(a.presenter),
            title: `${q.position} · ${name} · ${t.label}`,
            notes: (a.notes && a.notes[t.key]) || t.notes,
            cue: t.cue || handover
          });
        });
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
