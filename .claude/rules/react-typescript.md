---
paths:
  - "src/**/*.{ts,tsx}"
---

# React & TypeScript Conventions

## Structure

```
src/
  components/
    layout/    Header, MobileNav, Footer
    sections/  One file per page section (Hero, Features, FeatureTabs, Testimonials, Pricing, Contact…)
    ui/        Small pieces used in 2+ places (Button, Container, SectionHeading…)
  data/        Typed static content: nav links, features, tab content, testimonials, plans, footer links
  types/       Shared types for that data
  hooks/       Custom hooks, only when logic is reused or complex enough to test on its own
  test/        Test setup and shared test helpers
```

Tests sit next to the component they test (`Pricing.tsx` → `Pricing.test.tsx`).

## Components

- Use function components with **named exports**: one component per file, and the file name matches the component (PascalCase).
- Declare props as `type XProps = { … }` next to the component. UI primitives extend the native element props (`ComponentPropsWithoutRef<'button'>`) and pass the rest through.
- **Content is data-driven.** Render cards, tabs, slides, plans and links with `.map()` over `src/data/`. Never copy-paste the markup for each item. Use stable ids as keys, not array indexes.
- Section anchor ids come from **one source** (the navigation data), so nav links, CTAs and sections can't drift apart.
- Only abstract when it removes real duplication or makes the code clearer. Don't wrap every element in a component.

## State

- Keep state in the component that owns the interaction (active tab, slide index, menu open). Lift it only when a sibling needs it.
- **Derive, don't sync.** For example, compute the active tab's content by looking it up from the active id. Don't copy it into state with `useEffect`.
- Use `useEffect` only to sync with something outside React (Escape-key listener, body scroll lock), and always clean up.
- Don't add global state, context or state libraries for a single-page site unless there's a concrete need.

## TypeScript

- Strict mode is on. No `any`. Don't use `as` casts or `!` to silence errors; fix the type.
- Use `import type` for type-only imports (`verbatimModuleSyntax` is on).
- No `enum` (`erasableSyntaxOnly` is on). Use union literals, e.g. `type TeamSize = '1-10' | '11-50' | '51-200' | '200+'`, or `as const` objects.

## Quality

- No console errors or React warnings (missing keys, controlled/uncontrolled switches, act warnings).
- No dead code, commented-out code or unused exports.
