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

- **Map**: click a quadrant to zoom into it (agent, job, the person’s role, our two answers);
  “Back to the map” or Esc returns.
- **How it runs**: → reveals the steps one at a time; “Show all steps” reveals everything.
  The person’s step is gold; AI generation is dashed; fixed rules are solid navy.
  “See it in Zapier” opens the Zap editor screenshot full screen once one is added.
- **Evidence**: click any screenshot to enlarge it; click again to zoom.
- **What would move each agent?**: click a card to step through change → which answer
  flips → resulting quadrant.

### Structure and timing

One idea per slide, nothing smaller than 22px. Each agent gets the same six slides,
so the class always knows what comes next:

1. **The problem**: a bold slide in the quadrant’s colour with both map answers and the business problem
2. **The agent card**: the five lines, large
3. **How it runs**: the workflow, revealed step by step
4. **One real run**: input and output screenshots, side by side
5. **Same run in Zap history**: one full-width screenshot plus the matching run ID
6. **The person**: who checks, what, when, and why this quadrant

The main flow is 30 slides and totals exactly **20:00**:

| Segment | Slides | Budget |
| --- | --- | --- |
| Opening | Title 0:20 · Two questions 0:40 · Map 0:60 | 2:00 |
| Each quadrant (×4) | Problem 0:30 · Card 0:35 · How it runs 0:45 · Run 0:40 · Zap history 0:30 · Person 0:60 | 4:00 |
| Comparison | How the person’s job changes 0:50 · Moves 0:55 · Closing question 0:15 | 2:00 |

The appendix (evidence status, MBairline testing lessons, placement checks, configuration
evidence, anticipated questions) is untimed and for Q&A. The presenter view warns if the
timings in `deck-data.js` stop adding up to 20:00.

## Edit the content

Everything is in `content/deck-data.js`, one block per agent, in this shape:

- `name`, `presenter`, `domain`, `oneLiner`
- `motif`: a faint line drawing on the agent’s opening slide: `"receipt"`, `"chat"`, `"calendar"` or `"plane"`
- `banner` (optional): a wide brand image across the top of the opening slide, like MBairline’s.
  Put a 1600 × 400 image in `assets/brand/` and set `banner: { src: "assets/brand/your-banner.jpg", alt: "…" }`
- `problem`: statement, who is affected, what is hard today, expected benefit
- `card`: job, trigger, tools, `never` (rule plus the setting that enforces it), checkpoint
- `workflow`: steps typed `trigger`, `ai`, `rule`, `action` or `human`
- `config`, `run.input`, `run.output`, `run.record`: screenshots
- `run.matchKey`: the run ID or timestamp shared by the output and the Zap history record
- `check`: who, what, when, if it fails (plus `options` for top-right; `prepares`/`decides` for bottom-right)
- `placement`: the answer to each map question, and why
- `move`: a workflow change, which question it changes, and where the agent lands
- `notes`: optional presenter notes per slide, keyed `intro`, `card`, `build`, `run`, `record`, `person`
  (any you leave out fall back to sensible defaults)

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
