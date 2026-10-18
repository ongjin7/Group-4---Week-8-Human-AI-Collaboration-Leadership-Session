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
    title: "How does the *task* decide the person’s role?",
    subtitle: "Four Problem Set 5 agents, one per quadrant of the map",
    course: "Week 8 · Human–AI Collaboration · Problem-solving session",
    date: "Wednesday 21 October 2026",
    group: "Group 4",
    sessionSeconds: 1200,
    closingQuestion: "Which of our four agents would you place in a *different* quadrant, and why?"
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
      motif: "receipt",
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
        change: "Every claims rule is written into the agent; finance samples paid claims weekly.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "bl",
        caveat: "Deleting the sign-off alone would not move it. The move only holds if the agent genuinely holds all the rules."
      },
      notes: {
        person: "The top-left signature: the person SIGNS OFF what the agent has checked. Show the exact step. Name who, what they check, when, and what happens if they reject. Then: right answer? Yes. Must work together? Yes, and say what the person knows that the agent cannot."
      }
    },

    /* ----------------------------------------------------------- TOP-RIGHT */
    {
      id: "crm",
      quadrant: "tr",
      name: "CRM scenario agent",
      presenter: "TBC: Revan, Minh or Adithi",
      domain: "Customer relationship management",
      motif: "chat",
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
        change: "The agent only lists recommendations; the account manager decides and acts alone.",
        question: "q2",
        from: "yes",
        to: "no",
        result: "br",
        caveat: "This is also the test of today’s placement: if the real Zap already works this way, it belongs in bottom-right now."
      },
      notes: {
        build: "Press → for each step. Show the process the agent runs, then the judgment checkpoint, then what the process does AFTER the person chooses. That ‘after’ is what makes it top-right.",
        person: "Name the ACTUAL options from this run and which one the person picked. Who judges, when, and what happens if no option fits. Then: right answer? No. Together? Yes, because the process waits for the person. Be ready for: ‘why not bottom-right?’"
      }
    },

    /* --------------------------------------------------------- BOTTOM-LEFT */
    {
      id: "leave",
      quadrant: "bl",
      name: "HR leave report agent",
      presenter: "TBC: Revan, Minh or Adithi",
      domain: "Human resources",
      motif: "calendar",
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
        build: "Press → for each step. This agent is mostly fixed rules: say so. The person sits outside the run.",
        person: "The spot check: who makes it, what they compare the report against, HOW OFTEN, and what happens when a figure is wrong. Then: right answer? Yes. Together? No: the agent runs alone."
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
      banner: { src: "assets/brand/mbairline-banner.jpg", alt: "MBairline aircraft above the clouds at sunset, with the MBairline Customer Feedback wordmark", position: "center 40%" },
      name: "MBairline Priority Guest Relations Assistant",
      shortName: "MBairline assistant",
      presenter: "Jin",
      domain: "Airline customer service",
      oneLiner: "Assesses Priority passenger feedback and prepares a report and reply draft for the customer service manager.",
      problem: {
        statement: "Priority passengers expect timely, personalised attention. Airlines need to understand passengers’ feedback quickly and respond appropriately.",
        affected: "Dedicated customer service teams supporting priority passengers, and passengers whose concerns require personalised attention.",
        difficulty: "Each response must be read, judged for urgency, checked for consent and answered personally.",
        benefit: "The agent summarises feedback, recommends next steps, and prepares a management report and, where appropriate and permitted, a personalised email draft. This reduces preparation effort while managers retain full control over decisions and sensitive customer interactions.",
        /* optional: where else the same pattern fits, and where it does not */
        alsoFor: [
          ["Private banking", "Personalised client follow-up"],
          ["Facilities management", "Defect review and prioritisation"],
          ["Luxury hotels", "Guest feedback and service recovery"]
        ],
        scope: "This approach serves selected customers or cases requiring individual attention. Reviewing every assessment and draft may be impractical for high-volume general enquiries, which would require different triage and escalation arrangements."
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
          note: "A test passenger, Kerry Tan, rates the flight 1 star, complains about the cabin crew and the food, and allows contact by email but not by mobile.",
          shots: [
            { src: "assets/evidence/mbairline/form-top.jpg", caption: "The feedback form", alt: "Feedback form with name Kerry Tan and a 1-star rating", focus: "50% 0%", zoom: 1.25,
              pins: [{ x: 23, y: 76.7, n: 1, side: "left", text: "1 star out of 5" }] },
            { src: "assets/evidence/mbairline/form-answers.jpg", caption: "Complaint and contact consent", alt: "Form answers: complaint about cabin crew and food; email contact Yes; mobile contact No", focus: "40% 74%", zoom: 1.6,
              pins: [{ x: 10, y: 66.8, n: 2, text: "Email contact: Yes" }, { x: 10, y: 93.1, n: 3, text: "Mobile contact: No" }] }
          ],
          say: "Meet Kerry, our test passenger. One star, a complaint about the crew and the food. Watch the two consent answers: email yes, mobile no."
        },
        {
          who: "Zapier", short: "Zap fires", title: "The Zap fires", time: "22:40:53",
          note: "The new form response triggers the Zap. AI assesses the feedback, Gmail emails a report, a Filter checks the conditions, AI drafts a reply, and Gmail saves it as a draft.",
          shots: [
            { src: "assets/evidence/mbairline/zap-editor.jpg", caption: "The six steps in the Zap editor", alt: "Zapier editor showing six steps",
              pins: [{ x: 97, y: 23.3, n: 1, ring: false, text: "AI assesses the feedback" }, { x: 97, y: 58.2, n: 2, ring: false, text: "Filter: follow-up AND email = Yes" }, { x: 97, y: 73.8, n: 3, ring: false, text: "AI drafts the reply" }, { x: 97, y: 89.5, n: 4, ring: false, text: "Create Draft, never Send" }] }
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
          who: "Manager", short: "Manager decides", title: "The manager decides", human: true,
          note: "The manager reads the report and the draft, checks consent and tone, and chooses the response.",
          options: [
            "Edit the apology and send it by email",
            "Refer the crew complaint to Cabin Crew, and the food to Food & Beverage",
            "Not a phone call: Kerry said no to mobile contact"
          ],
          say: "This is where the person decides. The agent prepared everything, but the manager chooses: send, edit, refer, or not. And no phone call, because Kerry said no."
        }
      ],
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
        change: "The agent runs the follow-up across departments; the manager judges at set checkpoints.",
        question: "q2",
        from: "no",
        to: "yes",
        result: "tr",
        caveat: "Adding approvals alone would not move it: the agent must take over a process the person then judges inside."
      },
      lessons: [
        { title: "Consent reversed", detail: "One report swapped email and mobile consent and recommended a call the passenger had declined.", status: "Reported in Jin’s PS5 write-up", evidence: { src: null, caption: "Annotated: consent fields in the input vs the report", missing: "The form response and the faulty report, side by side, redacted", pins: [] } },
        { title: "Inputs relabelled, retested", detail: "Each consent answer was labelled explicitly; a later run showed Email: Yes, Mobile: No and recommended email follow-up.", status: "Seen in the Kerry Tan run: the form said email Yes, mobile No, and so did the report (appendix A5)", evidence: null },
        { title: "HTML Yes/No broke the filter", detail: "HTML-formatted Yes/No answers caused exact-match filter conditions to fail.", status: "The live filter now checks “contains Yes” on the HTML value (A5, step 4). The original failure itself is not on record.", evidence: null },
        { title: "Satisfied customer flagged", detail: "One satisfied-customer case was wrongly flagged for personalised action.", status: "TBC: needs evidence before presenting", evidence: null },
        { title: "Review stays necessary", detail: "Every customer reply is reviewed by the manager before it is sent; the agent can only save drafts.", status: "Design choice: enforced by Create Draft", evidence: null }
      ],
      notes: {
        intro: "Jin. Open with the passenger, not the Zap: Priority feedback needs a fast, personal reply that respects consent. It helps dedicated priority-service teams and the passengers who need personal attention. It cuts preparation effort while the manager keeps full control (expected, not measured). The same pattern fits private banking, facilities defects and luxury hotels; it is not meant for high-volume general enquiries, which need different triage.",
        card: "Meet the MBairline assistant. Tap the card five times: the job, the trigger (a new feedback form), the tools, what it must never do (send a reply itself: the Gmail step is Create Draft, not Send Email), and where a person checks (the manager).",
        build: "Press → for each of the seven steps. Two AI steps (assess, draft), one fixed rule (the filter needs follow-up AND email permission), two Gmail actions. The gold step is the manager: nothing goes out on its own.",
        run: "What came in: one feedback form response (anonymised). What came out: the manager’s report and the saved draft.",
        record: "The proof, in three links. One: Zap history shows one successful run, 18 October at 10:40 pm. Two: that run’s input is Kerry Tan’s form. Three: its report has exactly the subject we saw in the manager’s inbox. So the form, report and draft are all this one run. Form to draft took 26 seconds. Every step with its time is in appendix A5.",
        person: "Who: the customer service manager. What: original feedback, consent, accuracy, tone, urgency, policy. When: every report, before anything is sent. If it fails: nothing is sent. Placement: no single right answer, and either could do it alone, so bottom-right. If asked about errors: the consent mix-up in appendix A2."
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
        { id: "questions", type: "axes", seconds: 40, title: "The map’s two questions",
          notes: "Explain the two questions BEFORE any technical detail. Q1: is there a right answer? Q2: must people and AI do the work together? Name the two traps: a person checking output does not mean they must work together; and accountability alone does not separate the two right-hand quadrants.",
          cue: "Ask the room: ‘Which question do you think is harder to answer?’ Don’t wait long." },
        { id: "map", type: "map", seconds: 60, title: "Four agents, one map",
          notes: "All four agents on one map. One sentence each: domain and job. Click a quadrant to zoom into it (Esc or “Back to the map” returns); the map also reads without clicking. Then hand over to the top-left presenter.",
          cue: "Hand over: “Let’s start top-left, where a person leads with AI inside.”" }
      ]
    },
    { id: "seg-tl", label: "Top-left", agent: "expense", seconds: 240, split: [30, 35, 45, 40, 30, 60] },
    { id: "seg-tr", label: "Top-right", agent: "crm", seconds: 240, split: [30, 35, 45, 40, 30, 60] },
    { id: "seg-bl", label: "Bottom-left", agent: "leave", seconds: 240, split: [30, 35, 45, 40, 30, 60] },
    { id: "seg-br", label: "Bottom-right", agent: "mbairline", seconds: 240, split: [30, 35, 40, 65, 20, 50] },
    {
      id: "close", label: "Comparison", seconds: 120,
      slides: [
        { id: "compare", type: "compare", seconds: 50, title: "Both questions, four agents",
          notes: "Back to the full map. Read across the table: how our answers to the two questions placed each agent, and how the person’s job changes from signing off, to judging, to spot-checking, to deciding.",
          cue: "“We will now look at how our answers to the map’s two questions placed each of our four agents, and what would move each one to another quadrant.”" },
        { id: "moves", type: "moves", seconds: 55, title: "What would move each agent?",
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
    { id: "a-trace", type: "run-trace", agent: "mbairline", title: "A5 · MBairline run trace",
      notes: "Proof, step by step: every step of the Kerry Tan run with the time it ran. Click any screenshot to enlarge it. Form to draft took 26 seconds." }
  ]
};
