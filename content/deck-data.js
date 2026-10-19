/*
 * Group 4 · Week 8 · Human–AI Collaboration Leadership Session
 * ------------------------------------------------------------
 * ALL presentation content lives in this file. Edit text here; you never
 * need to touch the layout code in assets/.
 *
 * Conventions
 *  - A string that starts with "TBC:" is a missing input. It renders as a
 *    visible amber "TBC" chip and is counted on the Evidence status slide.
 *    Replace the whole string (including "TBC:") once you have the real value.
 *  - Evidence items: set `src` to an image in assets/evidence/<agent>/ once
 *    you have a REDACTED screenshot. Leave `src: null` until then; the deck
 *    shows a labelled "Missing evidence" frame instead.
 *      focus: "x% y%"   point to zoom into (cropped detail view)
 *      zoom:  1–3       how far to zoom into that point on the slide
 *      pins:  [{ x: 0–100, y: 0–100, n: 1, text: "what to look at" }]
 *             x/y = the spot to circle; side: "left" puts the number tag on the left;
 *             ring: false shows only the number tag (for small screenshots)
 *  - Timings are in seconds. The main flow must add up to exactly 1200
 *    (20 minutes); the presenter view warns you if it does not.
 *  - Notes are presenter-only. They appear in presenter.html, never on the
 *    audience screen.
 *  - Never paste raw Zap history JSON, real emails, phone numbers or
 *    customer identifiers into this file: it is published with the site.
 */
window.DECK_DATA = {
  meta: {
    title: "Four *Agents*,\nFour *Roles* for People",
    subtitle: "Group 4’s take on exploring the Human–AI Collaboration Map",
    course: "Week 8 · Human–AI Collaboration · Problem-solving session",
    date: "Wednesday 21 October 2026",
    group: "Group 4",
    sessionSeconds: 1200,
    closingQuestion: "Which of our four agents would you place *differently*, and why?",
    closingTakeaway: "Two questions about the task — is there a right answer, and must people and AI work together — shape the workflow we build and the person’s role in it."
  },

  members: [
    { name: "Jin", agent: "mbairline" },
    { name: "Revan", agent: "expense" },
    { name: "Minh", agent: "crm" },
    { name: "Adithi", agent: "leave" }
  ],

  /* The professor’s map. Titles are used exactly as given. */
  axes: {
    q1: {
      short: "Right answer?",
      question: "Is there a right answer?",
      yes: "Work with a right answer",
      no: "No single right answer"
    },
    q2: {
      short: "Together?",
      question: "Must people and AI do the work together?",
      yes: "People and AI must work together",
      no: "Either can do it alone"
    }
  },

  quadrants: {
    tl: { title: "A person leads, AI inside", q1: "yes", q2: "yes", role: "Signs off what the agent has checked", position: "Top-left", compareRole: "The person signs off what the agent has checked." },
    tr: { title: "Agents run it, a person judges", q1: "no", q2: "yes", role: "Judges inside the process, choosing between options", position: "Top-right", compareRole: "The person judges options at required checkpoints within the process." },
    bl: { title: "AI alone, with checks", q1: "yes", q2: "no", role: "Spot-checks a sample on a set schedule", position: "Bottom-left", compareRole: "The person spot-checks accuracy on a defined schedule." },
    br: { title: "A person decides, AI alongside", q1: "no", q2: "no", role: "Decides independently, using what the agent prepared", position: "Bottom-right", compareRole: "The manager owns the case and can decide independently, using AI assessments and drafts as support." }
  },

  /* Order here = order of the four segments. */
  agents: [
    /* ------------------------------------------------------------ TOP-LEFT */
    {
      id: "expense",
      quadrant: "tl",
      motif: "receipt",
      catchphrase: "I verify, you sign off!",
      theme: "expense",
      banner: { src: "assets/brand/expense-banner.svg", alt: "Illustration: receipts from a trip and a client meal, a policy checklist with three ticks, a pre-check email to the line manager, and the manager signing off", position: "center top" },
      name: "Expense Claim Pre-Check",
      shortName: "Expense claims agent",
      mapName: "Expense Claim Pre-Check",
      presenter: "Revan",
      domain: "Finance",
      oneLiner: "Checks each claim against the expense policy; the line manager signs off.",
      problem: {
        statement: "Consultants often pay out of pocket for expenses during overseas trips or client meetups for business development. The claims officer needs an agent to help verify these claims before signing off.",
        affected: "Consultants waiting to be reimbursed, and the line manager who must sign off every claim.",
        difficulty: "Every claim has to be checked against the category limit, the 30-day deadline and the receipt rule before anyone signs.",
        benefit: "Each claim arrives already checked against the policy, with PASS or FAIL and the reasons, so the manager can spend their time on the receipt, the purpose and any exceptions.",
        scope: "A demo with made-up names and amounts. The rules cover four categories (Meal S$30, Taxi S$50, Client entertainment S$150, Medical S$300). The agent pre-checks; it never approves."
      },
      card: {
        job: "Check each staff expense claim against the company policy (category limit, 30-day deadline, receipt rule) and email the result to the line manager.",
        trigger: "A new claim on the Staff Expense Claim Google Form, which adds a row to the response sheet.",
        tools: "Google Forms → Google Sheets formulas → Zapier New Spreadsheet Row → Gmail Send Email",
        never: { rule: "Approve or reject a claim, or email an employee.", setting: "The Zap’s only action is Gmail Send Email, with the “To” field fixed to the manager’s address." },
        checkpoint: "The line manager reads each pre-check email within 2 working days, checks the receipt and the business purpose, then records the decision in the Manager sign-off column."
      },
      /* The rules are encoded in the sheet (fixed, same claim → same result); the Zap carries the result to the manager. */
      workflow: [
        { type: "trigger", label: "Claim submitted", detail: "Google Forms: a new row in the response sheet" },
        { type: "rule", label: "Policy rules applied", detail: "Sheet formulas: category limit, 30-day deadline, receipt rule → PASS or FAIL" },
        { type: "action", label: "Zap picks it up", detail: "Zapier: New Spreadsheet Row" },
        { type: "action", label: "Pre-check emailed", detail: "Gmail Send Email, “To” fixed to the line manager" },
        { type: "human", label: "Manager signs off", detail: "Checks receipt and purpose; records the decision in the sign-off column" }
      ],
      config: [
        { src: "assets/evidence/expense/zap-run-jack.png", caption: "The Zap: New Spreadsheet Row → Gmail Send Email", alt: "Zapier editor: step 1 Google Sheets New Spreadsheet Row, step 2 Gmail Send Email, run ID shown, run successful at 12:45:02 pm" },
        { src: "assets/evidence/expense/fix-formula.webp", caption: "The rules live in the sheet: the On time formula", alt: "Google Sheets formula for On time: FUTURE DATE if days to claim is below 0, OK if 30 days or fewer, otherwise LATE", focus: "25% 50%", zoom: 2 }
      ],
      run: {
        matchKey: { label: "Run ID", value: "01ba7a48… · Successful, 19 Oct, 12:45:02 pm · it picked up Jack’s row (12:42:57), the same time the email shows" },
        input: { src: "assets/evidence/expense/zap-run-jack.png", caption: "Input: Jack’s claim row" },
        output: { src: "assets/evidence/expense/email-jack-over.png", caption: "Output: the pre-check email" },
        record: { src: "assets/evidence/expense/zap-history.png", caption: "Zap history: the run" },
        /* Three linked views: the run in history, the same run opened (run ID + Jack's row), and the email with the same submission time. */
        recordShots: [
          { src: "assets/evidence/expense/zap-history.png", caption: "1 · The run: successful, 12:45 pm",
            alt: "Zap runs panel: 7 runs, the latest Successful on Oct 19, 2026 at 12:45 pm", focus: "50% 40%", zoom: 1.6,
            pins: [{ x: 3, y: 40.7, n: 1, ring: false, text: "Successful, 19 Oct 2026, 12:45 pm" }] },
          { src: "assets/evidence/expense/zap-run-jack.png", caption: "2 · Opened: run ID and Jack’s row",
            alt: "Zap run 01ba7a48-c306-a42d-560c-0774d01165c4, successful at 12:45:02 pm; step 1 data out: timestamp 10/19/2026 12:42:57, name Jack, amount 214, limit 150, OVER by S$64.00", focus: "62% 42%", zoom: 1.8,
            pins: [{ x: 52.9, y: 34.7, n: 2, ring: false, text: "Run ID 01ba7a48…, successful 12:45:02 pm" }, { x: 84, y: 40.8, n: 3, ring: false, text: "Row timestamp 12:42:57, name Jack" }] },
          { src: "assets/evidence/expense/email-jack-over.png", caption: "3 · Its email: submitted 12:42:57",
            alt: "Pre-check email: Submitted by Jack on 10/19/2026 12:42:57; FAIL: OVER by S$64.00", focus: "50% 15%", zoom: 1.6,
            pins: [{ x: 75, y: 11.3, n: 4, ring: false, text: "Same submission time as the row" }] }
        ]
      },
      /* One run, start to finish: Jack's S$214 client-entertainment claim. */
      journey: [
        {
          who: "Consultant", short: "Claim sent", title: "Jack submits a claim", time: "12:42:57",
          note: "Jack claims S$214 for client entertainment on a business proposal, with a receipt. The form adds a new row to the response sheet.",
          shots: [
            { src: "assets/evidence/expense/zap-run-jack.png", caption: "Jack’s claim, as the Zap read it", alt: "Step 1 data out: timestamp 10/19/2026 12:42:57, name Jack, date of expense 10/7/2026, category Client entertainment, purpose Business proposal, amount 214, receipt Yes", focus: "84% 52%", zoom: 2.2,
              pins: [{ x: 88, y: 44.8, n: 1, ring: false, text: "Jack" }, { x: 88, y: 52.9, n: 2, ring: false, text: "Client entertainment" }, { x: 88, y: 61, n: 3, ring: false, text: "S$214, receipt: Yes" }] }
          ],
          say: "Revan. Meet Jack, a consultant. He paid S$214 to entertain a client for a business proposal, and he has the receipt. He submits the claim form, and a new row lands in the sheet."
        },
        {
          who: "The sheet’s rules", short: "Rules check", title: "Three fixed rules check it",
          note: "Formulas in the sheet apply the policy the moment the row lands: the category limit, the 30-day deadline and the receipt rule. Client entertainment is capped at S$150, so Jack is S$64 over.",
          shots: [
            { src: "assets/evidence/expense/zap-run-jack.png", caption: "The checks on Jack’s row", alt: "Step 1 data out: limit 150, within limit OVER by S$64.00, days to claim 12, on time OK, receipt checked OK", focus: "84% 78%", zoom: 2.2,
              pins: [{ x: 88, y: 69.1, n: 1, ring: false, text: "Limit S$150" }, { x: 88, y: 73.1, n: 2, ring: false, text: "OVER by S$64.00" }, { x: 88, y: 81.2, n: 3, ring: false, text: "On time (12 days), receipt OK" }] }
          ],
          say: "No AI guessing here: the rules are written into the sheet. Same claim, same answer, every time. Client entertainment is capped at S$150, so Jack is S$64 over. He was on time, and the receipt rule is fine."
        },
        {
          who: "Zapier", short: "Zap fires", title: "The Zap picks it up and emails the manager", time: "12:45:02",
          note: "One trigger, one action: New Spreadsheet Row, then Gmail Send Email. The “To” field is fixed to the manager, so nothing reaches the employee.",
          shots: [
            { src: "assets/evidence/expense/zap-run-jack.png", caption: "Jack’s run in Zapier", alt: "Zapier: run ID 01ba7a48-c306-a42d-560c-0774d01165c4, successful at 12:45:02 pm; Google Sheets New Spreadsheet Row, then Gmail Send Email: sent 1 new message", focus: "52% 55%", zoom: 1.8,
              pins: [{ x: 64.5, y: 34.7, n: 1, ring: false, text: "Run ID 01ba7a48…" }, { x: 41.5, y: 53.2, n: 2, ring: false, side: "left", text: "New Spreadsheet Row" }, { x: 41.5, y: 73.2, n: 3, ring: false, side: "left", text: "Gmail: sent 1 message" }] }
          ],
          say: "The Zap is deliberately small: a new row starts it, and Gmail sends one email, always to the manager. It cannot approve anything and cannot email Jack."
        },
        {
          who: "Manager’s inbox", short: "Pre-check arrives", title: "The pre-check lands in the manager’s inbox",
          note: "The email shows the claim, each check and the result. The same rules gave Mei a PASS and Arjun a late FAIL.",
          shots: [
            { src: "assets/evidence/expense/email-jack-over.png", caption: "Jack: FAIL, over the limit", alt: "Pre-check email for Jack: FAIL: OVER by S$64.00; within category limit S$150: OVER by S$64.00; submitted within 30 days: OK; receipt: OK; your sign-off",
              pins: [{ x: 88, y: 21.8, n: 1, ring: false, text: "FAIL: OVER by S$64.00" }, { x: 88, y: 75.4, n: 2, ring: false, text: "Your sign-off: check receipt and purpose" }] },
            { src: "assets/evidence/expense/email-mei-pass.png", caption: "Another run: Mei, PASS", alt: "Pre-check email for Mei: S$23 meal, PASS",
              pins: [{ x: 88, y: 21, n: 3, ring: false, text: "Mei’s S$23 meal: PASS" }] },
            { src: "assets/evidence/expense/email-arjun-late.png", caption: "Another run: Arjun, LATE", alt: "Pre-check email for Arjun: S$45 taxi, FAIL: LATE (67 days)",
              pins: [{ x: 88, y: 21.1, n: 4, ring: false, text: "Arjun’s taxi, 67 days later: LATE" }] }
          ],
          say: "The manager gets this. FAIL, over by S$64, with every check spelled out. The same rules passed Mei’s S$23 meal and flagged Arjun’s taxi as 67 days late. But look at the bottom: your sign-off. The agent stops here."
        },
        {
          who: "Line manager", short: "Manager signs off", title: "The line manager signs off what the agent checked", human: true,
          note: "A FAIL is a flag, not a rejection. The manager checks what formulas can’t, decides whether an exception is justified, and records the decision.",
          panelLabel: "The person leads",
          panelTitle: "The line manager",
          options: [
            "Checks the receipt matches the amount and the date",
            "Checks the purpose is a genuine business expense",
            "Decides whether a FAIL deserves an exception, then signs off in the sheet within 2 working days"
          ],
          say: "This is top-left. The agent does the rule-checking, but the person leads. The manager checks what no formula can: is the receipt real, was this dinner really for business, does Jack’s S$64 deserve an exception? Then they sign in the Manager sign-off column."
        }
      ],
      check: {
        who: "The line manager.",
        what: "That the receipt matches the amount and date, that the purpose is a genuine business expense, and whether a FAIL deserves an exception.",
        when: "Within 2 working days of each pre-check email.",
        ifFails: "A FAIL is only a flag: the manager decides, and records the decision in the Manager sign-off column. The agent never approves or rejects."
      },
      placement: {
        q1: { answer: "yes", why: "Every check is a fixed policy rule: the same claim always gets the same result. Even the tricky case was a missing rule, not a judgement call." },
        q2: { answer: "yes", why: "The agent can’t tell whether a receipt is real or a dinner was really for business, and policy needs a named manager to approve. The manager starts from the checked result and adds that judgement." },
        concern: "If passing claims under S$20 were approved automatically with a monthly audit, it would move to “AI alone, with checks”. If the agent had to judge whether an expense was appropriate where no rule exists, the work would lose its right answer and move top-right."
      },
      move: {
        change: "Claims that pass and are under S$20 are approved automatically; finance audits them monthly.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "bl",
        caveat: "Hypothetical. Today every claim waits for the line manager’s sign-off."
      },
      /* Jack's run, step by step (Singapore time). Appendix proof. */
      trace: [
        { time: "12:42:57", step: "Claim submitted", src: "assets/evidence/expense/zap-run-jack.png", focus: "84% 45%", zoom: 2.6, note: "Row timestamp; name Jack; client entertainment; S$214" },
        { time: "12:45:01", step: "1 · New row picked up", src: "assets/evidence/expense/zap-run-jack.png", focus: "75% 22%", zoom: 2.4, note: "Google Sheets step ran at 12:45:01" },
        { time: "12:45:01", step: "The sheet’s rule results", src: "assets/evidence/expense/zap-run-jack.png", focus: "84% 77%", zoom: 2.6, note: "Limit 150 · OVER by S$64.00 · on time (12 days) · receipt OK" },
        { time: "12:45:02", step: "2 · Gmail: email sent", src: "assets/evidence/expense/zap-run-jack.png", focus: "52% 55%", zoom: 1.8, note: "Run ID 01ba7a48… · Successful · sent 1 new message" },
        { time: "12:45", step: "Zap history: Successful", src: "assets/evidence/expense/zap-history.png", focus: "50% 40%", zoom: 1.6, note: "The latest run, 19 Oct 2026" },
        { time: "Inbox", step: "The pre-check email", src: "assets/evidence/expense/email-jack-over.png", focus: "50% 15%", zoom: 1.5, note: "Submitted by Jack, 12:42:57 · FAIL: OVER by S$64.00" }
      ],
      /* Failure → fix → retest. Appendix only. */
      lessons: [
        { title: "A future-dated claim passed", detail: "A medical claim dated 11 days ahead got Days to Claim −11. Since −11 is under 30, On time said OK and the claim passed. The rule only checked for late claims.", status: "Predicted before the run; captured in “Tricky case test 2”", evidence: { src: "assets/evidence/expense/tricky-email-before.png", caption: "Before: a future date passes", alt: "Pre-check email for Tricky case test 2: medical claim dated 10/30/2026, submitted within 30 days (−11 days) OK, result PASS", pins: [{ x: 74, y: 63.8, n: 1, ring: false, text: "−11 days: OK" }] } },
        { title: "Fix: a future-date check", detail: "The On time formula now returns FUTURE DATE when Days to Claim is below 0.", status: "Formula change in the sheet (column K)", evidence: null },
        { title: "Retested: FAIL: FUTURE DATE", detail: "The same claim, resubmitted as “Trick case solution”, now fails.", status: "Rerun email on record", evidence: { src: "assets/evidence/expense/fix-email-after.png", caption: "After: the same claim fails", alt: "Pre-check email for Trick case solution: submitted within 30 days (−11 days) FUTURE DATE, result FAIL: FUTURE DATE", pins: [{ x: 78, y: 63, n: 2, ring: false, text: "FUTURE DATE" }] } },
        { title: "Successful runs, wrong emails", detail: "An empty column shifted every check one column to the right, so a 67-day-late taxi claim said “OK”. Deleting the column fixed it; Arjun’s later run of the same claim shows LATE.", status: "Error emails on record", evidence: null },
        { title: "A run can succeed and still be wrong", detail: "Zap history said Successful every time. Only comparing each email with its sheet row caught the error.", status: "Lesson from testing", evidence: null }
      ],
      notes: {
        intro: "Revan. Open with the consultant: they pay out of pocket on trips and client meetups, and the claims officer has to verify each claim before signing off. The agent pre-checks every claim against the policy; the manager still signs (expected benefit, not measured). Names and amounts are made up.",
        card: "Tap the card five times: the job (check each claim against three policy rules), the trigger (a new claim form), the tools (Forms, sheet formulas, Zapier, Gmail), what it must never do (approve, reject, or email an employee: its only action is an email to the manager), and where a person checks (the line manager, within 2 working days).",
        build: "Press → for each step. The rules are fixed formulas in the sheet: same claim, same answer. Zapier only carries the result to the manager. Last step: the manager signs off. The agent checks; the person leads.",
        run: "One real run: Jack’s S$214 client-entertainment claim, 19 October.",
        record: "The proof, in three links. One: Zap history shows a successful run at 12:45 pm. Two: opened, it has a run ID and picked up Jack’s row, submitted 12:42:57. Three: the email says submitted by Jack at 12:42:57, the same time. Testing, including the future-date bug and fix, is in the appendix.",
        person: "Who: the line manager. What: the receipt matches the amount and date, the purpose is genuine, and whether a FAIL deserves an exception. When: within 2 working days. If it fails: a FAIL is only a flag; the manager decides and signs in the sheet. Placement: right answer? Yes, fixed rules. Together? Yes: the agent can’t judge receipts or business purpose, and policy needs a named approver."
      }
    },

    /* ----------------------------------------------------------- TOP-RIGHT */
    {
      id: "crm",
      quadrant: "tr",
      motif: "chat",
      catchphrase: "I run it. You judge it!",
      theme: "crm",
      banner: { src: "assets/brand/crm-banner.svg", alt: "Illustration: a new customer’s banking app with the first deposit still to do, AI drafting an email, the CRM Manager approving it, and the email being sent", position: "center top" },
      name: "Banking CRM Onboarding Agent",
      shortName: "Banking CRM agent",
      mapName: "Banking CRM Onboarding Agent",
      presenter: "Minh",
      domain: "Digital banking CRM",
      oneLiner: "Runs first-deposit outreach; the CRM Manager approves each message before it is sent.",
      problem: {
        statement: "Some new digital-bank customers register but never finish onboarding or make their first deposit. Each may need different guidance, depending on what they have done so far.",
        affected: "New customers who need relevant help to get started, and the CRM Manager who must review every outgoing message.",
        difficulty: "Each case means reading the customer’s behaviour, picking a fitting campaign and writing a careful message with no invented offers.",
        benefit: "Faster preparation of relevant onboarding outreach, with the CRM Manager judging every message before it is sent. More first deposits is the intended outcome, not a measured result.",
        scope: "A prototype on synthetic customers: no real bank data, no measured first-deposit uplift, and eligibility is not yet checked against real transaction records."
      },
      card: {
        job: "Turn new-customer onboarding signals into personalised first-deposit emails for the CRM Manager to judge.",
        trigger: "A new row in Google Sheets with a synthetic case_id and user_status.",
        tools: "Google Sheets → Gemini → Code by Zapier → Filter by Zapier → Human in the Loop → Gmail",
        never: { rule: "Send an email without the manager’s approval, or target a customer who has already deposited.", setting: "Human in the Loop approval before Gmail, and a Filter that stops NO_CAMPAIGN cases." },
        checkpoint: "Step 5, just before Gmail: the CRM Manager reviews the options, the recommendation and the draft, then approves (email sent) or rejects (run stops)."
      },
      /* The six real Zap steps. The person sits INSIDE the process: Gmail runs only after they approve. */
      workflow: [
        { type: "trigger", label: "New customer case", detail: "Google Sheets: new row with case_id and user_status (synthetic)" },
        { type: "ai", label: "AI assesses and drafts", detail: "Gemini: likely barrier, three campaign options, a recommendation and an email draft" },
        { type: "action", label: "Output parsed", detail: "Code by Zapier: turns Gemini’s reply into fields" },
        { type: "rule", label: "Eligibility filter", detail: "Continue only if campaign status = SEND_FOR_APPROVAL" },
        { type: "human", label: "CRM Manager judges", detail: "Human in the Loop: Approve or Reject. The Zap waits here." },
        { type: "action", label: "Email sent", detail: "Gmail: sends the approved email (test inbox), only after Approve" }
      ],
      config: [
        { src: "assets/evidence/crm/zap-six-steps.webp", caption: "The six Zap steps, in an approved run", alt: "Zapier run showing six steps: Google Sheets, Gemini, Code by Zapier, Filter passed, Human in the Loop approved, Gmail sent 1 message" },
        { src: "assets/evidence/crm/approval-review-bank013.webp", caption: "Human in the Loop: the review screen", alt: "Request Approval step for BANK_013: approval request message, content to be reviewed, and Reject Campaign / Approve Campaign buttons" },
        { src: "assets/evidence/crm/earlier-filter-stops.webp", caption: "Filter stops a NO_CAMPAIGN case (earlier-version test)", alt: "Earlier Zap version: Filter by Zapier stopped the run because campaign status was NO_CAMPAIGN; approval and Gmail did not run" }
      ],
      run: {
        matchKey: { label: "Run", value: "18 Oct, 11:05 pm · Successful · BANK_013 input 23:05:10 → draft 23:05:21 → approval request 23:05:22 (no run ID shown, so matched by time)" },
        input: { src: "assets/evidence/crm/run-1-input-bank013.webp", caption: "Input: BANK_013’s onboarding status" },
        output: { src: "assets/evidence/crm/run-2-output-bank013.webp", caption: "Output: the draft, sent for approval" },
        record: { src: "assets/evidence/crm/run-history-bank013.webp", caption: "Zap history: the run" },
        /* Three linked views: the run, its input (BANK_013), and the approval request for the same customer one second after the draft. */
        recordShots: [
          { src: "assets/evidence/crm/run-history-bank013.webp", caption: "1 · The run: successful, 11:05 pm",
            alt: "Zap runs panel: Successful, Oct 18, 2026 23:05",
            pins: [{ x: 90, y: 80, n: 1, ring: false, text: "Successful run, 18 Oct 2026, 23:05" }] },
          { src: "assets/evidence/crm/run-1-input-bank013.webp", caption: "2 · Its input: BANK_013, 23:05:10",
            alt: "Run details for step 1 at 23:05:10: Row 22, case_id BANK_013, user_status KYC verified, signed up 3 days ago, viewed deposit instructions twice, no first deposit", focus: "40% 70%", zoom: 1.4,
            pins: [{ x: 70, y: 78.2, n: 2, ring: false, text: "case_id BANK_013" }] },
          { src: "assets/evidence/crm/approval-review-bank013.webp", caption: "3 · Its approval request, 23:05:22",
            alt: "Request Approval step: notification sent at Oct 18, 2026 23:05:22; content to be reviewed for Customer ID BANK_013",
            pins: [{ x: 50, y: 20.2, n: 3, ring: false, text: "Sent 23:05:22, one second after the draft" }, { x: 93, y: 30.1, n: 4, ring: false, text: "Same customer: BANK_013" }] }
        ]
      },
      /* The BANK_013 run, step by step (Singapore time). Appendix proof. */
      trace: [
        { time: "23:05", step: "Zap history: Successful", src: "assets/evidence/crm/run-history-bank013.webp", focus: "50% 75%", zoom: 1.4, note: "One successful run, 18 Oct 2026" },
        { time: "23:05:10", step: "1 · New row: BANK_013", src: "assets/evidence/crm/run-1-input-bank013.webp", focus: "40% 70%", zoom: 1.3, note: "KYC verified; viewed deposit instructions twice; no first deposit" },
        { time: "23:05:21", step: "2–3 · AI draft, parsed", src: "assets/evidence/crm/run-2-output-bank013.webp", focus: "40% 50%", zoom: 1.1, note: "Subject: Getting started: How to fund your new account · SEND_FOR_APPROVAL" },
        { time: "23:05:22", step: "5 · Approval requested", src: "assets/evidence/crm/approval-review-bank013.webp", focus: "40% 30%", zoom: 1.3, note: "Customer ID BANK_013, with Approve or Reject" }
      ],
      /* One run, start to finish. The person is stop 4, inside the process: Gmail (stop 5) only runs after they approve. */
      journey: [
        {
          who: "Customer data", short: "Case arrives", title: "A new customer case arrives", time: "23:05:10",
          note: "A synthetic customer, BANK_013, is KYC verified and signed up 3 days ago. They have viewed the deposit instructions twice but not made a first deposit.",
          shots: [
            { src: "assets/evidence/crm/run-1-input-bank013.webp", caption: "Step 1: the new Google Sheets row", alt: "Run details for step 1 at 23:05:10: case_id BANK_013, user_status KYC verified, signed up 3 days ago, viewed deposit instructions twice, no first deposit", focus: "50% 70%", zoom: 1,
              pins: [{ x: 97, y: 78.2, n: 1, ring: false, text: "Customer BANK_013 (synthetic)" }, { x: 97, y: 87.5, n: 2, ring: false, text: "Viewed the instructions twice, no deposit yet" }] }
          ],
          say: "Minh. Meet BANK_013, a synthetic new customer: verified, looked at the deposit instructions twice, still no first deposit. A new row in Google Sheets starts the Zap."
        },
        {
          who: "Gemini", short: "AI drafts", title: "AI reads the case and drafts an email", time: "23:05:21",
          note: "Gemini suggests the likely barrier, proposes campaigns, recommends one and drafts the email. SEND_FOR_APPROVAL lets the run past the Filter.",
          shots: [
            { src: "assets/evidence/crm/run-2-output-bank013.webp", caption: "BANK_013: the draft, waiting for review", alt: "Run output at 23:05:21: Manager Review Check Pending; Email Subject Getting started: How to fund your new account; email body; Campaign Status SEND_FOR_APPROVAL",
              pins: [{ x: 93, y: 45.7, n: 1, ring: false, text: "A how-to-fund email" }, { x: 64, y: 95.8, n: 2, ring: false, text: "SEND_FOR_APPROVAL: passes the Filter" }] },
            { src: "assets/evidence/crm/gemini-options-bank007.webp", caption: "A different run (BANK_007): three options, one recommended", alt: "Gemini output for a different customer, BANK_007: potential barrier, Campaign A technical support outreach, Campaign B guided onboarding tutorial, Campaign C status check, and a recommendation", focus: "50% 70%", zoom: 1.2,
              pins: [{ x: 76, y: 73, n: 3, ring: false, text: "Campaigns A, B and C" }] }
          ],
          say: "Gemini reads the case, suggests the barrier, proposes campaigns and recommends one. On the right is what those options look like, from a different customer. For BANK_013 it drafts a how-to-fund email and marks it SEND_FOR_APPROVAL."
        },
        {
          who: "Zapier", short: "Approval asked", title: "The Zap stops and asks the manager", time: "23:05:22",
          note: "The run pauses at Human in the Loop. Zapier emails the reviewer, and the review screen shows BANK_013’s behaviour, the likely barrier, the campaign options and the draft.",
          shots: [
            { src: "assets/evidence/crm/approval-notification.webp", caption: "Zapier asks for a review", alt: "Zapier email: A Zap requires your review to proceed. Approval request message asks to review the AI-generated onboarding campaign recommendation and approve or decline", focus: "50% 70%", zoom: 1.1,
              pins: [{ x: 40, y: 95.4, n: 1, ring: false, text: "Review step" }] },
            { src: "assets/evidence/crm/approval-review-bank013.webp", caption: "The review screen for BANK_013", alt: "Request Approval step: notification sent at 23:05:22; content to be reviewed for Customer ID BANK_013, stage, observed behaviour, potential barrier, Campaign Option A; Reject Campaign and Approve Campaign buttons",
              pins: [{ x: 92, y: 30.1, n: 2, ring: false, text: "BANK_013, sent 23:05:22" }, { x: 49, y: 96.2, n: 3, ring: false, text: "Reject or Approve" }] }
          ],
          say: "Now the Zap stops. It cannot send anything yet. Zapier emails the reviewer, and the review screen shows the customer, the barrier, the options and the draft, with two buttons: Reject or Approve."
        },
        {
          who: "CRM Manager", short: "Manager judges", title: "The CRM Manager judges, and the process waits", human: true,
          note: "The manager reviews the three options and the recommended draft, then approves or rejects that draft. They do not pick A, B or C directly.",
          panelLabel: "The person judges inside the process",
          panelTitle: "The CRM Manager",
          options: [
            "Checks customer fit, wording, unsupported offers or security claims, and business risk",
            "Approve: the Zap continues and Gmail sends the email",
            "Reject: the run stops and nothing is sent"
          ],
          say: "This is the top-right moment. The process waits for a person’s judgment. Approve and the agent carries on and sends; reject and it stops. To be precise: the manager approves or rejects the recommended draft, they don’t click to pick option B or C."
        },
        {
          who: "Customer’s inbox", short: "Email sent", title: "After approval, the email goes out",
          note: "The BANK_013 run ended Successful. The sent email has the same subject and wording as the draft at stop 2. A customer whose deposit failed got a different email: there is no single right answer.",
          shots: [
            { src: "assets/evidence/crm/email-education.webp", caption: "The how-to-fund email (test inbox)", alt: "Email from Bank: Getting started: How to fund your new account, pointing the customer to the step-by-step deposit guide", focus: "50% 40%", zoom: 1,
              pins: [{ x: 30, y: 14, n: 1, ring: false, text: "Same subject as the BANK_013 draft" }] },
            { src: "assets/evidence/crm/email-tech-support.webp", caption: "Another case (failed deposit): a different email", alt: "Email from Bank: Assistance with your recent deposit attempt, offering troubleshooting after a technical error", focus: "50% 40%", zoom: 1,
              pins: [{ x: 30, y: 13, n: 2, ring: false, text: "Failed deposit → support outreach" }] }
          ],
          say: "Only after approval does Gmail send. Same subject and wording as the draft. And a customer whose deposit failed gets a support email instead: different customers, different right moves."
        }
      ],
      check: {
        who: "The CRM Manager (in the prototype, the Zap owner acts as approver).",
        what: "The three campaign options, the recommendation and its reasoning, and the drafted email: customer fit, wording, unsupported offers or security claims, and business risk.",
        when: "Step 5: after the Filter, before Gmail sends.",
        ifFails: "Reject: the run stops and nothing is sent. Revising or rerouting the case is not built yet.",
        decisionLabel: "Reviews A/B/C, then approves or rejects the draft",
        options: ["Approve → Gmail sends", "Reject → the run stops"]
      },
      placement: {
        q1: { answer: "no", why: "An education email, a reminder or technical-support outreach can each be right; it depends on the customer’s behaviour." },
        q2: { answer: "yes", why: "In this workflow the agent runs every step, but the Zap stops at Request Approval: Gmail sends only after the CRM Manager approves." },
        concern: "If Gemini only proposed options and the manager ran every step alone, it would move bottom-right. It sits top-right because the agent runs the process and must stop for the manager’s judgment before it continues. The gate is a design choice, not proof that a person could not write the campaign alone."
      },
      move: {
        change: "The agent only suggests campaigns; the CRM Manager writes and sends the outreach themselves, with or without the suggestions.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "br",
        caveat: "Hypothetical. Today the Zap waits for the manager’s Approve or Reject before Gmail sends."
      },
      /* Failure → fix → retest. Appendix only. */
      lessons: [
        { title: "NO_CAMPAIGN still went to approval", detail: "BANK_012 had already deposited. Gemini correctly returned NO_CAMPAIGN, but the earlier Zap still asked for approval: a workflow-control fault, not an AI error.", status: "Before-fix screenshot", evidence: { src: "assets/evidence/crm/before-fix-wrong-approval.webp", caption: "Before the fix: BANK_012 still sent for approval", alt: "Earlier Zap: Gemini prompt for BANK_012 who already deposited; the Human in the Loop step is pending review" } },
        { title: "Fix: a Filter before approval", detail: "The Zap now continues only when campaign status = SEND_FOR_APPROVAL.", status: "Earlier-version test shows the Filter stopping a NO_CAMPAIGN run (appendix A1)", evidence: null },
        { title: "Retested", detail: "BANK_012_RETEST stopped before approval; BANK_013 went through approval and sending.", status: "Reported by Minh; the BANK_013 run is in Zap history at 23:05", evidence: null },
        { title: "Reject stops the run", detail: "When the manager rejects, nothing downstream runs and no email is sent.", status: "Earlier-version test", evidence: null },
        { title: "An unsupported security claim", detail: "An early draft offered bank-security assurances it could not back up. The prompt was tightened and human review kept.", status: "Reported by Minh; no screenshot", evidence: null }
      ],
      notes: {
        intro: "Minh. Open with the customer: some new digital-bank customers sign up but never make a first deposit, and each needs different help. It helps those customers and the CRM Manager who reviews every message. Faster, relevant outreach with the manager judging each one (expected, not measured). Say clearly: synthetic customers, a prototype, no measured uplift.",
        card: "Tap the card five times: the job, the trigger (a new Google Sheets row), the tools (six steps), what it must never do (send without approval, or target a customer who already deposited), and where a person checks (the CRM Manager, step 5, just before Gmail).",
        build: "Press → for each of the six real Zap steps. Sheets row, Gemini assesses and drafts, Code parses it, a Filter lets only SEND_FOR_APPROVAL through, then the CRM Manager judges, and only then Gmail sends. Stress the last step: the process carries on AFTER the person decides. That is what makes it top-right.",
        run: "One real run, BANK_013, 18 October at 11:05 pm.",
        record: "The proof, in three links. One: Zap history shows a successful run at 23:05. Two: its input is BANK_013 at 23:05:10. Three: the approval request for the same customer went out at 23:05:22, one second after the draft. No run ID is shown, so we match by time. Appendix A4 has every step; A5 has the failure, fix and retest.",
        person: "Who: the CRM Manager. What they decide: they review the three options and the recommendation, then approve or reject the recommended draft; they do not pick B or C directly. When: step 5, before Gmail. If it fails: reject, and the run stops. Placement: no single right answer, and in this workflow the process cannot finish without the person, so top-right. If asked ‘why not bottom-right?’: if Gemini only suggested and the manager did everything alone, it would be. Here the agent runs the process and waits for the judgment."
      }
    },

    /* --------------------------------------------------------- BOTTOM-LEFT */
    {
      id: "leave",
      quadrant: "bl",
      motif: "calendar",
      catchphrase: "I count. You spot-check!",
      theme: "leave",
      banner: { src: "assets/brand/leave-banner.svg", alt: "Illustration: a factory time clock, a tally of who is present, on leave and absent, the daily report email, and a Friday spot check with a magnifying glass", position: "center top" },
      name: "Daily Manpower Report",
      shortName: "Manpower report agent",
      mapName: "Daily Manpower Report",
      presenter: "Adithi",
      domain: "Human resources",
      oneLiner: "Emails HR the daily count of who is present, on leave or absent.",
      problem: {
        statement: "Every morning, HR at a manufacturing company compiles the manpower report by hand: pulling punch data, matching it against approved leave, and working out who is present, on leave or absent. It has to reach the time office, the manpower head and leadership before the day starts.",
        affected: "The HR team that compiles the report, and the time office, manpower head and leadership who need it before the day starts.",
        difficulty: "It is repetitive, error-prone and late on busy days.",
        benefit: "The daily manpower view lands in the inbox with no manual compiling, and is flagged when absenteeism goes above 10%.",
        scope: "A prototype with fictional data on the Zapier free plan. Punch and leave data are not live yet, and there is no team breakdown."
      },
      card: {
        job: "Email HR a daily manpower report: headcount, present, on leave, unplanned absence and absenteeism %.",
        trigger: "A new date row in the Daily Report tab of the Manpower Data Google Sheet, added each weekday at 10 AM by a schedule.",
        tools: "Google Sheets (New Spreadsheet Row) → Gmail (Send Email)",
        never: { rule: "Email anyone except HR.", setting: "The “To” field is fixed to one HR address." },
        checkpoint: "The HR executive checks one day’s numbers against attendance and leave records every Friday."
      },
      workflow: [
        { type: "trigger", label: "New date row", detail: "A schedule adds a row to the Daily Report tab each weekday, 10 AM" },
        { type: "rule", label: "Counts calculated", detail: "Sheet formulas: present, on leave, unplanned absence, absenteeism %" },
        { type: "action", label: "Zap picks it up", detail: "Zapier: New Spreadsheet Row" },
        { type: "action", label: "Report emailed", detail: "Gmail Send Email, “To” fixed to HR" },
        { type: "human", label: "Friday spot check", detail: "The HR executive checks one day against the records" }
      ],
      config: [
        { src: "assets/evidence/leave/zap-run.png", caption: "The Zap: New Spreadsheet Row → Gmail Send Email", alt: "Zapier editor for Daily Manpower report: step 1 Google Sheets New Spreadsheet Row, step 2 Gmail Send Email; run 01baa5ba successful at 02:45:57 pm" }
      ],
      run: {
        matchKey: { label: "Run ID", value: "01baa5ba… · Successful, 19 Oct, 2:45:57 pm · row 3 has the email’s exact numbers. Caveat: Gmail shows the email at 2:40 PM, before this run." },
        input: { src: "assets/evidence/leave/zap-run.png", caption: "Input: the 19 Oct row" },
        output: { src: "assets/evidence/leave/email-report.png", caption: "Output: the report email" },
        record: { src: "assets/evidence/leave/zap-run.png", caption: "Zap history: the run" },
        recordShots: [
          { src: "assets/evidence/leave/zap-run.png", caption: "1 · The run: successful, 2:45:57 pm",
            alt: "Zap run 01baa5ba-616d-a355-1414-4652a7f798c4, successful Oct 19, 2026 02:45:57 pm; Google Sheets then Gmail, sent 1 new message", focus: "52% 45%", zoom: 1.7,
            pins: [{ x: 65, y: 36.7, n: 1, ring: false, text: "Run ID 01baa5ba…, successful 2:45:57 pm" }] },
          { src: "assets/evidence/leave/zap-run.png", caption: "2 · Its input: the 19 Oct row",
            alt: "Step 1 data out: row 3, date 2026-10-19, headcount 100, present 92, on leave 3, unplanned absence 5, absenteeism 8.0%", focus: "85% 62%", zoom: 2.2,
            pins: [{ x: 92, y: 56.7, n: 2, ring: false, text: "2026-10-19" }, { x: 92, y: 79.5, n: 3, ring: false, text: "100 / 92 / 3 / 5 / 8.0%" }] },
          { src: "assets/evidence/leave/email-report.png", caption: "3 · The email: the same numbers",
            alt: "Email: Daily Manpower Report – 2026-10-19 – 8.0% absent; headcount 100, present 92, on approved leave 3, unplanned absence 5, absenteeism 8.0%; received 2:40 PM", focus: "50% 50%", zoom: 1,
            pins: [{ x: 36, y: 74, n: 4, ring: false, text: "Same numbers as row 3" }, { x: 72, y: 40.2, n: 5, ring: false, text: "2:40 PM: five minutes before the run" }] }
        ]
      },
      /* The 19 Oct run, step by step. Appendix proof. */
      trace: [
        { time: "14:45:57", step: "1 · New row picked up", src: "assets/evidence/leave/zap-run.png", focus: "85% 30%", zoom: 2.4, note: "Google Sheets step ran at 14:45:57 Singapore time" },
        { time: "14:45:57", step: "The sheet’s counts", src: "assets/evidence/leave/zap-run.png", focus: "85% 66%", zoom: 2.2, note: "19 Oct · headcount 100 · present 92 · on leave 3 · unplanned 5 · 8.0%" },
        { time: "2:45:57 pm", step: "2 · Gmail: report sent", src: "assets/evidence/leave/zap-run.png", focus: "52% 50%", zoom: 1.7, note: "Run ID 01baa5ba… · Successful · sent 1 new message" },
        { time: "Inbox", step: "The report email", src: "assets/evidence/leave/email-report.png", focus: "30% 50%", zoom: 1.4, note: "Same numbers as row 3; Gmail shows 2:40 PM, before the run" }
      ],
      /* One run, start to finish: the 19 Oct report. */
      journey: [
        {
          who: "The sheet", short: "Day’s row, counted", title: "The day’s row arrives, already counted", time: "14:45:57",
          note: "Formulas match punch data against approved leave. Every number can be checked against the records.",
          shots: [
            { src: "assets/evidence/leave/zap-run.png", caption: "The 19 Oct row, as the Zap read it", alt: "Step 1 data out: row 3, date 2026-10-19, headcount 100, present 92, on leave 3, unplanned absence 5, absenteeism 8.0%", focus: "85% 64%", zoom: 2,
              pins: [{ x: 92, y: 56.7, n: 1, ring: false, text: "19 Oct, headcount 100" }, { x: 92, y: 70.3, n: 2, ring: false, text: "92 present, 3 on leave, 5 unplanned" }, { x: 92, y: 79.5, n: 3, ring: false, text: "8.0% absent" }] }
          ],
          say: "Adithi. Every morning someone in HR builds this report by hand. Here, the day’s row lands in the sheet already counted: 92 present, 3 on approved leave, 5 unplanned, 8 percent. Fixed rules, one right answer, checkable against the punch and leave records."
        },
        {
          who: "Zapier → HR’s inbox", short: "Report emailed", title: "The Zap emails the report to HR", time: "2:45:57 pm",
          note: "Two steps: New Spreadsheet Row, then Gmail Send Email, fixed to one HR address. The counts arrive with the percentage in the subject.",
          shots: [
            { src: "assets/evidence/leave/zap-run.png", caption: "The run: Sheets → Gmail", alt: "Zapier: run ID 01baa5ba-616d-a355-1414-4652a7f798c4, successful at 02:45:57 pm; Google Sheets New Spreadsheet Row, then Gmail Send Email: sent 1 new message", focus: "52% 55%", zoom: 2.2,
              pins: [{ x: 59, y: 36.7, n: 1, ring: false, text: "Run ID 01baa5ba…, successful" }, { x: 61, y: 75.5, n: 2, ring: false, text: "Gmail: sent 1 message" }] },
            { src: "assets/evidence/leave/email-report.png", caption: "The report in HR’s inbox", alt: "Email: Daily Manpower Report – 2026-10-19 – 8.0% absent; headcount 100, present 92, on approved leave 3, unplanned absence 5, absenteeism 8.0%", focus: "0% 55%", zoom: 1.9,
              pins: [{ x: 40, y: 37, n: 3, ring: false, text: "8.0% absent, in the subject" }, { x: 26, y: 74, n: 4, ring: false, text: "92 · 3 · 5 · 8.0%" }] }
          ],
          say: "Two steps, no person in between. The row arrives, Gmail sends the report to HR, and that is what HR reads before the day starts. The headline number is right in the subject."
        },
        {
          who: "HR executive", short: "Friday check", title: "A person spot-checks, outside the run", human: true,
          note: "No one approves each report. Once a week, a person checks one day’s numbers against the records.",
          panelLabel: "The person checks, on a schedule",
          panelTitle: "The HR executive",
          options: [
            "Every Friday, picks one day’s report",
            "Checks its numbers against the attendance and leave records",
            "The agent only reads and reports: it never changes records or decides"
          ],
          say: "This is bottom-left. The agent runs alone every day. The person sits outside the run: every Friday, the HR executive checks one day against the records. HR could count by hand, and the agent counts alone: either can do it."
        }
      ],
      check: {
        who: "The HR executive.",
        what: "One day’s numbers against the attendance and leave records.",
        when: "Every Friday.",
        ifFails: "The agent only reads and reports; it never changes records, so any correction is made by HR."
      },
      placement: {
        q1: { answer: "yes", why: "The counts can be checked against punch and leave records. On 19 Oct: 92 present, 3 on leave, 5 unplanned, matching the answer key." },
        q2: { answer: "no", why: "HR could count by hand, and the agent produces the report alone with no judgement needed. A person only spot-checks." },
        concern: "If the agent recommended actions on high-absence days, the work would lose its single right answer and move right on the map."
      },
      move: {
        change: "On high-absence days, the agent recommends actions, such as moving staff between lines; the manpower head weighs them and decides.",
        question: "q1",
        from: "yes",
        to: "no",
        result: "br",
        caveat: "Hypothetical. Today the agent only counts and reports."
      },
      /* Failure → fix → retest. Appendix only. Run 2 and 3 screenshots are not on Adithi's site yet. */
      lessons: [
        { title: "12% absent, and nothing looked wrong", detail: "Run 2 (20 Oct, the tricky case) reported 12.0% absent, but the subject line looked like any other day. HR could miss it.", status: "Described on Adithi’s site; screenshot not provided yet", evidence: { src: null, caption: "Run 2: 12.0% absent, no warning", missing: "Run 2 email (not on Adithi’s site yet)" } },
        { title: "Fix: a Status flag", detail: "A Status column shows “⚠ ABOVE 10%” when absenteeism is over 10%, and it goes at the start of the subject.", status: "Sheet and subject-line change", evidence: null },
        { title: "Retested", detail: "Run 3 (20 Oct): “⚠ ABOVE 10% – Daily Manpower Report – 2026-10-20 – 12.0% absent”.", status: "Described on Adithi’s site; screenshot not provided yet", evidence: null },
        { title: "Run 1 matched the answer key", detail: "19 Oct: 92 present, 3 on leave, 5 unplanned, 8.0% absent, as the records say.", status: "Zap run and email on record", evidence: null },
        { title: "AI help needed checking too", detail: "The AI assistant gave the wrong day of the week, and the schedule showed UTC instead of Singapore time.", status: "From Adithi’s collaboration log", evidence: null }
      ],
      notes: {
        intro: "Adithi. Open with the HR person compiling the report by hand every morning: punch data, approved leave, who is in, who is out, before the day starts. The agent puts it in the inbox with no manual work (expected benefit, not measured). Fictional data, free plan.",
        card: "Tap the card five times: the job (a daily manpower report), the trigger (a new date row each weekday), the tools (Sheets and Gmail), what it must never do (email anyone but HR: the To field is fixed), and where a person checks (the HR executive, every Friday).",
        build: "Press → for each step. The counting is fixed formulas; Zapier only carries the result. The person is not inside the run: the Friday spot check happens on its own schedule.",
        run: "One real run: the 19 October report.",
        record: "The proof. The run has a run ID and succeeded at 2:45:57 pm; it read row 3, and those are exactly the numbers in the email. Be honest about one thing: Gmail shows the email at 2:40 PM, five minutes before this run, so it may be from a test of the same row. Every step is in the appendix.",
        person: "Who: the HR executive. How often: every Friday, one day. What: that day’s numbers against attendance and leave records. If wrong: the agent never changes records; HR corrects them. Placement: right answer? Yes, checkable counts. Together? No: HR could do it by hand and the agent does it alone."
      }
    },

    /* -------------------------------------------------------- BOTTOM-RIGHT */
    {
      id: "mbairline",
      quadrant: "br",
      theme: "mbairline",
      motif: "plane",
      avatar: "suit",
      catchphrase: "I advise. You lead and decide!",
      banner: { src: "assets/brand/mbairline-banner.svg", alt: "Illustration: an MBairline aircraft, a one-star feedback form with email Yes and mobile No, an AI report, a reply saved as a draft, and the manager making their own call", position: "center top" },
      name: "MBairline Priority Guest Relations Assistant",
      shortName: "MBairline feedback assistant",
      qaName: "Airline Feedback Assistant",
      movesName: "Airline feedback assistant",
      mapName: "Airline Priority Customer Feedback Assistant",
      cardName: "Airline Priority Customer Feedback Assistant",
      presenter: "Jin",
      domain: "Airline customer service",
      oneLiner: "Assesses priority-passenger feedback to assist the manager in customer handling.",
      problem: {
        statement: "Priority passengers expect timely, personalised attention. Airlines need to understand their feedback quickly and respond appropriately.",
        affected: "Dedicated ==customer service teams== supporting priority passengers, and ==passengers== whose concerns require personalised attention.",
        difficulty: "Each response must be read, judged for urgency, checked for consent and answered personally.",
        benefit: "The agent summarises feedback, recommends next steps, and prepares a management report and, where appropriate and permitted, a personalised email draft. This ==reduces preparation effort while managers retain full control over decisions and sensitive customer interactions.==",
        /* optional: where else the same pattern fits, and where it does not */
        alsoFor: [
          ["Private banking", "Personalised client follow-up"],
          ["Facilities management", "Defect review and prioritisation"],
          ["Luxury hotels", "Guest feedback and service recovery"]
        ],
        scope: "This approach serves selected priority customers or cases requiring individual attention. Reviewing every assessment and draft may be impractical for high-volume general enquiries, which would require different triage and escalation arrangements."
      },
      card: {
        job: "Analyse passenger feedback to recommend follow-up actions and prepare a personalised customer response email draft.",
        trigger: "A new or updated response to the MB Airline Feedback Form (Google Forms).",
        tools: "Google Forms → AI by Zapier → Gmail report → Filter by Zapier → AI by Zapier → Gmail Create Draft",
        never: { rule: "Automatically send a customer reply.", setting: "The customer-facing Gmail step is Create Draft, not Send Email." },
        checkpoint: "The manager checks the feedback and assessment and fully decides on service-recovery action. Agent only advises."
      },
      workflow: [
        { type: "trigger", label: "Feedback submitted", detail: "Google Forms: new or updated response" },
        { type: "ai", label: "AI assesses feedback", detail: "Assessment, urgency and suggested next steps" },
        { type: "action", label: "Report emailed", detail: "Gmail: HTML report to the manager" },
        { type: "rule", label: "Filter", detail: "Continue only if follow-up AND email permission are both given" },
        { type: "ai", label: "AI prepares an optional reply draft", detail: "Personalised reply to the passenger" },
        { type: "action", label: "Draft saved", detail: "Gmail Create Draft: never sent" }
      ],
      /* optional: on "How it runs", group the automated steps and show the person in their own panel */
      buildPanel: {
        groupLabel: "AI assistance: prepares information and drafts for the manager",
        title: "Manager owns the customer case",
        text: "Reviews the feedback, AI suggestions, and decides the response and service-recovery action. Can handle the case independently without AI."
      },
      config: [
        { src: "assets/evidence/mbairline/zap-editor.jpg", caption: "Zap editor: the six steps", alt: "Zapier editor showing six steps: Google Forms, AI by Zapier, Gmail Send Email, Filter by Zapier, AI by Zapier, Gmail Create Draft" },
        { src: "assets/evidence/mbairline/run-4-filter.jpg", caption: "Filter: continue only if both answers are Yes", alt: "Filter by Zapier run details: only continue if personalised action contains Yes AND email permission contains Yes; the run passed", focus: "40% 45%", zoom: 1.3 },
        { src: "assets/evidence/mbairline/step-6-create-draft.jpg", caption: "Gmail step 6: Create Draft, not Send", alt: "Zap step 6: Gmail, Create Draft, sent 1 new draft to Gmail" }
      ],
      run: {
        matchKey: { label: "Run", value: "18 Oct, 10:40 pm · input names Kerry Tan · report subject matches the inbox · 26 s, form to draft" },
        input: { src: "assets/evidence/mbairline/form-answers.jpg", caption: "Input: Kerry Tan’s feedback form" },
        output: { src: "assets/evidence/mbairline/manager-report.jpg", caption: "Output: the manager’s report" },
        record: { src: "assets/evidence/mbairline/zap-run-history.jpg", caption: "Zap history: the run and each step’s result" },
        /* Three linked views: the run, the input it carried (Kerry Tan), and the report subject that matches the inbox. */
        recordShots: [
          { src: "assets/evidence/mbairline/zap-run-history.jpg", caption: "1 · The run: successful, 10:40 pm",
            alt: "Zap runs panel: 1 run in the last 30 days, Successful, Oct 18, 2026 10:40 pm", focus: "20% 45%", zoom: 2.2,
            pins: [{ x: 37.5, y: 44.8, n: 1, ring: false, text: "Successful run, 18 Oct 2026, 10:40 pm" }] },
          { src: "assets/evidence/mbairline/run-1-form-data.jpg", caption: "2 · Its input: Kerry Tan’s form",
            alt: "Run details for step 1 at 22:40:53: First Name Kerry, Last Name Tan, email contact Yes, mobile contact No", focus: "30% 72%", zoom: 1.7,
            pins: [{ x: 16.4, y: 74.9, n: 2, text: "Kerry Tan, the same passenger" }] },
          { src: "assets/evidence/mbairline/run-3-report-email.png", caption: "3 · Its report: the inbox subject",
            alt: "Run details for step 3 at 22:41:02: subject MBairline | Priority Guest Feedback Report — Kerry Tan", focus: "35% 40%", zoom: 1.8,
            pins: [{ x: 56, y: 41.5, n: 3, ring: false, text: "Same subject as the email in the inbox" }] }
        ]
      },
      /* Every step of the Kerry Tan run, with the time it ran (Singapore time). Appendix proof. */
      trace: [
        { time: "22:40:53", step: "1 · Form response found", src: "assets/evidence/mbairline/run-1-form-data.jpg", focus: "35% 60%", zoom: 1.5, note: "Kerry Tan, 1 star, email Yes, mobile No" },
        { time: "22:41:01", step: "2 · AI assessment", src: "assets/evidence/mbairline/run-2-ai-assessment.jpg", focus: "40% 50%", zoom: 1.5, note: "Personalised action Yes, urgent Yes, email Yes, mobile No" },
        { time: "22:41:02", step: "3 · Report emailed", src: "assets/evidence/mbairline/run-3-report-email.png", focus: "40% 42%", zoom: 1.5, note: "Subject: MBairline | Priority Guest Feedback Report — Kerry Tan" },
        { time: "22:41:04", step: "4 · Filter passed", src: "assets/evidence/mbairline/run-4-filter.jpg", focus: "40% 42%", zoom: 1.3, note: "Both answers contain Yes, so the run continues" },
        { time: "22:41:18", step: "5 · AI drafts the reply", src: "assets/evidence/mbairline/run-5-ai-reply.jpg", focus: "40% 45%", zoom: 1.4, note: "“Dear Kerry, thank you for taking the time…”" },
        { time: "22:41:19", step: "6 · Draft saved", src: "assets/evidence/mbairline/run-6-draft-saved.jpg", focus: "25% 45%", zoom: 1.8, note: "Gmail label: DRAFT. Not sent." }
      ],
      /* One run, start to finish. Each stop is its own slide; → moves along the timeline.
         Shots: focus = the point to zoom into, zoom = how far, pins = numbered markers (x/y in % of the image). */
      journey: [
        {
          who: "Passenger", short: "Feedback sent", title: "Kerry leaves feedback", time: "22:40:32",
          note: "A first-class passenger, Kerry Tan, rates the flight 1 star, complains about the cabin crew and the food, and allows contact by email but not by mobile.",
          shots: [
            { src: "assets/evidence/mbairline/form-top.jpg", caption: "The feedback form", alt: "Feedback form with name Kerry Tan and a 1-star rating", focus: "50% 0%", zoom: 1.25,
              pins: [{ x: 23, y: 76.7, n: 1, side: "left", text: "1 star out of 5" }] },
            { src: "assets/evidence/mbairline/form-answers.jpg", caption: "Complaint and contact consent", alt: "Form answers: complaint about cabin crew and food; email contact Yes; mobile contact No", focus: "40% 70%", zoom: 1.6,
              pins: [{ x: 93, y: 46.5, n: 2, ring: false, text: "Complains about cabin crew and food" }, { x: 10, y: 66.8, n: 3, text: "Email contact: Yes" }, { x: 10, y: 93.1, n: 4, text: "Mobile contact: No" }] }
          ],
          say: "Meet Kerry Tan, a first-class passenger. One star, a complaint about the crew and the food. Watch the two consent answers: email yes, mobile no."
        },
        {
          who: "Zapier", short: "Zap fires", title: "The Zap fires", time: "22:40:53",
          note: "The new feedback triggers the Zap. AI assesses the feedback, Gmail emails a report, a Filter checks the conditions, AI drafts a reply, and Gmail saves it as a draft.",
          shots: [
            { src: "assets/evidence/mbairline/zap-editor.jpg", caption: "The six steps in the Zap editor", alt: "Zapier editor showing six steps",
              pins: [{ x: 97, y: 23.3, n: 1, ring: false, text: "AI assesses the feedback" }, { x: 97, y: 40.7, n: 2, ring: false, text: "Gmail emails report" }, { x: 97, y: 58.2, n: 3, ring: false, text: "Filter: follow-up AND email = Yes" }, { x: 97, y: 81.6, n: 4, ring: false, text: "AI drafts customer reply, never sends" }] }
          ],
          say: "No one presses a button. The form response starts the Zap: six steps, two of them AI."
        },
        {
          who: "Manager’s inbox", short: "Report arrives", title: "A report lands in the inbox", time: "22:41:02",
          note: "The manager receives an assessment with suggested next steps. The consent lines match Kerry’s form: email yes, mobile no.",
          layout: "stack",
          shots: [
            { src: "assets/evidence/mbairline/manager-inbox.jpg", caption: "The manager’s inbox", alt: "Gmail inbox showing the email MBairline | Priority Guest Feedback Report — Kerry Tan", focus: "75% 92%", zoom: 1.7 },
            { src: "assets/evidence/mbairline/manager-report.jpg", caption: "The report, written by AI", alt: "Report email: personalised action Yes, urgent Yes, email contact Yes, mobile contact No, and two recommended next steps", focus: "28% 49%", zoom: 2,
              pins: [{ x: 27.1, y: 41.3, n: 1, text: "Personalised action: Yes" }, { x: 24.3, y: 47, n: 2, text: "Email Yes, mobile No: matches the form" }, { x: 8.7, y: 57.2, n: 3, side: "left", text: "Suggested next steps" }] }
          ],
          say: "The manager gets this report. Point at the consent lines: email yes, mobile no, exactly what Kerry said. That is the consent bug we fixed in testing."
        },
        {
          who: "Drafts", short: "Reply drafted", title: "A reply waits in Drafts", time: "22:41:19",
          note: "Personalised action is Yes and email is allowed, so the Filter lets the run continue. AI writes a personal reply, and Gmail saves it as a draft: 26 seconds after the Zap picked up the form. Nothing is sent.",
          shots: [
            { src: "assets/evidence/mbairline/reply-draft.jpg", caption: "The personalised reply, saved as a draft", alt: "Gmail draft reply to Kerry Tan apologising and promising review by the Cabin Crew and Food and Beverage teams", focus: "50% 55%", zoom: 1.15,
              pins: [{ x: 8.6, y: 95, n: 1, text: "Not sent: waits for the manager" }] }
          ],
          say: "The filter saw yes and yes, so the agent drafted a reply. It sits in Drafts: the agent cannot press Send."
        },
        {
          who: "Manager", short: "Manager decides", title: "The manager decides and can handle the case independently.", human: true,
          note: "AI prepares the assessment and draft to reduce preparation effort; the manager can review the feedback, formulate a response, and act without the agent.",
          panelLabel: "The person is in control",
          panelTitle: "The Customer Service Manager",
          options: [
            "Can choose his next course of action based on information provided by the agent",
            "Can decide, using his own experience, what to do next",
            "Could also have done this entire process alone, with or without the agent"
          ],
          say: "The person is in control. The manager chooses the next course of action from what the agent provides, decides using their own experience, and could have done the whole process alone. AI only saves preparation effort. No single right answer, and either can do it alone: that is why it sits bottom-right."
        }
      ],
      check: {
        who: "The customer service manager.",
        what: "Original feedback, contact consent, factual accuracy, tone, urgency, and whether the recommendations follow airline policy.",
        when: "Each time a report arrives, before any reply leaves the drafts folder.",
        ifFails: "Nothing is sent: the manager edits or discards the draft and handles the follow-up directly.",
        prepares: "Assessment, suggested next steps, an internal report and a personalised reply draft.",
        decides: "How to engage the passenger, and whether, when and what to send."
      },
      placement: {
        q1: { answer: "no", why: "An unhappy passenger might need an apology, an investigation or a call where consent allows. The right response depends on judgment." },
        q2: { answer: "no", why: "A manager could do all of it manually, and the agent produces the report and draft unaided. Using both is faster, not required." },
        concern: "Human accountability is not what places it here. What matters is that the agent’s outputs are complete without the person, and the person decides independently."
      },
      move: {
        change: "The agent coordinates departmental follow-up, while required manager judgments determine how that process proceeds.",
        question: "q2",
        from: "no",
        to: "yes",
        result: "tr",
        caveat: "Today’s run shows the manager working independently; this coordination is not built."
      },
      lessons: [
        { title: "Consent reversed", detail: "One report swapped email and mobile consent and recommended a call the passenger had declined.", status: "Failure reported in Jin’s PS5 write-up; no screenshot of the faulty report", evidence: null },
        { title: "Fix: inputs relabelled, retested", detail: "Each consent answer was labelled explicitly; a later run showed Email: Yes, Mobile: No and recommended email follow-up.", status: "Seen in the Kerry Tan run: the form said email Yes, mobile No, and so did the report (appendix A8, steps 1–2)", evidence: { src: "assets/evidence/mbairline/manager-report.jpg", caption: "Retest: the report’s consent lines match the form", alt: "Report email for Kerry Tan: personalised action Yes, urgent Yes, email contact Yes, mobile contact No", focus: "28% 49%", zoom: 1.6, pins: [{ x: 24.3, y: 47, n: 1, text: "Email Yes, mobile No: matches the form" }] } },
        { title: "HTML Yes/No broke the filter", detail: "HTML-formatted Yes/No answers caused exact-match filter conditions to fail.", status: "The live filter now checks “contains Yes” on the HTML value (appendix A8, step 4: the Kerry Tan run passed it). The original failure itself is not on record.", evidence: null },
        { title: "Satisfied customer flagged", detail: "One satisfied-customer case was wrongly flagged for personalised action.", status: "Reported in Jin’s PS5 write-up; no screenshot", evidence: null },
        { title: "Review stays necessary", detail: "Every customer reply is reviewed by the manager before it is sent; the agent can only save drafts.", status: "Design choice: enforced by Create Draft", evidence: null }
      ],
      notes: {
        intro: "Jin. Open with the passenger, not the Zap: Priority feedback needs a fast, personal reply that respects consent. It helps dedicated priority-service teams and the passengers who need personal attention. It cuts preparation effort while the manager keeps full control (expected, not measured). The same pattern fits private banking, facilities defects and luxury hotels; it is not meant for high-volume general enquiries, which need different triage.",
        card: "Meet the MBairline feedback assistant. Tap the card five times: the job, the trigger (a new feedback form), the tools, what it must never do (send a reply itself: the Gmail step is Create Draft, not Send Email), and where a person checks (the manager).",
        build: "Press → for each of the six automated steps: this is AI assistance, preparing information and drafts for the manager. Two AI steps (it assesses the feedback, and prepares an optional reply draft), one fixed rule (the filter needs follow-up AND email permission), two Gmail actions. Last press: the manager panel. The manager owns the case, uses or rejects the suggestions, and could handle it without AI. Then say: no single right answer, and the manager can do it alone.",
        run: "What came in: one feedback form response (anonymised). What came out: the manager’s report and the saved draft.",
        record: "The proof, in three links. One: Zap history shows one successful run, 18 October at 10:40 pm. Two: that run’s input is Kerry Tan’s form. Three: its report has exactly the subject we saw in the manager’s inbox. So the form, report and draft are all this one run. Form to draft took 26 seconds. Every step with its time is in appendix A8.",
        person: "Who: the customer service manager. What: original feedback, consent, accuracy, tone, urgency, policy. When: every report, before anything is sent. If it fails: nothing is sent. Placement: no single right answer, and either could do it alone, so bottom-right. If asked about errors: one report once swapped email and mobile consent; it was caught on review and the input labels were fixed."
      }
    }
  ],

  /*
   * The 20-minute flow. Agent segments generate three slides each:
   * problem + card, build + execution, run + record + human judgment.
   */
  flow: [
    {
      id: "opening", label: "Opening", seconds: 120,
      slides: [
        { id: "title", type: "title", seconds: 20, title: "Title",
          notes: "Welcome. One sentence: today we show four real agents and ask one question: how does the task decide what the person does?",
          cue: "“Our four agents sit together on this map, one per quadrant, and each works on a business problem in a different domain.”" },
        { id: "map", type: "map", seconds: 100, title: "Four agents, one map",
          notes: "First name the two axes: they are the map’s two questions. Across: is there a right answer? Down: must people and AI do the work together? Then all four agents, one sentence each: domain and job. Click a quadrant to zoom into it (Esc or “Back to the map” returns); the map also reads without clicking. Then hand over to the top-left presenter.",
          cue: "Hand over: “Let’s start top-left, where a person leads with AI inside.”" }
      ]
    },
    { id: "seg-tl", label: "Top-left", agent: "expense", seconds: 240, split: [30, 35, 40, 65, 20, 50] },
    { id: "seg-tr", label: "Top-right", agent: "crm", seconds: 240, split: [30, 35, 40, 65, 20, 50] },
    { id: "seg-bl", label: "Bottom-left", agent: "leave", seconds: 240, split: [30, 35, 40, 65, 20, 50] },
    { id: "seg-br", label: "Bottom-right", agent: "mbairline", seconds: 240, split: [30, 35, 40, 65, 20, 50] },
    {
      id: "close", label: "Comparison", seconds: 120,
      slides: [
        { id: "compare", type: "compare", seconds: 45, title: "How our answers placed each agent",
          notes: "Back to the full map. Point at the answers in each cell: our two answers placed each agent (expense: yes, yes; CRM: no, yes; HR: yes, no; MBairline: no, no). Then how the job changes: across, losing the right answer turns verifying into choosing between options (signs off → judges); down, no longer having to work together turns being needed in every case into spot-checking or deciding independently. If asked: task complexity, clarity of rules, available evidence and the consequences of error shape how work is designed and checked. They inform the two questions; they are not extra axes. High importance does not automatically mean people and AI must work together. And missing data does not automatically mean there is no single right answer: separate an answer that cannot yet be verified from a decision with several reasonable outcomes.",
          cue: "“We will now look at how our answers to the map’s two questions placed each of our four agents, and what would move each one to another quadrant.”" },
        { id: "moves", type: "moves", seconds: 60, title: "What would move each agent?",
          notes: "Hypothetical redesigns, not things our agents do today. End on the takeaway line at the bottom. For each card: the change, which question flips, and where it lands. One answer changes, the other stays. Only Question 1 moves the HR agent; the other three change Question 2. Removing an approval does not by itself move an agent: the work has to change.",
          cue: "Say “hypothetical” once, then read the four destinations." },
        { id: "closing", type: "closing", seconds: 15, title: "Q&A",
          notes: "Read the question and stop talking. Questions follow; answer with evidence from our runs (the appendix has each run trace and its testing).",
          cue: "Read the question exactly, then pause." }
      ]
    }
  ],

  appendix: [
    { id: "appendix", type: "divider", title: "Appendix",
      items: [
        ["A1", "Configuration evidence"],
        ["Per agent", "Run trace: every step of one real run"],
        ["Per agent", "Failure, fix and retest: one example"]
      ],
      order: "In presentation order: Expense claims · Banking CRM · Manpower report · MBairline",
      notes: "End of the presentation. Everything after this is supporting material for questions only." },
    { id: "a-config", type: "config", title: "A1 · Configuration evidence",
      notes: "All configuration screenshots in one place, for questions about how each Zap was built." },
    { id: "a-trace-expense", type: "run-trace", agent: "expense", title: "A2 · Expense claims run trace", subtitle: "Every step of Jack’s run on record",
      notes: "Proof for the top-left run: Jack submits at 12:42:57, the Zap picks up the row at 12:45:01 and Gmail sends the pre-check at 12:45:02, under one run ID (01ba7a48…). Click any screenshot to enlarge it." },
    { id: "a-lessons-expense", type: "lessons", agent: "expense", title: "A3 · Expense claims testing", subtitle: "Failure, fix and retest",
      notes: "If asked what went wrong: Revan predicted a future-dated claim would slip through, and it did: −11 days counted as on time. The fix adds a FUTURE DATE check; the same claim then failed. Separately, an empty sheet column shifted every field in the emails while Zap history still said Successful: a run can succeed and still be wrong." },
    { id: "a-trace-crm", type: "run-trace", agent: "crm", title: "A4 · Banking CRM run trace", subtitle: "Every step of the BANK_013 run on record",
      notes: "Proof for the top-right run: Zap history at 23:05, the BANK_013 input at 23:05:10, the parsed draft at 23:05:21 and the approval request at 23:05:22. No run ID is shown, so the steps are matched by time and customer ID." },
    { id: "a-lessons-crm", type: "lessons", agent: "crm", title: "A5 · Banking CRM testing", subtitle: "Failure, fix and retest",
      notes: "If asked what went wrong: Gemini correctly said NO_CAMPAIGN for a customer who had already deposited, but the earlier Zap still asked for approval. A workflow-control fault, not an AI error. The fix was a Filter before approval. The filter screenshot is from an earlier Zap version; the retest is reported by Minh." },
    { id: "a-trace-leave", type: "run-trace", agent: "leave", title: "A6 · Manpower report run trace", subtitle: "Every step of the 19 Oct run on record",
      notes: "Proof for the bottom-left run: the row is picked up at 14:45:57 and Gmail sends at 2:45:57 pm under run ID 01baa5ba…. The email has row 3’s exact numbers, but Gmail shows 2:40 PM, five minutes earlier, so it may be from a test of the same row." },
    { id: "a-lessons-leave", type: "lessons", agent: "leave", title: "A7 · Manpower report testing", subtitle: "Failure, fix and retest",
      notes: "If asked what went wrong: on a 12% absence day the report looked like any other, so Adithi added a status flag that puts ⚠ ABOVE 10% at the start of the subject. The run 2 and run 3 screenshots are not provided yet; this is from Adithi’s write-up." },
    { id: "a-trace", type: "run-trace", agent: "mbairline", title: "A8 · MBairline run trace",
      notes: "Proof, step by step: every step of the Kerry Tan run with the time it ran. Click any screenshot to enlarge it. Form to draft took 26 seconds." },
    { id: "a-lessons-mb", type: "lessons", agent: "mbairline", title: "A9 · MBairline testing", subtitle: "Failure, fix and retest",
      notes: "If asked what went wrong: one report swapped email and mobile consent and recommended a call the passenger had declined. Fix: each consent answer is labelled explicitly; the Kerry Tan run shows the report matching the form. The HTML Yes/No filter now checks “contains Yes”. Say clearly which items are on record and which are only in the write-up." }
  ]
};
