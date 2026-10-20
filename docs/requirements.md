# FlowPilot Requirements

Distilled from [`FlowPilot_Candidate_Assessment_Brief.pdf`](./FlowPilot_Candidate_Assessment_Brief.pdf). If this file and the PDF disagree, the PDF wins.

- **Project:** FlowPilot landing page, a single-page responsive frontend with no backend or API.
- **Time limit:** 4 hours.
- **Visual source of truth:** the Figma file. It contains:
  - the full desktop page at 1440px
  - mobile references at about 375px for the header, open navigation, hero and contact form
  - a component/state reference area
- **Priority:** strong structure, correct behaviour, good UI and verified work beat full but unexplainable coverage.

## Stack (required)

React · TypeScript · Tailwind CSS · React Hook Form · React Testing Library

## Sections

| Section           | Required UI / behaviour                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Header            | Logo, desktop navigation, Log In, Get Started, responsive mobile hamburger menu              |
| Hero              | Headline, supporting copy, two CTAs, trust notes, coded product/dashboard visual             |
| Trusted Companies | Simple horizontal company/logo strip                                                         |
| Features          | Four feature cards with icons, hierarchy and hover treatment                                 |
| Interactive Tabs  | Plan / Automate / Collaborate; one active tab; data-driven content changes                   |
| Testimonials      | Previous/next controls, active slide indicator, React-state-driven content                   |
| Pricing           | Starter / Pro / Business cards; **monthly pricing** at initial handoff                       |
| Contact Form      | Validated form with conditional logic, submit state and success state                        |
| Footer            | Logo, short description, grouped links, social links, copyright                              |

## Responsive

Reference widths: **375px** (mobile), **768px** (tablet), **1440px** (desktop).

Don't just stack the desktop design. Plan the layout, typography, section spacing, navigation, cards, forms, slider controls, pricing and footer for each breakpoint. Where Figma has no mobile design, choose sensible behaviour and record it in `decisions.md`.

## Functional

**Mobile navigation**
- [x] Opens and closes correctly
- [x] Shows all navigation links
- [x] Closes when a link is selected
- [x] Usable with the keyboard

**Section navigation**
- [x] Nav links and relevant CTAs scroll to the correct section

**Interactive tabs**
- [x] Plan, Automate and Collaborate tabs
- [x] Only one tab is active at a time
- [x] Content comes from reusable data, not duplicated markup

**Testimonials slider**
- [x] Previous control (tablet/desktop visible; phones swipe, control kept for screen readers, D-38)
- [x] Next control
- [x] Shows the correct active testimonial
- [x] Active slide indicator (tablet/desktop; phones hide it visually, D-38)
- [x] Content driven by React state

## Contact Form

| Field     | Rule                              | Notes                                    |
| --------- | --------------------------------- | ---------------------------------------- |
| Full Name | Required; minimum 3 characters    |                                          |
| Work Email| Required; valid email             |                                          |
| Company Name | Required                       |                                          |
| Team Size | Required                          | Options: `1-10`, `11-50`, `51-200`, `200+` |
| Message   | Required; 20–300 characters       | Live character count, e.g. `120 / 300`   |
| Terms     | Must be accepted                  |                                          |

**Conditional logic.** When Team Size is `200+`, show a new required field, **Preferred Demo Time**, with the options Morning, Afternoon and Evening. If Team Size changes to another option, the field must disappear and must no longer block submission.

**Submission**
1. Disable the submit button while processing.
2. Show a submitting state.
3. Simulate about 1 second of processing.
4. Prevent repeated submissions.
5. Show the success message exactly: **"Thanks! Our team will contact you shortly."**

## Accessibility & UI quality

- [x] Semantic HTML
- [x] Sensible heading order
- [x] Real labels on form fields
- [x] Buttons and controls have meaningful names
- [x] Visible focus states
- [x] Mobile menu, tabs and slider controls usable by keyboard
- [x] Validation messages are understandable and associated with their fields
- [x] Subtle transitions only where they improve the experience

## Component thinking

Don't put the whole page in one component. Create reusable components where they improve readability, but don't turn every small element into an abstraction. Example names (not mandatory): Header, Hero, FeatureCard, FeatureTabs, TestimonialSlider, PricingCard, ContactForm, Footer, Button, SectionHeading.

## Claude roles (at least 3)

| Role                          | Responsibility                                                                                                                          |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Project Planner               | Understand requirements, review Figma, break work into sections/components, find reuse, define order of work, flag risks                |
| Frontend Implementation Agent | React, TypeScript, Tailwind, responsive implementation, state, form validation, interaction logic, debugging; given project context      |
| Reviewer / QA Agent           | After meaningful development, independently review responsiveness, a11y, React structure, TS, validation, interactions, maintainability, bugs |

Prompts should give a role, task, context, requirements and expected output. Avoid both repeated one-line prompts and one huge prompt. **Do not ask Claude to build the whole site in one prompt.**

## Debugging & AI verification

- Document at least one **real** issue. Before asking Claude to fix it, write down the expected behaviour, the actual behaviour and the evidence you inspected (console, state, props, form state, layout).
- Include at least one **real** Claude recommendation that was rejected, corrected or modified, and say why.

## Testing (at least 3 meaningful tests)

- [x] An invalid form can't be submitted
- [x] Team Size `200+` shows and requires Preferred Demo Time
- [x] An interaction such as the tabs changes the displayed content correctly

## Submission

- [x] Source code / repository
- [x] `README.md`: setup, run/test commands, technology, component structure, key decisions, known limitations
- [x] `AI-USAGE.md`, containing:
  - agents/roles, their responsibilities and initial prompts
  - one strong prompt and why it worked
  - one weak prompt and its improved version
  - one rejected or modified recommendation and why
  - one debugging example: problem, investigation, prompt, fix, verification
  - where Claude helped most
  - at least one meaningful decision you made yourself
- [x] At least 3 meaningful tests

## Final checklist (brief §15)

Status 2026-10-20: every item below is backed by the test suite (52 tests in 10 files, `npm test`), a clean `npm run typecheck` / `npm run lint` / `npm run build`, and checks in Chrome at 375, 768 and 1440 (see `docs/decisions.md`).


- [x] Runs without important console errors or React warnings
- [x] Desktop, tablet and mobile layouts are usable
- [x] Mobile navigation works
- [x] Tabs work
- [x] Testimonial slider works
- [x] Pricing matches the current requirement (monthly)
- [x] Form validation and conditional field logic work
- [x] Duplicate submission is prevented
- [x] Success state works
- [x] Keyboard/focus behaviour is reasonable
- [x] Tests run
- [x] README and AI-USAGE.md are accurate

> Final rule: don't rely on Claude saying the app is correct. Run it, inspect it and verify the behaviour yourself.
