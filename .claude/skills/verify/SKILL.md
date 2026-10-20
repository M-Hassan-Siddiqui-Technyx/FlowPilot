---
name: verify
description: Run every FlowPilot quality check — typecheck, lint, tests, build, the design-token/style-rule scan and the brief's final checklist — and report pass/fail with evidence. Use after finishing a section, before committing, and before submission.
---

Verify the project and report only what the evidence shows.

## 1. Automated checks

Run each command and capture any failure output verbatim:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`

## 2. Style-rule scan

Search `src/` with the Grep tool, using each pattern exactly as written and the file glob shown after it. Leave `src/index.css` out of the colour checks, because the `@theme` block is where literal values are allowed to live.

```text
Literal colours          glob *.{ts,tsx}   #[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(|oklch\(
Default palette colours  glob *.tsx        \b(bg|text|border|ring|fill|stroke|from|via|to|outline|decoration|divide|shadow)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b
Arbitrary values         glob *.tsx        [\w:]-\[[^\]]+\]
Arbitrary breakpoints    glob *.tsx        \b(min|max)-\[
Pixel media queries      glob *.css        @media[^{]*\d+px
Inline styles            glob *.tsx        style=\{\{
```

Judge every hit against the "Allowed exceptions" in `.claude/rules/styling.md`. Report each one as either a **violation** or a **justified exception**, with file:line. Hex matches inside `href="#…"` anchors are false positives, so ignore them.

## 3. Design fidelity

If the Figma MCP is connected, compare the sections in scope with `get_screenshot` against the page at the same width and list visible differences. Otherwise say "design fidelity not checked".

## 4. Final checklist

Go through the "Final checklist (brief §15)" in `docs/requirements.md` and mark every item:

- ✅ **verified:** name the test or command that proves it
- 🔍 **needs manual browser check:** say exactly what to check
- ❌ **not done or failing**

Console errors and warnings during interactions need a DevTools check at 375, 768 and 1440px, so mark those 🔍.

## 5. Report

1. A table of the commands and whether each passed or failed.
2. Style-rule violations, if there are any.
3. The design-fidelity verdicts.
4. The checklist with its marks.
5. One line: **ready to commit / not ready**, and why.
