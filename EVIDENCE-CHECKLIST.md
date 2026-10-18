# Evidence checklist

Status on 18 October 2026. Appendix slide **A1** in the deck shows the same thing, counted
live from `content/deck-data.js`.

Tick an item only when the real material is in the deck. A workflow diagram is not evidence
of a run, and an output screenshot proves nothing about a run until it is matched to the
Zap history record by run ID or timestamp.

## 0 · Group decisions (blocking)

- [ ] Confirm who builds which agent: Revan, Minh and Adithi are not yet matched to the expense, CRM and HR agents.
- [ ] Confirm all four agents exist as working Zaps with at least one successful run.
- [ ] Agree whether the CRM agent stays top-right (see section 2).
- [ ] Confirm any required course template or branding. None has been applied, so the deck uses its own editorial style.

## 1 · Top-left · A person leads, AI inside · Expense claims agent · presenter TBC

- [ ] Business problem, who is affected, what is hard today
- [ ] Five-line card: job, trigger, tools, never + enforcing setting, human checkpoint
- [ ] Workflow steps: trigger, AI check, any filter or path, action, sign-off
- [ ] Screenshot: Zap editor; screenshot: the sign-off step
- [ ] One run: input (anonymised claim), output (the agent’s check), Zap history record, shared run ID or timestamp
- [ ] Who signs off, what they check, when, what happens if they reject it
- [ ] **Placement evidence:** what the person adds that the agent cannot (unwritten rules? exceptions?). Without it, “AI alone, with checks” is the better fit.

## 2 · Top-right · Agents run it, a person judges · CRM scenario agent · presenter TBC

- [ ] Business problem, who is affected, what is hard today
- [ ] Five-line card
- [ ] Workflow: the process the agent runs, the judgment checkpoint, what happens after the choice
- [ ] Screenshot: Zap editor; screenshot: the step that waits for the person’s choice
- [ ] One run: input scenario, the **actual options** generated, the option chosen, Zap history record, shared run ID or timestamp
- [ ] Who judges, what they weigh, when, what happens if no option fits
- [ ] **Placement risk (unresolved):** if the agent only generates recommendations and the person decides afterwards, it is bottom-right (“A person decides, AI alongside”), the same as MBairline. Top-right needs the process to pause for the person’s judgment and continue with it. Judgment by a person, or accountability, does not on its own make it top-right.

## 3 · Bottom-left · AI alone, with checks · HR leave report agent · presenter TBC

- [ ] Business problem, who uses the report, what is hard today
- [ ] Five-line card (including the schedule)
- [ ] Workflow: schedule, data source, calculation rules, where the report goes
- [ ] Screenshot: Zap editor; screenshot: schedule settings
- [ ] One run: input data (anonymised), the report received (names redacted), Zap history record, shared timestamp
- [ ] Spot check: who, what they compare it against, **how often**, what happens when a figure is wrong
- [ ] Confirm the run does real processing, not only forwarding a sheet

## 4 · Bottom-right · A person decides, AI alongside · MBairline assistant · Jin

Already in the deck, taken from Jin’s published PS5 agent card: problem, five-line card,
seven-step workflow, check (who, what, when, if it fails), placement reasoning, move.

- [x] Screenshot: Zap editor (`zap-editor.jpg`)
- [ ] Screenshot: Filter by Zapier conditions
- [ ] Screenshot: Gmail action set to **Create Draft**, not Send Email
- [x] One run, shown as a five-stop journey (test passenger Kerry Tan): form (`form-top.jpg`, `form-answers.jpg`,
      email and phone redacted), manager’s inbox and report (`manager-inbox.jpg`, `manager-report.jpg`, sender address
      redacted), reply draft (`reply-draft.jpg`)
- [x] **Zap history record** (`zap-run-history.jpg`): one successful run on 18 Oct 2026 at 10:40 pm, every step green
- [x] Run time shown on the “Same run, in Zap history” slide
- [ ] Optional, to tie the screenshots to that exact run: the run’s step details showing Kerry Tan’s data
      (can go in the appendix as extra proof)
- [ ] Testing lessons (appendix A2):
  - [ ] Consent reversal: annotated before/after screenshot (reported in Jin’s write-up)
  - [ ] Retest showing Email: Yes, Mobile: No: screenshot (reported in write-up)
  - [ ] HTML Yes/No exact-match filter failure: **no record supplied yet**, so do not present it as fact
  - [ ] Satisfied customer wrongly flagged: **no record supplied yet**, so do not present it as fact
- [ ] Optional: confirm the MBairline brand colours (the deck uses navy `#0D2340` and gold `#C9A54A`)

## 5 · Claims to keep honest

- No agent has measured time or cost savings. Benefits are shown as “expected, not measured”.
- The “What would move each agent?” slide shows proposals for discussion, not changes made to any Zap.
- The Q1 and Q2 answers for the expense, CRM and HR agents are currently their assigned quadrants. Each needs its builder’s reasoning (`placement.why`) before it can be defended.

## 6 · Before Wednesday

- [ ] All `TBC` chips and “Missing evidence” frames replaced; A1 shows “Ready” across the board
- [ ] Full rehearsal with the presenter timer, with each agent under 4:00
- [ ] Export the PDF fallback (`tools/export-pdf.ps1`) and keep it on the presenting laptop
- [ ] Group agrees, then push and deploy
