# Evidence screenshots

One folder per agent: `expense/`, `crm/`, `leave/`, `mbairline/`.

Before adding a file here:

1. **Redact first.** Blur or box out real names, email addresses, phone numbers,
   customer identifiers, account IDs, API keys and webhook URLs. This folder is
   published with the website.
2. **Never add raw Zap history exports** (`.json`, `.har`). Keep them in
   `private/` (ignored by git) and screenshot only what you need.
3. **Keep the run identifier visible** (run ID or exact timestamp) on both the
   output screenshot and the Zap history screenshot. That shared value is what
   proves they show the same run.
4. Use PNG or WebP, at least 1600 px wide, so the detail survives zooming.

Then point to the file in `content/deck-data.js`, for example:

```js
record: {
  src: "assets/evidence/mbairline/zap-history-run.png",
  caption: "Zap history: same run",
  alt: "Zap history run detail showing the run ID and each step's status",
  focus: "70% 30%",   // the part to zoom into on the slide
  zoom: 1.6,          // 1 = whole screenshot
  pins: [{ x: 72, y: 28, n: 1, text: "Run ID matches the draft" }]
}
```
