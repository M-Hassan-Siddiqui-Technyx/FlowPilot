# FlowPilot Landing Page

Responsive marketing landing page for FlowPilot, built from the supplied Figma design.

## Technology

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 4 (via `@tailwindcss/vite`)
- React Hook Form
- Lenis (smooth mouse-wheel scrolling)
- Vitest + React Testing Library (`@testing-library/react`, `user-event`, `jest-dom`) on jsdom
- Oxlint

## Setup

Requires Node.js 22.22+ or 24.15+ (developed on Node 24.21).

```bash
npm install
```

## Commands

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start the dev server                     |
| `npm run build`      | Type-check and build for production      |
| `npm run preview`    | Preview the production build             |
| `npm test`           | Run the test suite once                  |
| `npm run test:watch` | Run tests in watch mode                  |
| `npm run typecheck`  | Type-check only                          |
| `npm run lint`       | Lint with Oxlint                         |

## Design

Design file: [Flow Pilot](https://www.figma.com/design/WAHeIX5DCB0FAYZ2lOcr6d/Flow-Pilot?node-id=1-580) (desktop `1:580`, mobile `2:1005`, mobile menu `16:584`), read through the Figma MCP (`mcp.figma.com`). The desktop frame renders 1:1 at 1280; the brief's 1440 page is the same layout ×1.125. During development each section was pixel-diffed against Figma with a local compare script (Figma frame renders vs Chrome/Edge screenshots); that tooling was removed before submission.

## Project Docs & Claude Setup

- `docs/requirements.md`: the assessment brief turned into a checklist (original PDF in `docs/`)
- `docs/decisions.md`: decision log
- `docs/design-tokens.md`: design tokens taken from Figma
- `docs/ai-log.md`: raw notes that feed `AI-USAGE.md`
- `CLAUDE.md`: project context for Claude
- `.claude/rules/`: coding rules (styling with tokens, React/TS, accessibility, forms, testing)
- `.claude/agents/`: Project Planner, Frontend Implementer and Reviewer/QA agents
- `.claude/skills/`: `/verify`, `/log-ai-usage`

## Component Structure

```
src/
  App.tsx       page composition: skip link, Header, <main> sections, Footer
  components/
    layout/     Header (desktop nav + menu toggle), MobileNav (full-screen dialog),
                Footer (picks a variant) → FooterBar (designed row) + FooterLinks (brief content)
    sections/   Hero, DashboardMockup (coded product visual), TrustedLogos, Features, FeatureCard,
                FeatureTabs, Testimonials, Pricing, PricingCard, Contact, ContactForm
    ui/         Button (link or button), Container (page width), FormField, Icon (Figma SVGs), Logo
  data/         typed content: navigation + section ids, hero, features, tabs, testimonials, pricing, contact, footer
  types/        content types (+ css.d.ts for CSS custom properties)
  hooks/        useSmoothScroll (Lenis wheel smoothing), useRevealOnScroll (section fade-ins),
                useActiveSection (nav highlight), useInView (slider autoplay), usePrefersReducedMotion, useCountUp (tab stat count-up)
  lib/          cn (class joiner), submitContactRequest (simulated ~1s request), initialScroll (refresh starts at top, #links land)
  index.css     fluid rem root, --dp unit, Tailwind 4 @theme design tokens, motion utilities, menu scroll lock
```

- Repeated content is rendered from `src/data/`. Section anchor ids come from `sectionIds` in `src/data/navigation.ts`, so nav links, CTAs and sections can't drift apart.
- Interactive state lives where it's used: menu (`Header`), active tab (`FeatureTabs`), dashboard screen (`DashboardMockup`), slide (`Testimonials`), billing period (`Pricing`), form (`ContactForm`, React Hook Form).
- Tests sit next to their components (`*.test.tsx`): mobile menu, active-section nav, tabs, hero dashboard screens, slider (controls, indicators, autoplay, reduced motion), pricing toggle, contact form (validation, conditional field, submit / double submit / success), footer variants and page-level link integrity (`App.test.tsx`).

## Key Decisions

The full log with reasons and alternatives is in [`docs/decisions.md`](docs/decisions.md). The main ones:

- **Fluid rem units:** every size is rem. The root font size is 12px at 375 on phones and 16px at 1280 on desktop (the real width of the "1440" frame), fluid and clamped in between, so both Figma frames render 1:1 at their widths and scale proportionally around them: the brief's 1440 page is the frame ×1.125 (72px margins, 1296px content). Wider screens keep the 1440 size with the content centred (1920: 312px margins). `--dp` is one Figma pixel, and the spacing scale uses it, so class numbers are Figma px (`p-20` = 20px). The container has no max-width; its desktop gutters are Figma's 64dp up to 1440 and grow beyond it, so the content stays the frame's 1152dp (D-30). Two-column rows are `fr` grids in Figma's proportions. The conversion was verified lossless: before/after screenshots differ by 0 pixels.
- **Breakpoints:** base classes = mobile (375 frame), `md` = desktop styling, `lg` = desktop nav, `xl` = two-column layouts.
- **Tokens only:** every colour, type size, radius and shadow is an `@theme` token (the default palettes are reset).
- **Two footers:** `figma` (the design) or `brief` (adds the PDF's description, grouped links and social links). Set `defaultFooterVariant` in `src/data/footer.ts`, or add `?footer=brief` / `?footer=figma` to the URL.
- **Pixel verification:** during development each section was diffed against Figma (screenshot pixel diff plus a typography/position audit); remaining differences are font antialiasing or documented decisions. The compare tooling was removed before submission.
- **Where the page starts:** a refresh always starts at the top (no scroll restore; a leftover `#section` from a nav link is dropped), while a shared link such as `/#contact` lands on its section (D-34).
- **Contact form:** `mode: 'onTouched'`, `shouldUnregister: true` for the conditional Preferred Demo Time, submit disabled while the simulated ~1s request runs, exact success text in a `role="status"` region.
- **Added beyond the design (brief requirements):** testimonial indicators and controls (tablet/desktop; phones swipe the card, D-38), a working Yearly toggle, an error colour.
- **Motion:** smooth mouse-wheel scrolling (Lenis) and smooth anchor links; sections rise and fade in once as they enter the screen (cards staggered); a header reading-progress bar and shadow (CSS scroll-driven); a staggered hero entrance; active-section nav highlighting; hover/press micro-interactions; workflow tabs with a sliding gradient pill, direction-aware copy, a counting stat and a gliding progress bar; an interactive hero dashboard; brand colours sweeping through the trusted-by names on hover; testimonial autoplay (starts in view, keeps playing on hover, pauses on keyboard focus/off-screen, keyboard/screen-reader Pause/Play control that stays out of the visual design, off for reduced motion). All of it respects `prefers-reduced-motion` and degrades to the static design.

## Known Limitations

- Placeholder content: the five extra hero dashboard screens (D-31), the Automate/Collaborate tab copy, three of the four testimonials and the yearly prices aren't in the design (decisions D-11 to D-13).
- The default footer is the designed one; the brief's footer content ships as the `brief` variant (D-23). Its social profiles and the Company/Resources/legal pages are placeholder links.
- "Log In" has no destination in scope and links to the contact form (D-4).
- On phones the testimonial arrows and bullets are hidden visually (swipe instead), so the brief's active-slide indicator isn't visible there; screen readers keep the controls (D-38).
- Testimonial autoplay can be stopped only from the keyboard or a screen reader (the Pause control is hidden until focused, and hover doesn't pause, by design choice), so mouse/touch users can't stop it: a WCAG 2.2.2 gap (D-20).
- Some brand colour pairs are just under WCAG AA (listed in `docs/design-tokens.md`); they were left as designed (D-15).
- The fluid root follows the viewport, so browser zoom enlarges text only when the zoomed viewport falls into a smaller breakpoint range (200% at 1440 → tablet layout at 2×; at 1920, 200% gives about 180%). 110–175% barely change it, and the browser's default font-size setting is ignored on desktop. Small desktops (1024–1120px) render at 0.875× (14px root floor) (D-22, D-29).
- The updated Figma file's empty `Frame 2` above the hero headline is intentionally not reproduced (D-24).
