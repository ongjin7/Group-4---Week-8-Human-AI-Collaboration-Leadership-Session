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
 *  - Timings are in seconds. The main flow must add up to exactly 1200
 *    (20 minutes); the presenter view warns you if it does not.
 *  - Notes are presenter-only. They appear in presenter.html, never on the
 *    audience screen.
 *  - Never paste raw Zap history JSON, real emails, phone numbers or
 *    customer identifiers into this file: it is published with the site.
 */
window.DECK_DATA = {
  meta: {
    title: "How does the task decide the person’s role?",
    subtitle: "Four Problem Set 5 agents, one per quadrant of the map",
    course: "Week 8 · Human–AI Collaboration · Problem-solving session",
    date: "Wednesday 21 October 2026",
    group: "Group 4",
    sessionSeconds: 1200,
    closingQuestion: "Which of our four agents would you place in a different quadrant, and why?"
  },

  members: [
    { name: "Jin", agent: "mbairline" },
    { name: "Revan", agent: "TBC" },
    { name: "Minh", agent: "TBC" },
    { name: "Adithi", agent: "TBC" }
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
    tl: { title: "A person leads, AI inside", q1: "yes", q2: "yes", role: "Signs off what the agent has checked", position: "Top-left" },
    tr: { title: "Agents run it, a person judges", q1: "no", q2: "yes", role: "Judges inside the process, choosing between options", position: "Top-right" },
    bl: { title: "AI alone, with checks", q1: "yes", q2: "no", role: "Spot-checks a sample on a set schedule", position: "Bottom-left" },
    br: { title: "A person decides, AI alongside", q1: "no", q2: "no", role: "Decides independently, using what the agent prepared", position: "Bottom-right" }
  },

  /* Order here = order of the four segments. */
  agents: [
    /* ------------------------------------------------------------ TOP-LEFT */
    {
      id: "expense",
      quadrant: "tl",
      name: "Expense claims agent",
      presenter: "TBC: Revan, Minh or Adithi",
      domain: "Finance",
      oneLiner: "Checks expense claims for out-of-pocket business spending.",
      problem: {
        statement: "TBC: The business problem in one plain sentence (what goes wrong with expense claims today?)",
        affected: "TBC: Who is affected (claimant, approver, finance team?)",
        difficulty: "TBC: What makes this hard today",
        benefit: "TBC: Expected benefit, described, not quantified unless you measured it"
      },
      card: {
        job: "TBC: The agent’s job in one line",
        trigger: "TBC: App + event that starts the Zap",
        tools: "TBC: Apps and actions, in order",
        never: { rule: "TBC: What the agent must never do", setting: "TBC: The Zap setting that enforces it" },
        checkpoint: "TBC: The exact step where the person signs off what the agent checked"
      },
      workflow: [
        { type: "trigger", label: "Claim submitted", detail: "TBC: trigger app + event" },
        { type: "ai", label: "AI checks the claim", detail: "TBC: what it checks against the evidence" },
        { type: "rule", label: "Fixed rule", detail: "TBC: any filter or path condition" },
        { type: "action", label: "Result recorded", detail: "TBC: where the check result goes" },
        { type: "human", label: "Person signs off", detail: "TBC: who approves, and in which app" }
      ],
      config: [
        { src: null, caption: "Zap editor: full workflow", missing: "Redacted screenshot of the Zap editor" },
        { src: null, caption: "Sign-off step", missing: "Screenshot of the step where approval happens" }
      ],
      run: {
        matchKey: { label: "Zap run ID / timestamp", value: "TBC: the run ID or exact timestamp shared by both screenshots" },
        input: { src: null, caption: "Input: the claim submitted", missing: "Anonymised claim + receipt used in this run" },
        output: { src: null, caption: "Output: the agent’s check", missing: "What the agent produced for that claim" },
        record: { src: null, caption: "Zap history: same run", missing: "Zap history detail showing the same run ID/timestamp" }
      },
      check: {
        who: "TBC: Role of the approver",
        what: "TBC: What they confirm in the agent’s check",
        when: "TBC: At which step, before what happens",
        ifFails: "TBC: What happens when they reject it"
      },
      placement: {
        q1: { answer: "yes", why: "TBC: Why a claim has one correct outcome under policy" },
        q2: { answer: "yes", why: "TBC: What the person knows that the agent cannot. The group site says: “only I know the rules”." },
        concern: "A person approving the agent’s check does not by itself show the work must be done together. Show what the person adds that the agent cannot, such as unwritten rules or exception decisions. If the agent can apply every rule and the person only samples results, it fits “AI alone, with checks”."
      },
      move: {
        change: "Write every claims rule into the agent (limits, receipts, categories) and have finance sample paid claims weekly.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "bl",
        caveat: "Deleting the sign-off alone would not move it. The move only holds if the agent genuinely holds all the rules."
      },
      notes: {
        problem: "TBC presenter. Say the business problem in plain words BEFORE showing anything technical. Name who is affected and what is hard today. Benefit: say ‘expected’ unless you measured it.",
        build: "Walk the steps with → . Point at the AI step versus the fixed rule. End on the sign-off step: this is the top-left signature, the person signs off what the agent has checked.",
        run: "Show the input, the output, then the Zap history record. Read the matching run ID or timestamp aloud. Then: who signs off, what they check, when, and what happens if they reject. Close with both map questions."
      }
    },

    /* ----------------------------------------------------------- TOP-RIGHT */
    {
      id: "crm",
      quadrant: "tr",
      name: "CRM scenario agent",
      presenter: "TBC: Revan, Minh or Adithi",
      domain: "Customer relationship management",
      oneLiner: "Recommends how to act in different customer scenarios, for a person to judge and choose.",
      problem: {
        statement: "TBC: The business problem in one plain sentence",
        affected: "TBC: Who is affected (account manager, customer?)",
        difficulty: "TBC: What makes choosing the right action hard today",
        benefit: "TBC: Expected benefit, described, not quantified unless measured"
      },
      card: {
        job: "TBC: The agent’s job in one line",
        trigger: "TBC: App + event that starts the Zap",
        tools: "TBC: Apps and actions, in order",
        never: { rule: "TBC: What the agent must never do", setting: "TBC: The Zap setting that enforces it" },
        checkpoint: "TBC: Where inside the process the person judges, and what the process does next"
      },
      workflow: [
        { type: "trigger", label: "Scenario arrives", detail: "TBC: trigger app + event" },
        { type: "ai", label: "AI analyses it", detail: "TBC: what it reads and classifies" },
        { type: "ai", label: "AI drafts options", detail: "TBC: the options it produces" },
        { type: "human", label: "Person judges", detail: "TBC: who chooses, and how the choice is recorded" },
        { type: "action", label: "Process continues", detail: "TBC: what the agent does with the chosen option" }
      ],
      config: [
        { src: null, caption: "Zap editor: full workflow", missing: "Redacted screenshot of the Zap editor" },
        { src: null, caption: "Judgment checkpoint", missing: "Screenshot of the step that waits for the person’s choice" }
      ],
      run: {
        matchKey: { label: "Zap run ID / timestamp", value: "TBC: the run ID or exact timestamp shared by both screenshots" },
        input: { src: null, caption: "Input: the customer scenario", missing: "Anonymised scenario used in this run" },
        output: { src: null, caption: "Output: options offered", missing: "The options the agent produced" },
        record: { src: null, caption: "Zap history: same run", missing: "Zap history detail showing the same run ID/timestamp" }
      },
      check: {
        who: "TBC: Role of the person who judges",
        what: "TBC: What they weigh up when choosing",
        when: "TBC: The step at which the process waits for them",
        ifFails: "TBC: What happens if no option is good enough",
        options: ["TBC: Option A from the run", "TBC: Option B", "TBC: Option C"]
      },
      placement: {
        q1: { answer: "no", why: "Many good versions: AI drafts, the person picks (group site)." },
        q2: { answer: "yes", why: "TBC: Show that the process cannot finish without the person’s judgment inside it." },
        concern: "Placement to confirm. If the agent only generates recommendations and the person then decides alone, the work is “Either can do it alone”, which is bottom-right, like MBairline. Top-right holds only if the agent runs a multi-step process and pauses at a checkpoint where the person’s judgment is needed before it continues."
      },
      move: {
        change: "The agent only lists recommendations and stops. The account manager decides and acts alone.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "br",
        caveat: "This is also the test of today’s placement: if the real Zap already works this way, it belongs in bottom-right now."
      },
      notes: {
        problem: "TBC presenter. Business problem first, in plain words. Then the card. Stress the checkpoint line: the person judges INSIDE the process.",
        build: "Walk the steps with → . Show the process the agent runs, then the judgment checkpoint, then what happens after the choice. Point out which steps are AI generation and which are fixed rules.",
        run: "Input → output → Zap history; read the matching run ID aloud. Name the ACTUAL options the person chose between in this run and which one they picked. Then both map questions. Be ready for: ‘why not bottom-right?’"
      }
    },

    /* --------------------------------------------------------- BOTTOM-LEFT */
    {
      id: "leave",
      quadrant: "bl",
      name: "HR leave report agent",
      presenter: "TBC: Revan, Minh or Adithi",
      domain: "Human resources",
      oneLiner: "Shares the HR leave report every day at a scheduled time.",
      problem: {
        statement: "TBC: The business problem in one plain sentence",
        affected: "TBC: Who uses the report",
        difficulty: "TBC: What is hard or slow without the agent",
        benefit: "TBC: Expected benefit, described, not quantified unless measured"
      },
      card: {
        job: "TBC: The agent’s job in one line",
        trigger: "TBC: Schedule (time and days)",
        tools: "TBC: Apps and actions, in order",
        never: { rule: "TBC: What the agent must never do", setting: "TBC: The Zap setting that enforces it" },
        checkpoint: "TBC: Who spot-checks the report, what they compare, how often"
      },
      workflow: [
        { type: "trigger", label: "Scheduled time", detail: "TBC: schedule and time zone" },
        { type: "action", label: "Leave data read", detail: "TBC: source of the leave records" },
        { type: "rule", label: "Fixed rules", detail: "TBC: how balances are calculated" },
        { type: "action", label: "Report shared", detail: "TBC: where and to whom" },
        { type: "human", label: "Spot check", detail: "TBC: who, what, how often" }
      ],
      config: [
        { src: null, caption: "Zap editor: full workflow", missing: "Redacted screenshot of the Zap editor" },
        { src: null, caption: "Schedule trigger", missing: "Screenshot of the schedule settings" }
      ],
      run: {
        matchKey: { label: "Zap run ID / timestamp", value: "TBC: the run ID or exact timestamp shared by both screenshots" },
        input: { src: null, caption: "Input: leave records", missing: "Anonymised leave data used in this run" },
        output: { src: null, caption: "Output: the report", missing: "The report as received, names redacted" },
        record: { src: null, caption: "Zap history: same run", missing: "Zap history detail showing the same run ID/timestamp" }
      },
      check: {
        who: "TBC: Role responsible for spot checks",
        what: "TBC: What they compare the report against",
        when: "TBC: How often (for example, one report a week)",
        ifFails: "TBC: What happens when a figure is wrong"
      },
      placement: {
        q1: { answer: "yes", why: "Rule-based: each leave figure has one correct value (group site: “Rule-based and fully automated”)." },
        q2: { answer: "no", why: "TBC: Confirm a person could produce the same report alone, and the agent does it unaided." },
        concern: "Confirm the run shows real processing, not only forwarding a sheet, and that a named person actually performs the spot check."
      },
      move: {
        change: "Instead of reporting balances, the agent recommends whose leave to approve in peak weeks.",
        question: "q1",
        from: "yes",
        to: "no",
        result: "br",
        caveat: "This changes the task itself. Who approves, and when, would then need to be decided again."
      },
      notes: {
        problem: "TBC presenter. Business problem first. The card’s checkpoint line is a SPOT CHECK: name who, what and how often.",
        build: "Walk the steps with → . This agent is mostly fixed rules: say so. Highlight that the person sits outside the run.",
        run: "Input → output → Zap history; read the matching run ID aloud. Then the spot check: who makes it, what they compare, how often, what happens when it is wrong."
      }
    },

    /* -------------------------------------------------------- BOTTOM-RIGHT */
    {
      id: "mbairline",
      quadrant: "br",
      theme: "mbairline",
      name: "MBairline Priority Guest Relations Assistant",
      shortName: "MBairline assistant",
      presenter: "Jin",
      domain: "Airline customer service",
      oneLiner: "Assesses Priority passenger feedback and prepares a report and reply draft for the customer service manager.",
      problem: {
        statement: "Priority passengers’ feedback needs a fast, personal follow-up that respects their contact consent.",
        affected: "The customer service manager, and Priority passengers waiting for a response.",
        difficulty: "Each response must be read, judged for urgency, checked for consent and answered personally.",
        benefit: "Every response arrives with an assessment, suggested next steps and a reply draft to review. Time saved has not been measured."
      },
      card: {
        job: "Analyse passenger feedback for the customer service manager, recommend follow-up actions and a guiding report, and prepare personalised customer email drafts.",
        trigger: "A new or updated response to the MB Airline Feedback Form (Google Forms).",
        tools: "Google Forms → AI by Zapier → Gmail report → Filter by Zapier → AI by Zapier → Gmail Create Draft",
        never: { rule: "Automatically send a customer reply.", setting: "The customer-facing Gmail step is Create Draft, not Send Email." },
        checkpoint: "The manager reviews the original feedback, consent, assessment and draft, then decides how to engage."
      },
      workflow: [
        { type: "trigger", label: "Feedback submitted", detail: "Google Forms: new or updated response" },
        { type: "ai", label: "AI assesses", detail: "Assessment, urgency and suggested next steps" },
        { type: "action", label: "Report emailed", detail: "Gmail: HTML report to the manager" },
        { type: "rule", label: "Filter", detail: "Continue only if follow-up AND email permission are both given" },
        { type: "ai", label: "AI drafts reply", detail: "Personalised reply to the passenger" },
        { type: "action", label: "Draft saved", detail: "Gmail Create Draft: never sent" },
        { type: "human", label: "Manager decides", detail: "How to engage, and whether to send" }
      ],
      config: [
        { src: null, caption: "Zap editor: full workflow", missing: "Redacted screenshot of the MBairline Zap editor" },
        { src: null, caption: "Filter conditions", missing: "Screenshot of the Filter by Zapier conditions" },
        { src: null, caption: "Gmail: Create Draft, not Send", missing: "Screenshot of the Gmail action event setting" }
      ],
      run: {
        matchKey: { label: "Zap run ID / timestamp", value: "TBC: run ID or timestamp. Jin’s agent card shows “18 October, finished 5:00 PM”; confirm in Zap history" },
        input: { src: null, caption: "Input: feedback form response", missing: "Form response for this run, passenger name and email redacted" },
        output: { src: null, caption: "Output: manager report + saved draft", missing: "The report email and the Gmail draft from this run" },
        record: { src: null, caption: "Zap history: same run", missing: "Zap history detail showing the same run ID/timestamp" }
      },
      check: {
        who: "The customer service manager (played by Jin in testing).",
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
        change: "The agent runs the investigation and follow-up across departments, with the manager judging at set checkpoints.",
        question: "q2",
        from: "no",
        to: "yes",
        result: "tr",
        caveat: "Adding approvals alone would not move it: the agent must take over a process the person then judges inside."
      },
      lessons: [
        { title: "Consent reversed", detail: "One report swapped email and mobile consent and recommended a call the passenger had declined.", status: "Reported in Jin’s PS5 write-up", evidence: { src: null, caption: "Annotated: consent fields in the input vs the report", missing: "The form response and the faulty report, side by side, redacted", pins: [] } },
        { title: "Inputs relabelled, retested", detail: "Each consent answer was labelled explicitly; a later run showed Email: Yes, Mobile: No and recommended email follow-up.", status: "Reported in write-up; screenshot TBC", evidence: null },
        { title: "HTML Yes/No broke the filter", detail: "HTML-formatted Yes/No answers caused exact-match filter conditions to fail.", status: "TBC: needs evidence before presenting", evidence: null },
        { title: "Satisfied customer flagged", detail: "One satisfied-customer case was wrongly flagged for personalised action.", status: "TBC: needs evidence before presenting", evidence: null },
        { title: "Review stays necessary", detail: "Every customer reply is reviewed by the manager before it is sent; the agent can only save drafts.", status: "Design choice: enforced by Create Draft", evidence: null }
      ],
      notes: {
        problem: "Jin. Open with the passenger, not the Zap: Priority feedback needs a fast, personal reply that respects consent. Name the manager as the person affected. Benefit is EXPECTED; we did not measure time saved. Read the ‘never’ line and its setting: Create Draft, not Send Email.",
        build: "Walk the seven steps with → . Two AI steps (assess, draft), one fixed rule (the filter needs both follow-up AND email permission), two Gmail actions. The gold step is the person: the manager decides, nothing goes out on its own.",
        run: "Input → output → Zap history; read the matching run ID / timestamp aloud. Who: the manager. What: feedback, consent, accuracy, tone, urgency, policy. When: on every report, before sending. If it fails: nothing is sent. Placement: no single right answer, and either could do it alone, so bottom-right. Mention the consent error (appendix) if asked."
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
        { id: "title", type: "title", seconds: 25, title: "Title",
          notes: "Welcome. One sentence: today we show four real agents and ask one question: how does the task decide what the person does?",
          cue: "“Our four agents sit together on this map, one per quadrant, and each works on a business problem in a different domain.”" },
        { id: "questions", type: "axes", seconds: 45, title: "The map’s two questions",
          notes: "Explain the two questions BEFORE any technical detail. Q1: is there a right answer? Q2: must people and AI do the work together? Name the two traps: a person checking output does not mean they must work together; and accountability alone does not separate the two right-hand quadrants.",
          cue: "Ask the room: ‘Which question do you think is harder to answer?’ Don’t wait long." },
        { id: "map", type: "map", seconds: 50, title: "Four agents, one map",
          notes: "All four agents on one map. One sentence each: domain and job. Click a quadrant only if you have time; the map reads without clicking. Then hand over to the top-left presenter.",
          cue: "Hand over: “Let’s start top-left, where a person leads with AI inside.”" }
      ]
    },
    { id: "seg-tl", label: "Top-left", agent: "expense", seconds: 240, split: [75, 75, 90] },
    { id: "seg-tr", label: "Top-right", agent: "crm", seconds: 240, split: [75, 75, 90] },
    { id: "seg-bl", label: "Bottom-left", agent: "leave", seconds: 240, split: [75, 75, 90] },
    { id: "seg-br", label: "Bottom-right", agent: "mbairline", seconds: 240, split: [75, 75, 90] },
    {
      id: "close", label: "Comparison", seconds: 120,
      slides: [
        { id: "compare", type: "compare", seconds: 55, title: "Both questions, four agents",
          notes: "Back to the full map. Read across the table: how our answers to the two questions placed each agent, and how the person’s job changes from signing off, to judging, to spot-checking, to deciding.",
          cue: "“We will now look at how our answers to the map’s two questions placed each of our four agents, and what would move each one to another quadrant.”" },
        { id: "moves", type: "moves", seconds: 50, title: "What would move each agent?",
          notes: "One concrete workflow change per agent. For each: which answer changes, and where it lands. Stress: removing an approval does not by itself move an agent; the work itself has to change.",
          cue: "Click a card to step through it only if time allows; all four read without clicking." },
        { id: "closing", type: "closing", seconds: 15, title: "Your turn",
          notes: "Read the question and stop talking. Questions follow; answer with evidence from our runs (appendix A1 lists them).",
          cue: "Read the question exactly, then pause." }
      ]
    }
  ],

  appendix: [
    { id: "a-evidence", type: "evidence-status", title: "A1 · Evidence status",
      notes: "Generated from the data file: every TBC and missing screenshot. Use it in rehearsal; hide or fill before Wednesday." },
    { id: "a-lessons", type: "lessons", agent: "mbairline", title: "A2 · MBairline testing lessons",
      notes: "Only claim what the records show. Items marked TBC need evidence before they are presented as facts." },
    { id: "a-placement", type: "placement", title: "A3 · Placement checks",
      notes: "Our own challenge to each placement. The CRM placement is the one most likely to be questioned." },
    { id: "a-config", type: "config", title: "A4 · Configuration evidence",
      notes: "All configuration screenshots in one place, for questions about how each Zap was built." },
    { id: "a-faq-1", type: "faq", title: "A5 · Anticipated questions", from: 0, to: 4 },
    { id: "a-faq-2", type: "faq", title: "A5 · Anticipated questions (cont.)", from: 4, to: 8 }
  ],

  faq: [
    { q: "Isn’t MBairline top-right, since the manager judges?",
      a: "Judgment happens in both right-hand quadrants. The difference is Q2: the agent completes its report and draft without the manager, and the manager decides independently afterwards. Nothing in the process waits for the manager’s judgment to continue." },
    { q: "Why is the CRM agent top-right and not bottom-right?",
      a: "TBC: Point to the step where the process waits for the person’s choice and continues with it. If no such step exists, we should move it to bottom-right." },
    { q: "If the expense approver only clicks ‘approve’, isn’t that AI alone, with checks?",
      a: "TBC: Show a run where the approver added something the agent could not, such as an exception or an unwritten rule. If they never do, bottom-left is the better fit." },
    { q: "How do you know the output screenshot came from that run?",
      a: "Each run slide pairs the output with its Zap history record and shows the shared run ID or timestamp. A screenshot alone would not prove it." },
    { q: "How much time does each agent save?",
      a: "We have not measured time saved. We can show what each run produced; savings are an expected benefit, not a result." },
    { q: "What happens when an agent is wrong?",
      a: "Each run slide has an ‘If the check fails’ line. For MBairline, the consent error in A2 is a real example: it was caught on review and the input labels were changed." },
    { q: "Would you trust the HR report without the spot check?",
      a: "TBC: Answer with the spot-check frequency and any error it has caught so far." },
    { q: "Which agent was hardest to place?",
      a: "TBC: Agree as a group. Suggested: the CRM agent, because recommendation alone looks like bottom-right." }
  ]
};
