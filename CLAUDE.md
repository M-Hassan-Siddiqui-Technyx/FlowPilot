# FlowPilot

Single-page responsive marketing landing page, built as a 4-hour Claude-assisted frontend assessment. The brief is `docs/FlowPilot_Candidate_Assessment_Brief.pdf`, distilled in `docs/requirements.md`. Treat the requirements file as the contract. Figma is the visual source of truth.

## Stack

React 19 · TypeScript 7 (strict) · Vite 8 · Tailwind CSS 4 (`@tailwindcss/vite`; config is CSS-first in `src/index.css`, there is no `tailwind.config.js`) · React Hook Form · Lenis (wheel smoothing) · Vitest + React Testing Library (jsdom) · Oxlint. No backend.

## Commands

- `npm run dev`: dev server
- `npm run build`: typecheck + production build
- `npm test`: run tests once (`npm run test:watch` to watch)
- `npm run typecheck`
- `npm run lint`

This is a Windows machine, and PowerShell is the primary shell.

## Figma (Pixel-Perfect Target: the 1280 Desktop Frame and 375)

- **File:** https://www.figma.com/design/WAHeIX5DCB0FAYZ2lOcr6d/Flow-Pilot?node-id=1-580 (desktop `1:580`, mobile `2:1005`, mobile menu `16:584`). The desktop frame (named "1440") is 1280px wide: the page renders it 1:1 at 1280 and scales it proportionally, so the brief's 1440 page is the frame ×1.125.
- **Read the design** with the **Figma MCP** (`mcp__figma-desktop__*`, the remote server `mcp.figma.com`), signed in as the account that can open the file (agha.furqan). If it says "no edit access", run `whoami` and re-authenticate via `/mcp`. Call `create_session` first, and load the `figma:figma-design-to-code` skill before calling `get_design_context`.

## Layout

- `src/components/layout/`: header, mobile nav, footer
- `src/components/sections/`: page sections
- `src/components/ui/`: shared primitives
- `src/data/`: typed content
- `src/types/`, `src/hooks/`, `src/test/`
- Tests sit next to their components.
- `docs/`:
  - `requirements.md`
  - `plan.md` (written by the planner agent)
  - `design-tokens.md`
  - `decisions.md`
  - `ai-log.md`

## Non-negotiables

- **Styling through design tokens only.** Tokens are the `@theme` variables in `src/index.css`. No hard-coded colours, sizes, arbitrary values or pixel media queries. See `.claude/rules/styling.md`.
- **Units: fluid rem.** Every size is rem. The root font size is fluid: 12px at 375 on phones, 16px at 1280 on desktop, the desktop frame's real width (18px at 1440; clamped, see `src/index.css`). `--dp` is one Figma pixel in rem (`1rem/12` below `md`, `1rem/16` from `md`), and the spacing scale is `--dp`, so a class number is the Figma px: 13px → `p-13`, 640px → `max-w-640`. Type, radius and shadow tokens are `calc(var(--dp) * px)`. The `Container` has no max-width; its gutters are 20 / 32 / 64dp, as in the Figma frames; above 1440 the desktop gutter grows so the 1152dp content stays centred at the 1440 size. Two-column desktop rows are `fr` grids in Figma's column proportions. Only hairlines (1–2px borders, focus outlines) stay in px.
- **Pixel-exact.** Use the exact Figma px as the class number, never rounded (half pixels are fine: 19.5px → `h-19.5`). Check against the Figma MCP screenshot; never fudge.
- **Mobile-first.** The base classes are the 375px layout, `md:` is 768px, and `lg:`/`xl:` cover desktop (designed at 1440px).
- **Data-driven content** from `src/data/`. No duplicated markup.
- **Accessible UI:** semantic, keyboard-usable, labelled.
- **Tests:** every interactive feature has a behaviour test.

## How we work

- **One section or feature at a time.** Never generate the whole page in one go; the brief forbids it.
- **Before coding,** restate the acceptance criteria.
- **After coding,** run typecheck, lint and test (or `/verify`), then tell the developer what to check in the browser at 375, 768 and 1440px.
- **Never claim something works** unless a command or test showed it. The developer verifies in the browser.
- **Bugs:** state the expected behaviour, the actual behaviour and the evidence before changing code.
- **When the brief or the design is ambiguous,** ask; don't guess. Record decisions in `docs/decisions.md`.
- **AI usage:** log notable moments (strong or weak prompts, rejected suggestions, debugging) with `/log-ai-usage`. They feed `AI-USAGE.md`.

## Agents (`.claude/agents/`)

- `project-planner`: requirements and Figma → `docs/plan.md`. Doesn't write code.
- `frontend-implementer`: builds or debugs one scoped section or bug, with tests.
- `reviewer-qa`: read-only, independent review against the brief and the rules.

## Skills (`.claude/skills/`)

- `/verify`: every check (typecheck, lint, tests, build, token scan, brief checklist)
- `/log-ai-usage <prompt|rejected|debug|decision>`

