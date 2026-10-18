# Group 4 · Week 8 · Human–AI Collaboration Leadership Session

An interactive browser deck for our 20-minute session on **Wednesday 21 October 2026**:
four Problem Set 5 agents, one per quadrant of the map, followed by questions.

Members: Jin, Revan, Minh, Adithi.

| File | What it is |
| --- | --- |
| `index.html` | The audience deck |
| `presenter.html` | Presenter view: notes, cues, timers, run sheet |
| `content/deck-data.js` | **All content.** Edit this, not the layout code |
| `assets/evidence/<agent>/` | Redacted screenshots (see the README in that folder) |
| `EVIDENCE-CHECKLIST.md` | What is still missing before Wednesday |
| `tools/serve.ps1`, `tools/export-pdf.ps1` | Local preview and PDF export on Windows |

## Run it locally

No build step and no dependencies. Any static server works:

```bash
powershell -ExecutionPolicy Bypass -File tools/serve.ps1
```

Then open <http://localhost:5173/>. (Alternatives: `npx serve .` or `python -m http.server 5173`.)
After editing `content/deck-data.js`, hard-refresh the browser (Ctrl+Shift+R).

## Present it

1. Open the deck, press **F** for full screen on the projector.
2. Press **P** to open the presenter view in a second window, on your laptop screen.
   The two windows stay in sync: moving in either moves both.
3. In the presenter view, press **Start timer** when you begin.
   It shows the session clock, time on this slide against its budget, the segment
   budget, and whether you are ahead of or behind plan. Timers never move the slides.

| Key | Action |
| --- | --- |
| → / Space / PgDn | Next step, then next slide (clickers work) |
| ← / PgUp | Back |
| M | Jump to the map · on the map, 1–4 focuses a quadrant, Esc returns |
| O | All slides |
| R | Reading mode (all slides in one scrolling page; phones default to it) |
| ? | Shortcut list |

Interactions are optional: every slide reads correctly without clicking anything.

- **Map**: click a quadrant to focus its agent; “Back to full map” or Esc returns.
- **How it runs**: → reveals trigger → processing → action → the person, one step at a time;
  “Show all steps” reveals everything. The person’s step is gold; AI generation is dashed;
  fixed rules are solid navy.
- **Evidence**: click any screenshot to enlarge it; click again to zoom.
- **What would move each agent?**: click a card to step through change → which answer
  changes → resulting quadrant.

### Timing

The main flow is 18 slides and totals exactly **20:00**:

| Segment | Slides | Budget |
| --- | --- | --- |
| Opening | Title 0:25 · Two questions 0:45 · Map 0:50 | 2:00 |
| Top-left: A person leads, AI inside | Problem 1:15 · Build 1:15 · Run 1:30 | 4:00 |
| Top-right: Agents run it, a person judges | same split | 4:00 |
| Bottom-left: AI alone, with checks | same split | 4:00 |
| Bottom-right: A person decides, AI alongside | same split | 4:00 |
| Comparison | Both questions 0:55 · Moves 0:50 · Closing question 0:15 | 2:00 |

The appendix (evidence status, MBairline testing lessons, placement checks, configuration
evidence, anticipated questions) is untimed and for Q&A. The presenter view warns if the
timings in `deck-data.js` stop adding up to 20:00.

## Edit the content

Everything is in `content/deck-data.js`, one block per agent, in this shape:

- `name`, `presenter`, `domain`, `oneLiner`
- `problem`: statement, who is affected, what is hard today, expected benefit
- `card`: job, trigger, tools, `never` (rule plus the setting that enforces it), checkpoint
- `workflow`: steps typed `trigger`, `ai`, `rule`, `action` or `human`
- `config`, `run.input`, `run.output`, `run.record`: screenshots
- `run.matchKey`: the run ID or timestamp shared by the output and the Zap history record
- `check`: who, what, when, if it fails (plus `options` for top-right; `prepares`/`decides` for bottom-right)
- `placement`: the answer to each map question, and why
- `move`: a workflow change, which question it changes, and where the agent lands
- `notes`: presenter notes for each of the agent’s three slides

**Placeholders.** Any text starting with `TBC:` shows as an amber “TBC” chip, and any
screenshot with `src: null` shows as a striped “Missing evidence” frame. Both are counted
on appendix slide A1. Replace them; never disguise them.

**Guards built in.** The deck flags a placement whose two answers point to a different
quadrant, and a “move” whose changed answer would not land where the card says.

## Static fallback (PDF)

Before the session, with the local server running:

```bash
powershell -ExecutionPolicy Bypass -File tools/export-pdf.ps1
```

This writes `exports/deck.pdf`: one 16:9 page per slide, with every step revealed.
Or open the deck in Chrome or Edge and print it, with Layout: Landscape, Margins: None,
and Background graphics turned on. Keep the PDF on the presenting laptop in case the
browser deck fails. `exports/` is git-ignored because drafts may contain placeholders.

## Deploy

The site is static, like our Problem Set 5 sites on Vercel (`vercel.json` keeps clean URLs).

1. Commit and push to `main` on GitHub.
2. In Vercel: **Add New → Project →** import this repository. Framework preset: **Other**,
   no build command, output directory: the repository root.
3. The deck is at `/`; the presenter view is at `/presenter` (it is not indexed by search engines,
   but anyone with the link can open it, so keep nothing private in the notes).

Do not deploy until the group has agreed. Everything in this repository becomes public.

## Privacy rules

- Redact names, emails, phone numbers and customer identifiers from screenshots before adding them.
- Never commit raw Zap history exports (`.json`, `.har`): keep them in `private/`, which git ignores.
- Use fictional or anonymised customer examples on slides.
