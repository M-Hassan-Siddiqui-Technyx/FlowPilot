# AI Usage

FlowPilot was built with Claude Code as a **structured, verified workflow**: three defined roles, one section or one issue per prompt, and no claim accepted without evidence. Everything below is taken from the real session record. Prompts are quoted verbatim, and every bug, rejection and decision is traceable in [`docs/decisions.md`](docs/decisions.md) (D-1 … D-39) and [`docs/ai-log.md`](docs/ai-log.md).

## At a Glance

| Brief requirement (§10–§13) | Where it is covered |
| --- | --- |
| Three Claude roles with prompts | [Agents / Roles](#agents--roles) and [Prompting Approach](#prompting-approach) |
| One strong prompt, and why it worked | [Strong Prompt](#strong-prompt) |
| One weak prompt and its improved version | [Weak Prompt and Improved Version](#weak-prompt-and-improved-version) |
| A rejected or modified recommendation, and why | [Rejected / Modified Recommendation](#rejected--modified-claude-recommendation) and [Where Claude Was Wrong](#where-claude-was-wrong-and-how-it-was-caught) |
| A debugging example: problem, evidence, prompt, fix, verification | [Debugging Example](#debugging-example) |
| Where Claude helped most | [Where Claude Helped Most](#where-claude-helped-most) |
| A meaningful decision I made myself | [A Decision I Made Myself](#a-decision-i-made-myself) |

| Evidence | Numbers |
| --- | --- |
| Behaviour tests | **52** in 10 files (`npm test`). Every test added in the late rounds was mutation-checked: the code was broken on purpose to prove the test fails. |
| Independent QA reviews | **3** runs of the Reviewer/QA agent, which found **10** real issues, all fixed |
| Logged decisions | **39** in `docs/decisions.md`, each with the reason, the alternatives and who decided |
| Design verification | Every section diffed against its Figma frame (pixel diff plus a typography/position audit); interactions measured in a real Chrome at 375 / 768 / 1440 |
| Quality gates on every change | `npm run typecheck`, `npm run lint`, `npm test` (plus `npm run build` before hand-off) |

## Agents / Roles

The three roles from the brief are Claude Code sub-agents in [`.claude/agents/`](.claude/agents/). Each file is the role's standing prompt: role, context, rules, process and expected output. All three share one contract ([`docs/requirements.md`](docs/requirements.md)) and one rule set ([`CLAUDE.md`](CLAUDE.md), [`.claude/rules/`](.claude/rules/): design tokens only, React/TS conventions, accessibility, forms, testing), so their outputs stay consistent.

| Role | Responsibility | Initial prompt | How it was used |
| --- | --- | --- | --- |
| **Project Planner** | Understand the requirements, review the Figma file, break the page into sections and components, find reuse, order the work, flag risks. Writes only `docs/plan.md`, no code. | [`project-planner.md`](.claude/agents/project-planner.md): *"You are the **Project Planner** for FlowPilot…"*, ending on the rule *"a plan that gets working, verified behaviour shipped beats a plan that aims for polish."* | Its process was followed in the main session: every Figma frame's spec read first, then the page built strictly in order (header → hero → logos → features → tabs → testimonials → pricing → contact → footer). |
| **Frontend Implementation Agent** | React, TypeScript, Tailwind (tokens only), responsive layout, state, React Hook Form validation, interactions, debugging and tests, **one scoped section or bug at a time**. | [`frontend-implementer.md`](.claude/agents/frontend-implementer.md): *"You are the **Frontend Implementation Agent** for FlowPilot… You write production-quality React and TypeScript that a junior developer must be able to explain line by line."* | Used for every section and bug. The prompt forces one loop: restate the acceptance criteria → implement with tokens → typecheck / lint / test → compare with Figma → list what the developer must check at 375 / 768 / 1440. |
| **Reviewer / QA Agent** | An independent, read-only review of responsiveness, accessibility, React structure, TypeScript, validation, interactions, tokens, maintainability and bugs. | [`reviewer-qa.md`](.claude/agents/reviewer-qa.md): *"You are the **Reviewer / QA Agent** for FlowPilot… You did not write this code. Review it sceptically."* | Three scoped runs: header → features, tabs → footer, then the rem refactor and the two footers. Findings are listed below. |

**What the QA agent caught (all fixed):**

- The menu toggle was labelled "Close menu" while open but did nothing when clicked.
- Content behind the open menu wasn't `inert`.
- Focus was lost after "Send another message".
- Required fields weren't announced (`aria-required`).
- A fixed tab-panel height clipped copy at 320px.
- Inactive slider dots had 1.29:1 contrast.
- Autoplay counted the slider as "in view" at any overlap instead of 50%.
- Small desktops rendered at 0.75× (8.25px form text at 1024).
- A classic Windows scrollbar pushed the contact card 17px into the gutter.
- The docs claimed "zoom still works", which wasn't fully true.

## Prompting Approach

Task prompts follow the brief's guidance: **role, task, context, requirements and expected output**. Two habits kept them small: one section or one issue per prompt, never the whole site; and naming the deliberate design decisions, so an agent evaluates them instead of "fixing" them.

A real task prompt given to the Reviewer/QA agent (abridged; `[…]` marks cuts):

> **Role:** independent Reviewer/QA for the FlowPilot landing page (React 19 + TS strict + Tailwind 4 tokens + Vitest/RTL). Read-only: report findings, never edit files.
>
> **Scope:** ONLY the first four built sections and their shared primitives: […] Header.tsx, MobileNav.tsx, Header.test.tsx […] Hero.tsx, DashboardMockup.tsx […] Other sections (tabs, testimonials, pricing, contact, footer) are NOT built yet; don't report them as missing.
>
> **Context:** requirements in docs/requirements.md (the contract), rules in .claude/rules/*.md, CLAUDE.md. Figma desktop frame is 1280px wide […] Pixel compares already run […] don't redo pixel work.
>
> **Deliberate choices you should evaluate rather than assume wrong:** […] negative margins on the hamburger/close buttons exist only to give 44px touch targets while keeping the design's layout box […] "Log In" points to #contact (no login page in scope).
>
> **Check, with file:line evidence:** 1. Accessibility […] 2. Responsive: reason about 320, 375, 768, 1024, 1280, 1440px […] 3. React/TS […] 4. Token/style rules […] 5. Tests: are Header.test.tsx tests meaningful (would they fail if behaviour broke)? […] 6. Obvious bugs.
>
> **Output:** a findings list ranked by severity (blocker / should-fix / nice-to-have), each with file:line, the problem, why it matters, and the concrete fix. Then a short list of things you verified as correct. Keep it under ~600 words.

The scope line stopped false "missing section" reports. The "deliberate choices" line stopped noise about intentional patterns. The output format made every finding actionable.

## Strong Prompt

**Prompt (verbatim):**

> i put the token now start section by section verify and qa in depth
>
> https://www.figma.com/design/QfuFQ7ANyU0J6KH3ke1B7z/Flow-Pilot?node-id=1-580&t=CDXqIdZKw8xztWnc-4  desktop 1440 but actual width is 1280 so will be same
>
> https://www.figma.com/design/QfuFQ7ANyU0J6KH3ke1B7z/Flow-Pilot?node-id=2-1005&t=CDXqIdZKw8xztWnc-4 375 mobile design but actualy 410 same
>
> https://www.figma.com/design/QfuFQ7ANyU0J6KH3ke1B7z/Flow-Pilot?node-id=16-584&t=CDXqIdZKw8xztWnc-4 mobile menu
>
> now start on full effort

**Why it worked:**

- **Exact sources.** A node link for every frame (desktop, mobile, open mobile menu), so Claude went straight to the right frames instead of searching the file.
- **The traps were named up front.** The frame labelled "1440" is really 1280 wide, and the "375" frame is 410 wide. Claude used the real widths as comparison targets from the first section; without the caveat, every desktop measurement would have been off by 160px.
- **A process, not just a goal.** "section by section, verify and QA in depth" set the cadence: build one section, check it against its frame, move on, and bring in the QA agent after sections 1–4 and again after 5–9.

**Result:** the whole page was built in order from this one prompt, each section checked against its frame before moving on.

## Weak Prompt and Improved Version

**Weak prompt (verbatim):**

> add smooth scroller little animation and interaction

**Why it was weak:** it set no scope, constraints or success criteria. "Smooth scroller" could mean native smooth anchors or a scroll library. It didn't say which elements should animate, whether the Figma visuals could change, or how to treat reduced motion. Claude had to guess, and three follow-up corrections were needed:

- "dont change the UI figma dosent have pause icon in slider"
- "do not pause on hover the sluder"
- "…yrar month change there is not animation"

**Improved version:**

> Add subtle motion without changing the Figma visuals: smooth scrolling for anchor links that lands under the sticky header; sections fading in once as they scroll into view; testimonials autoplaying once the slider is in view, still playing on hover, with no visible pause icon; and an animated Monthly/Yearly switch in pricing. Respect prefers-reduced-motion, and confirm with the pixel comparison that the static design is unchanged.

**What changed:** the improved prompt names every behaviour, the hard constraint (Figma visuals stay as designed), the accessibility rule (reduced motion) and how success is verified (an unchanged pixel comparison). Each of the three later corrections is already answered in it.

## Rejected / Modified Claude Recommendation

**Claude's recommendation:** when adding testimonial autoplay, Claude added a **visible Pause/Play button** next to the bullets and **paused autoplay on hover**. That follows WCAG 2.2.2 (moving content must be pausable) and the WAI-ARIA carousel pattern.

**Why I changed it:** the Figma design is the visual source of truth, and it has no pause control. My instruction: "dont change the UI figma dosent have pause icon in slider". Hover-pause was removed as well: "do not pause on hover the sluder".

**The resolution keeps both goals:**
- The Pause/Play control still exists for accessibility, but it's invisible and click-through until a keyboard user tabs onto it (like a skip link), and it's always available to screen readers. The visual design is untouched.
- Autoplay still pauses on keyboard focus and when the slider scrolls out of view, and never runs with reduced motion.
- The remaining gap (mouse and touch users can't stop it) is documented as a known limitation rather than hidden (D-20).

## Where Claude Was Wrong and How It Was Caught

Nothing Claude produced was accepted on its word. These are the real cases where its first answer or first fix was wrong, and the check that exposed it.

| Claude's first answer | How it was caught | Outcome |
| --- | --- | --- |
| The Figma MCP takes its login from the desktop app. | `whoami` and the MCP config showed a remote OAuth server signed into the wrong account. | Re-authenticated via `/mcp`; verified with `get_metadata` and frame screenshots. |
| The scroll-linked section fade "works". | My report ("component fade then comes animation not working"), confirmed by measurement: the fade finished within ~20px of entering, so it was effectively invisible. | Replaced with a time-based reveal (D-25). |
| Spacing classes such as `h-4.125`. | Not a multiple of 0.25, so Tailwind silently generated no CSS. | Fixed, and a scan for invalid classes added. |
| "Browser zoom still works" (docs). | Flagged by the QA agent: a viewport-driven root doesn't fully honour zoom. | Docs corrected to describe the real trade-off. |
| The desktop container stretched to 64px margins. | I reviewed it in the browser: "the new contianer padding is so wired". | Rebuilt from the brief and Figma: the frame scales ×1.125 at 1440 (D-29), capped when it looked "too big" (D-30). |
| 24dp below the Pro card's features. | My review: "the mb-24 is to much". | 8dp on desktop, Figma's 24dp on mobile (D-26). |
| Opening the mobile menu also scrolled the page. | Re-measured with raw touch input: the scroll came from the test tool's own `tap()`, not the site. | Investigation refocused on the real bug, the scroll on close (below). |
| A count-up test expecting "0h" right after the click. | The test failed: first on timing, then the count never reached "12h" in jsdom, whose frame timestamps use a different time origin. | Test fixed to check an in-progress value, and the hook switched to `performance.now()`, which made it pass. |

## Debugging Example

**Problem (my report, verbatim):** "one wiered issue on mobile when i open menu and click close cross it scroll me little up why"

- **Expected:** closing the mobile menu leaves the page exactly where it was.
- **Actual:** after closing, the page glided upwards.

**Investigation / evidence inspected:**

1. **Reproduced in Chrome** at 375×812, scrolled to 1500px, with a listener logging every page scroll alongside the element that had focus.
2. **Ruled out a false lead.** The first run also showed a jump when opening the menu (focus on `BODY`). That came from Playwright's `tap()`, which scrolls its target to the centre. With raw `touchscreen.tap(x, y)`, opening caused no scroll.
3. **Isolated the real jump:** on close the page went 1500 → 1094 (−406px, half the viewport) over about 400ms, and every scroll event fired *after* focus had returned to the "Open menu" button.
4. **Root cause:** for accessibility, closing the menu returns focus to the toggle (`focus()`). The toggle sits in the sticky header, inside the page's 64dp `scroll-padding-top`, so the browser treated it as covered and scrolled the page to centre it. The scroll was smooth because of `scroll-behavior: smooth`, and since the header is sticky, only the page moved.

**Fix:** `toggleRef.current?.focus({ preventScroll: true })` in `src/components/layout/Header.tsx`. Focus still returns for keyboard and screen-reader users; the page no longer moves (D-37).

**Verification:**
- Closing with the X and with Escape both stay at 1500, with zero scroll events, and focus lands on the toggle.
- A regression test, "gives focus back to the toggle without scrolling the page", **fails when the old `focus()` is restored**.

**More real cases, same method:**

- **Nav underline "thick then thin".** Frame captures at 1920 showed the 2.5px line covering 3 pixel rows while scaling on the GPU, 2 rows at rest. Fixed with a 2px hairline that animates its width; verified at 2 rows in every frame.
- **Shared `#links` never landed on their section.** Proven by testing with the new code switched off: the browser jumped before React had rendered the sections. Fixed by scrolling once after the first render; verified in Chrome (Contact lands 85px below the top, just under the header).
- **Autoplay tests failing in jsdom.** A probe showed `'AnimationEvent' in window === false`, so React listened for a prefixed event. Fixed with a polyfill loaded before react-dom; the tests fail when the code is broken.

## Where Claude Helped Most

- **Verification depth.**
  - Rendered colours read from screenshot pixels.
  - Scroll positions and focus logged over time.
  - Elements measured at 375 / 768 / 1440 / 1920.
  - Every section diffed against its Figma frame.
- **Root-causing browser behaviour before changing code.** Focus versus scroll padding, GPU scaling of a sub-pixel line, fragment navigation versus React rendering: each was proven with evidence first, and fixed with a one-line or few-line change.
- **Tests that actually protect behaviour.** Each new test was mutation-checked, so the suite (52 tests) guards real regressions instead of just passing.
- **An independent second opinion.** The QA agent found ten real accessibility, focus and responsive issues the tests didn't cover.
- **Large refactors without regressions.** The move to fluid rem units was proven lossless (before/after screenshots differed by 0 pixels), and later layout changes were checked against section heights at several widths.

## A Decision I Made Myself

**Decision: ship both footers behind a switch.** The brief asks for a footer with a description, grouped links and social links, but the Figma footer is a single row without them. In my words:

> make two footer if they say use figma one we will use figma one if they say requirement one then we will use requirement one

**Why:** the brief and the design genuinely conflict here, and either reading could be what the reviewers expect. Building both and switching with one setting (`defaultFooterVariant` in `src/data/footer.ts`, or `?footer=brief` / `?footer=figma` in the URL) means the expected version can be shown instantly, without rework (D-23).

**Other decisions I made:**

- **Units.** "use proper base fontsize of 16px on 1440 and 12px on 375, all things should be in rem do not apply max-width on container": everything is rem against a fluid root, later refined to scale the 1280 frame and stop growing at 1440 (D-22, D-29, D-30).
- **Slider controls.** "dont change the UI figma dosent have pause icon in slider", and on phones "the bullets and navigation is not lokking good in mobile so remove it in mobile" (swipe instead; controls kept for screen readers, D-20, D-38).
- **Autoplay.** Keep autoplay always rather than stopping after manual navigation, with the trade-off documented (D-20).
- **Form field focus.** A grey border instead of the blue ring, chosen from three options because Figma has no focus state (D-28).
- **Figma's empty `Frame 2`.** Ignored the empty frame the updated file added above the hero headline (D-24).
