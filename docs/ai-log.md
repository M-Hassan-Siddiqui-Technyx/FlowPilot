# AI Interaction Log

Raw evidence collected during development, written as it happens. `AI-USAGE.md` is written from this log at the end. Add entries with `/log-ai-usage <prompt|rejected|debug|decision> [note]`.

Only record what actually happened. Quote prompts verbatim.

## Coverage for AI-USAGE.md

- [x] Strong prompt and why it worked
- [x] Weak prompt and improved version
- [x] Rejected or modified Claude recommendation
- [x] Debugging example (expected / actual / evidence → prompt → fix → verification)
- [x] Where Claude helped most
- [x] A meaningful decision I made myself

## Entries

<!-- Newest entries at the bottom. -->

### 2026-10-20: Rejected/modified recommendation: pricing card spacing below "Priority support"
- Claude suggested: for "fix space below Priority support in pricing card", Claude first measured the gap between each plan's last feature and its button in Chrome: Pro 2px, Business 18px and Starter 42px at 1440 and 768, and Pro 24px on mobile (as in Figma). It then removed `md:mb-0` from the feature list in `src/components/sections/PricingCard.tsx`, so mobile's 24dp margin applied at every size and the desktop cards grew from Figma's 302dp to 324dp.
- Problem with it: too much space. Developer (verbatim): "less it like mb-8 the mb-24 is to much". Why (developer's words): "the mb-24 is to much".
- What was done instead: `md:mb-8` on the list (`src/components/sections/PricingCard.tsx:48`). From `md` up there are at least 8dp above the button; mobile keeps Figma's 24dp. Cards are now 308dp (Figma: 302). Gaps: Pro 8dp, Business 24dp, Starter 48dp. Logged as decision D-26.
- How it was verified:
  - Chrome measurement: 8px at 768 and 1440, 10px at 1920 (root 20px), and 24px at 375 (unchanged).
  - `npm run typecheck` and `npm run lint` (exit 0); `npm test` passed 39/39.
  - `figma:compare`: `pricing-desktop` is 2.92% pixels with +7px height. It's NEEDS WORK only because CLOSE allows at most ±4px height (it was CLOSE at 1.57% before). The text layers that moved are the three buttons (+6 to +9px). `pricing-mobile` is unchanged (CLOSE 3.68%).
  - Browser check by the developer: pending.

### 2026-10-20: Debugging: blue in the contact form fields after submitting
- Expected behaviour: form fields keep the design's colours in every state: white from `md`, `surface-muted` on mobile, ink text.
- Actual behaviour: developer report (verbatim): "in form fields the blue deafult thing apper when sumit why".
- Evidence inspected: a Chrome probe (`.figma/form-submit.mjs`, git-ignored) ran the submit flows at 1440 and logged the focused element, `:autofill`, and computed colours.
  1. Chrome address autofill, triggered through the DevTools protocol (`Autofill.trigger`), turned Full Name, Work Email and Company Name `rgb(232, 240, 254)` with `rgb(0, 0, 0)` text (`:autofill` true). That's Chrome's `!important` browser style.
  2. Clicking Send on the empty form moved focus to Full Name (React Hook Form focuses the first invalid field). It showed the site's 2px `#2F5BFF` focus outline around the red error border.
  3. Submitting with Enter moved focus to the success panel, which showed the same outline (`:focus-visible` true). A mouse-click submit didn't.
- Prompt given to Claude (verbatim): "in form fields the blue deafult thing apper when sumit why"
- Fix (files):
  - The `autofill-bg-*` utility in `src/index.css`.
  - `autofill-bg-surface-muted md:autofill-bg-white` on the shared field classes in `src/components/sections/ContactForm.tsx` (D-27).
  - The focus outlines (2 and 3) are unchanged until the developer decides.
- Verification:
  - The same autofill probe now renders `#ffffff` at 1440 and `#f6f8fc` at 375 inside the fields, with text `rgb(16, 24, 40)`.
  - Typecheck and lint exit 0; 39/39 tests pass.
  - `figma:compare`: contact-desktop CLOSE 1.68% and contact-mobile 11.6%, both unchanged.
  - Developer browser check: pending.

### 2026-10-20: Rejected/modified recommendation: desktop container width at 1440
- Claude suggested:
  - Developer: "container width i think is not coreect on 1440px plase check figma".
  - Claude checked Figma through the MCP. The "1440" frame is 1280 wide, with 64px margins and 1152px of content, while the page at 1440 had 144px margins.
  - Claude asked which way to go and marked "Stretch to 64px margins (Recommended)": keep the 16px root at 1440 and let the rows grow to 1312px. The developer picked it.
  - Claude built it: `fr` grids in Figma's column proportions, with text capped at its Figma widths so line breaks stayed. Measured: 64px margins, all heights unchanged.
- Problem with it: developer (verbatim): "the new contianer padding is so wired actually follow the document and check figma which will be best use that".
- What was done instead:
  - Claude read the brief ("A complete 1440px desktop page") and the Figma layer names, which were written for 1440 ("Banner Container (1296px wide)" = the 1152px banner ×1.125).
  - It anchored the desktop root at the frame's real width: 16px at 1280 instead of at 1440, `clamp(0.875rem, 1.25vw, 1.5rem)`. So the page is the frame scaled to the window: ×1.125 at 1440, with 72px margins.
  - The `fr` grids stayed, so rows remain proportional above 1920 (D-29).
- How it was verified:
  - Chrome: 64dp margins and 1152dp content at 1280, 1440 and 1920; section heights equal the frame's; no horizontal scroll.
  - Desktop compares now run 1:1 at 1280, with verdicts identical to before.
  - Typecheck, lint and 39/39 tests pass.
  - Developer browser check: pending.

### 2026-10-20: Decision: form field focus style
- Decision: a focused field shows a grey border instead of the blue border and ring; invalid fields stay red (D-28).
- Options considered (offered by Claude, because Figma has no field focus state): grey border with no ring (recommended); blue border with no ring; no change on focus (fails WCAG 2.4.7). Developer chose "Grey border, no ring", after "the form field active us getting blue still".
- Why (developer's words): "the form field active us getting blue still" (Figma has no focus state, so the blue ring read as a browser default).

### 2026-10-20: Rejected/modified recommendation: scaling the desktop page above 1440
- Claude suggested: scale the Figma frame with the window up to a 24px root (D-29), so the page was ×1.5 at 1920.
- Problem with it: developer (verbatim): "why its lokking to big big?" The developer's screen is 1920 wide: base text was 24px and the headline 87px.
- What was done instead:
  - Claude explained the cause and offered three caps.
  - The developer chose "Stop growing at 1440 (Recommended)".
  - The root now stops at 18px. The desktop gutter is `max(64dp, (100% − 1152dp) / 2)`, so wider screens keep the 1440 page centred (D-30).
- How it was verified:
  - Chrome at 768 to 2560: 18px root and 312px margins at 1920; content is 1152dp at every desktop width; no horizontal scroll.
  - The 9 desktop compares match the previous verdicts.
  - Typecheck, lint and 39/39 tests pass.
  - Developer browser check: pending.

### 2026-10-20: Debugging: closing the mobile menu scrolled the page up
- Expected behaviour: closing the mobile menu leaves the page where it was.
- Actual behaviour: developer report (verbatim): "one wiered issue on mobile when i open menu and click close cross it scroll me little up why".
- Evidence inspected:
  - Chrome at 375×812, scrolled to 1500, logging every page scroll together with the focused element.
  - The first run blamed opening the menu too (1500 → 1094, with focus on `BODY`). That was the test tool: Playwright's `tap()` scrolls its target to the centre first. Re-run with raw `touchscreen.tap(x, y)`, opening didn't scroll.
  - Closing glided the page 1500 → 1094 (−406px) over about 400ms, with every scroll event fired after focus returned to "Open menu".
  - The cause is the focus restore, `toggleRef.current?.focus()`. The toggle is in the sticky header, inside the 64dp `scroll-padding-top`, so the browser treated it as covered and centred it.
- Prompt given to Claude (verbatim): "one wiered issue on mobile when i open menu and click close cross it scroll me little up why"
- Fix (files): `src/components/layout/Header.tsx`: `focus({ preventScroll: true })` (D-37).
- Verification:
  - Chrome: closing with the X and with Escape both stay at 1500 with no scroll events, and focus still lands on the toggle.
  - New test "gives focus back to the toggle without scrolling the page" fails with the old plain `focus()`.
  - Typecheck, lint and the full test suite pass; header compares unchanged.
  - Developer browser check: pending.
