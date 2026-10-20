---
paths:
  - "src/**/*.tsx"
---

# Accessibility

## Structure

- Use landmarks:
  - `<header>`
  - `<nav aria-label="Main">`
  - `<main>`
  - `<section aria-labelledby="…">` for each page section
  - `<footer>`
- Headings:
  - Exactly one `<h1>`, in the hero.
  - Each section has an `<h2>`; cards inside it use `<h3>`.
  - Never pick a heading level for its look; style it with classes.
- Use `<button>` for actions and `<a href="#section">` for navigation. No clickable `<div>`s.

## Names and Labels

- Every control has an accessible name. It can come from visible text, a `<label>`, or an `aria-label` on icon-only buttons ("Open menu", "Next testimonial").
- Decorative icons and SVGs get `aria-hidden="true"`.
- Images get meaningful `alt` text, or `alt=""` when they're decorative or the same text is right next to them.

## Focus and Keyboard

- Every interactive element has a visible `focus-visible:` style using the focus token. Never remove it.
- **Mobile menu**
  - The toggle button has `aria-expanded` and `aria-controls`, and its label switches between Open and Close.
  - Escape closes the menu and returns focus to the toggle.
  - Choosing a link closes the menu.
  - Links can be reached with Tab in visual order.
- **Tabs**
  - Use `role="tablist"`, `role="tab"` and `role="tabpanel"`, with `aria-selected` and `aria-controls`/`aria-labelledby`.
  - Only the active tab is in the Tab order (roving `tabIndex`).
  - Left and Right arrows move between tabs; Home and End are a bonus.
- **Testimonial slider**
  - Previous and Next are named `<button>`s.
  - The content region uses `aria-live="polite"`.
  - Indicators: if they are clickable, make them buttons named "Show testimonial N", with `aria-current` on the active one. If they are display-only, hide them from assistive tech and expose text such as "Testimonial 2 of 4".
  - Auto-rotation only as the developer requested (decision D-20): start when the slider is in view; keep playing on hover (developer request); pause on keyboard focus and when scrolled away; provide a Pause/Play button (WCAG 2.2.2), shown only on keyboard focus because the design has no pause control; never auto-rotate with `prefers-reduced-motion`; set the live region to `off` while rotating and `polite` otherwise. Known gap, accepted by the developer: mouse/touch users can't stop autoplay (WCAG 2.2.2).

## Visual

- Text contrast meets WCAG AA: 4.5:1 for normal text, 3:1 for large text and UI parts. Check token pairs in `docs/design-tokens.md`.
- Never use colour alone to show state. For example, the active tab also has `aria-selected` and a non-colour cue.
- Touch targets are at least 44×44dp on mobile (menu toggle, slider controls, form controls): 44px at the 375 reference, scaling with the fluid root (about 37.5px at 320), and never below the 24px of WCAG 2.5.8.
- Keep animation subtle and wrap it in `motion-safe:`.
