---
name: log-ai-usage
description: Record a real Claude interaction as evidence for the assessment's AI-USAGE.md — a strong prompt, a weak prompt and its improvement, a rejected or modified Claude recommendation, a debugging case, or a decision the developer made — by appending it to docs/ai-log.md. Use right after such a moment, while the details are fresh.
argument-hint: <prompt|rejected|debug|decision> [short note]
---

Add a **$0** entry to `docs/ai-log.md`. Developer's note: $ARGUMENTS

## Rules

- Record only what actually happened in this session, or what the developer tells you. **Never invent** prompts, evidence, outputs or reasoning.
- Quote prompts word for word.
- **The developer's reasoning goes in the developer's words.** If the "why" isn't clear from the conversation, ask them, or leave `TODO (developer):` in its place. Don't write it for them.
- Include the concrete evidence: error text, test output, `file:line` references, commands that were run.
- Append the entry under `## Entries` with today's date, then tick any newly covered item in that file's "Coverage for AI-USAGE.md" list.

## Templates

**prompt**

```
### YYYY-MM-DD: Prompt: <topic>
- Prompt (verbatim):
- Agent/role used:
- Result:
- Strong or weak? Why:
- Improved version (if weak):
```

**rejected**

```
### YYYY-MM-DD: Rejected/modified recommendation: <topic>
- Claude suggested (quote or summary + file):
- Problem with it (wrong / incomplete / unnecessary / unsuitable):
- What was done instead:
- How it was verified:
```

**debug**

```
### YYYY-MM-DD: Debugging: <issue>
- Expected behaviour:
- Actual behaviour:
- Evidence inspected (console, state, props, form state, layout):
- Prompt given to Claude (verbatim):
- Fix (files):
- Verification (test / command / manual check):
```

**decision**

```
### YYYY-MM-DD: Decision: <topic>
- Decision:
- Options considered:
- Why (developer's words):
```

Also add a row to the table in `docs/decisions.md`.

When you're done, tell the developer which AI-USAGE.md items still have no entry.
