# Design Tokens

**Status:** synced 2026-10-20 from the Figma file [Flow Pilot](https://www.figma.com/design/WAHeIX5DCB0FAYZ2lOcr6d/Flow-Pilot?node-id=1-580) (REST API inventory during development; re-checked through the Figma MCP, which reports no variables). The file has **no Figma variables or styles**, so every token is named by role and the "Figma source" column gives the raw value and where it's used.

Tokens are defined in the `@theme` block of `src/index.css`, and Tailwind generates a utility for each one (`--color-primary` → `bg-primary`, `text-primary`, …). Components must use these utilities rather than literal values. See `.claude/rules/styling.md`. The default colour, type, radius and shadow scales are reset (`--color-*: initial` etc.), so off-design values can't be used by accident.

Design widths: the desktop frame "1440" is **1280px** wide (content 1152px inside 64px gutters) and renders 1:1 at 1280; the brief's 1440 page is the same layout ×1.125; the mobile frame "375" is 410px wide with a **375px** content container (20px gutters).

## Units: fluid rem and design pixels

Every length is rem (decisions D-22, D-29). The `html` font size follows the viewport, so each Figma frame renders 1:1 at its reference width and scales proportionally around it:

| Range | Root font size | Exact at |
| ----- | -------------- | -------- |
| below `lg` | `clamp(0.625rem, 3.2vw, 1rem)` (10–16px) | 12px at 375 |
| `lg` and up | `clamp(0.875rem, 1.25vw, 1.125rem)` (14–18px) | 16px at 1280, 18px from 1440 up |

`--dp` is **one Figma pixel** in rem: `calc(1rem / 12)` below `md` (the 375 frames are drawn for a 12px root) and `calc(1rem / 16)` from `md`. Tailwind's `--spacing` is `var(--dp)`, so a class number is the Figma px (`p-20` = 20px, `h-19.5` = 19.5px), and every type, radius and shadow token below is written `calc(var(--dp) * px)`; the tables list those px values. Only hairlines stay in px: 1–2px borders and the 2px focus outline. Breakpoints don't move, because rem inside media queries always uses the browser default (16px).

## Colours

| Token | Value | Figma source | Used for |
| ----- | ----- | ------------ | -------- |
| `--color-white` | `#FFFFFF` | `#FFFFFF` (85 layers) | Page, cards, inputs, text on gradients |
| `--color-ink` | `#101828` | `#101828` (89) | Headings, primary text |
| `--color-muted` | `#667085` | `#667085` (106) | Body copy, nav links, captions |
| `--color-subtle` | `#98A2B3` | `#98A2B3` (4) | "Upcoming" task status |
| `--color-placeholder` | `#6B7280` | `#6B7280` (4) | Textarea placeholder, select chevron, checkbox border |
| `--color-logos` | `#7A879B` | `#7A879B` (11) | Trusted-by company names |
| `--color-brand-google-blue` / `-red` / `-yellow` / `-green` | `#4285F4` / `#EA4335` / `#FBBC05` / `#34A853` | not in Figma (official brand colours) | Google's letters on hover (D-32) |
| `--color-brand-slack` / `-notion` / `-spotify` / `-zoom` / `-shopify` | `#4A154B` / `#000000` / `#1DB954` / `#0B5CFF` / `#95BF47` | not in Figma (official brand colours) | The other trusted-by names on hover (D-32); logotypes are exempt from text contrast (WCAG 1.4.3) |
| `--color-primary` | `#2F5BFF` | `#2F5BFF` (10), gradient start | Brand blue: gradients, eyebrows, links, borders |
| `--color-accent` | `#7B4DFF` | `#7B4DFF`, gradient end | Brand violet: gradient end, quote mark |
| `--color-focus` | `#2F5BFF` | = primary | Focus outline (`focus-ring` utility) |
| `--color-border` | `#DCE3F0` | `#DCE3F0` (43) | Cards, inputs, outline buttons |
| `--color-divider` | `#EEF1F5` | `#EEF1F5` (5) + `#EEF1F6` (8) | Header/footer rules, task rows, mobile sidebar — the two values differ by 1/255 and were merged |
| `--color-surface-muted` | `#F6F8FC` | `#F6F8FC` (7) | Mockup sidebar, mobile inputs, menu hover |
| `--color-surface-raised` | `#FBFCFE` | `#FBFCFE` (6) | Mockup stat cards |
| `--color-tint-from` / `--color-tint-to` | `#F2F6FF` → `#F6F1FF` | Hero/banner/contact gradient (90°) | Section backgrounds |
| `--color-primary-tint` | `#EAF0FF` | `#EAF0FF` (2) | Active mockup nav item |
| `--color-primary-wash` | `#EEF2FF` | `#EEF2FF` (2) + `#EEF3FF` (2) | "New" pill badge, progress track (merged, 1/255 apart) |
| `--color-primary-faint` | `#F1F5FF` | `#F1F5FF` (8) | Mockup task checkboxes |
| `--color-success` | `#22B573` | `#22B573` (27) | Check icons, "Completed" |
| `--color-warning` | `#FF9F43` | `#FF9F43` (4) | "In Progress" |
| `--color-danger` | `#D92D20` | **not in Figma** | Form validation errors (see decisions D-14) |
| `--color-rating` | `#F7B500` | `#F7B500` (1) | Testimonial stars |
| `--color-icon-plan` / `-ai` / `-team` / `-automation` | `#4F6BFF` / `#8A5CFF` / `#2EBF8B` / `#FF9F43` | Feature icon tiles | Feature cards |
| `--color-menu-ink` | `#1E293B` | Mobile menu (16:584) | Menu link text |
| `--color-menu-icon` | `#94A3B8` | Mobile menu | Chevrons |
| `--color-menu-close` | `#334155` | Mobile menu | Close icon |
| `--color-menu-border` | `#E2E8F0` | Mobile menu | "Log In" outline |
| `--color-menu-cta-from` / `-to` / `-glow` | `#5B47FB` → `#4F46E5`, `#C7D2FE` | Mobile menu "Start Free" | Menu CTA gradient and shadow |

Gradients are written `bg-linear-to-r/srgb from-… to-…`: Tailwind 4 interpolates in OKLab by default, Figma in sRGB.

## Typography

Fonts: **Inter** (variable, 400–800 incl. 750) and **Plus Jakarta Sans** 600 (mobile menu only), loaded from Google Fonts in `index.html`. `--font-weight-heavy: 750` covers the mobile headings.

| Token | Size / line height | Figma source | Used for |
| ----- | ------------------ | ------------ | -------- |
| `text-3xs` | 8 / 10 | Inter 500 8/10 | Mobile mockup stat labels |
| `text-mock-status` | 8.5 / 12.75 | Inter 600 | Mobile mockup task status |
| `text-mock-task` | 9.5 / 14.25 | Inter 500 | Mobile mockup task names |
| `text-mock-caption` | 9.5 / 11.88 | Inter 400 | Mobile mockup subtitle |
| `text-badge-sm` | 10 / 10 | Inter 700/500 | Mobile "New" badge |
| `text-tiny` | 10 / 15 | Inter 400 | Mobile testimonial role |
| `text-2xs` | 11 / 16.5 | Inter 400–700 (31 layers) | Captions, badge, counter, terms, mockup |
| `text-xs` | 12 / 18 | Inter 400–700 (57) | Tabs, pricing lists, mobile labels |
| `text-sm` | 13 / 19.5 | Inter 400–700 (48) | Nav, buttons, labels, footer |
| `text-field-sm` / `text-field` | 13 / 24, 14 / 24 | Inter 400 | Form controls (mobile / desktop) |
| `text-body-relaxed` | 13 / 21.13 | Inter 400 | Contact intro |
| `text-feature-body` | 13 / 16.9 | Inter 400 | Feature card copy |
| `text-base` | 14 / 21 | Inter 400–700 | Subtitles, mockup headings |
| `text-lead-sm` | 14 / 20 | Inter 400 | Mobile hero lead |
| `text-stat-sm` | 14 / 14 | Inter 700 | Mobile mockup stat values |
| `text-feature-title-sm` | 14 / 17.5 | Inter 700 | Mobile feature titles |
| `text-quote-sm` | 14 / 19 | Inter 500 | Mobile testimonial quote |
| `text-md` | 15 / 22.5 | Inter 400 | Section subtitles |
| `text-lg` | 16 / 24 | Inter 700 | Card titles, plan names |
| `text-card-title` | 16 / 22 | Inter 700 | Workflow tab card |
| `text-logo` | 17 / 25.5 | Inter 700 | Logo-sized text, "AI" tile |
| `text-xl` | 18 / 29.25 | Inter 400 | Hero lead |
| `text-quote` | 18 / 24.3 | Inter 500 | Testimonial quote |
| `text-2xl` | 20 / 25 | Inter 700 | Mockup greeting |
| `text-stat` | 21 / 26.25 | Inter 700 | Mockup stat values |
| `text-logo-strip` | 22 / 33 | Inter 600 | Trusted-by names |
| `text-h3` | 24 / 30 | Inter 750 | Mobile contact title |
| `text-h2-sm` | 26 / 28 | Inter 750 | Mobile section titles |
| `text-h2-sm-loose` | 26 / 45 | Inter 800 | Mobile testimonials title |
| `text-h2-md` | 30 / 37.5 | Inter 800 | Workflow title |
| `text-h2` | 34 / 51 | Inter 800, ls −0.85 | Features title (+ `tracking-tight`) |
| `text-h2-tight` | 34 / 37.4 | Inter 800 | Contact title |
| `text-price-sm` / `text-price` | 34 / 42.5, 34 / 34 | Inter 700 | Plan price (mobile / desktop) |
| `text-h2-lg` | 36 / 45 | Inter 800 | Testimonials title |
| `text-h2-lg-loose` | 36 / 54 | Inter 800 | Pricing title |
| `text-display-sm` | 36 / 36, −0.025em | Inter 750, ls −0.9 | Mobile hero h1 |
| `text-stat-lg` | 40 / 40 | Inter 800 | Workflow stat |
| `text-quote-mark-sm` / `text-quote-mark` | 44 / 44, 54 / 54 | Inter 700 | Quote mark |
| `text-display` | 58 / 62.64, −0.025em | Inter 800, ls −1.45 | Desktop hero h1 |
| `text-menu` | 16.8 / 25.2 | Plus Jakarta Sans 600 | Mobile menu links |
| `text-menu-cta` | 15.7 / 23.52 | Plus Jakarta Sans 600 | Mobile menu buttons |

Letter spacing (Figma px ÷ size): `tracking-tight` −0.025em (logo, hero, features title), `tracking-wide` 0.025em ("TESTIMONIALS", "Most Popular"), `tracking-wider` 0.05em ("GET IN TOUCH"), `tracking-widest` 0.1em (stars).

## Radii, shadows, motion

| Token | Value | Figma source | Used for |
| ----- | ----- | ------------ | -------- |
| `rounded-xs` | 4px | 4 (5) | Mobile mockup checkbox, terms checkbox |
| `rounded-sm` | 6px | 6 (4) | Mockup checkbox |
| `rounded-md` | 8px | 8 (19) | Inputs, mockup nav item, progress |
| `rounded-control` | 10px | 10 (26) | Buttons, tabs, slider controls |
| `rounded-lg` | 12px | 12 (18) | Stat cards, icon tiles, menu items |
| `rounded-pill-sm` / `rounded-pill` | 13px / 14px | 13 (1), 14 (9) | Pill badge, sidebar, tab card, mobile cards |
| `rounded-card` | 16px | 16 (12) | Cards |
| `rounded-card-lg` | 18px | 18 (4) | Mockup, testimonial card |
| `rounded-banner` | 24px | 24 (2) | Workflow banner |
| `shadow-xs` | `0 1px 2px #0000000D` | (8) | Buttons |
| `shadow-sm` | `0 1px 3px #0000001A, 0 1px 2px -1px #0000001A` | (3+3) | Reserved (mobile button shadow) |
| `shadow-card` | `0 10px 36px #1D2A571A` | (5) | Mockup, testimonial, featured plan, contact card |
| `shadow-menu` | `0 25px 50px -12px #00000040` | (1) | Mobile menu panel |
| `shadow-menu-cta` | `0 1px 2px var(--color-menu-cta-glow)` | (1) | Menu "Start Free" |
| `shadow-header` | `0 8px 24px -16px #1D2A5740` | not in Figma | Sticky header once the page scrolls (`scroll-shadow`) |
| `ease-smooth` | `cubic-bezier(0.22, 1, 0.36, 1)` | not in Figma | Entrances, hover lifts, nav underline |
| `animate-fade-in` | 200ms ease-out, 4px rise | not in Figma | Tab panel, success state, menu items (`motion-safe:` only) |
| `animate-fade-up` | 700ms ease-smooth, 16px rise | not in Figma | Hero entrance, staggered with `anim-delay-*` |
| `animate-menu-in` | 250ms, 8px drop | not in Figma | Mobile menu opening |
| `animate-slide-enter-next` / `-prev`, `animate-slide-exit-next` / `-prev` | 600ms in / 450ms out, 48px slide + 0.98 scale + 4px blur | not in Figma | Testimonial slide changes (direction-aware) |
| `animate-price-in` | 450ms ease-smooth, 12px rise + 3px blur | not in Figma | Prices and "/month"/"/year" rolling in when the billing period changes |
| `animate-tab-enter-next` / `-prev` | 450ms ease-smooth, 24dp slide from the side of travel + 2dp blur | not in Figma | Workflow tab copy when the tab changes (D-33) |
| `animate-bar-grow` | 900ms ease-smooth, 300ms delay, width from 0 (fill backwards) | not in Figma | Workflow progress bar, once, when its banner is revealed (`in-data-revealed:`) (D-33) |
| `animate-slide-progress` | 6s linear scaleX 0→1 | not in Figma | Active testimonial bullet = autoplay clock; `animation-paused` utility freezes it |
| `.reveal` (+ `useRevealOnScroll`) | 700ms rise (32dp) and fade, once, when 15% is on screen; `--reveal-delay` staggers lists | not in Figma | Section blocks and cards (D-25) |
| `--spacing-hairline` | `2px` | not in Figma | Nav underline and scroll-progress bar: fixed px so they never render thicker mid-animation (D-25) |
| `scrollbar-none` (utility) | `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` | not in Figma | Mobile workflow tab row and pricing cards: still scroll, no visible scrollbar (D-35) |
| `scroll-progress` / `scroll-shadow` (utilities) | CSS scroll-driven animations (`animation-timeline: scroll(root)`) | not in Figma | Section fade-up on entry, header reading-progress bar, header shadow; inactive without browser support or with reduced motion |
| `autofill-bg-*` (utility) | On `:autofill` only: inset shadow (100vmax) in the named colour token, `-webkit-text-fill-color` ink | not in Figma | Form fields keep their design background and text when the browser autofills them; Chrome would paint them `#E8F0FE` with black text (D-27). Contact fields: `autofill-bg-surface-muted md:autofill-bg-white` |

## Layout & breakpoints

| Token | Value | Notes |
| ----- | ----- | ----- |
| `Container` | no max-width | Gutters `px-20` / `md:px-32` / `lg:px-64` (dp), as in the Figma frames. From `lg` the gutter is `max(64dp, (100% − 1152dp) / 2)`: the desktop root scales from 16px at 1280 to 18px at 1440 (D-29), so the content is the frame's 1152dp, and wider screens keep the 1440 size with the content centred (D-30). Two-column rows are `fr` grids in Figma's proportions. |
| `--dp` | `calc(1rem / 12)` → `calc(1rem / 16)` from md | One Figma pixel; also the spacing unit (`--spacing: var(--dp)`). |
| `--breakpoint-md` | `48rem` (768px) | Tailwind default; tablet. Desktop type/card styles start here. |
| `--breakpoint-lg` | `64rem` (1024px) | Desktop navigation replaces the hamburger. |
| `--breakpoint-xl` | `80rem` (1280px) | Two-column desktop layouts (= the Figma desktop frame). |

Spacing uses `--spacing: var(--dp)`, so the class number is the Figma px. Tailwind 4 generates any multiple of 0.25, so half pixels (19.5px → `h-19.5`) are exact.

## Contrast checks

WCAG 2.2 AA: 4.5:1 for normal text, 3:1 for large text and UI component boundaries.

| Foreground | Background | Ratio | Passes AA? |
| ---------- | ---------- | ----- | ---------- |
| ink `#101828` | white | 17.75 | ✅ |
| muted `#667085` | white | 4.97 | ✅ |
| muted | tint-from `#F2F6FF` | 4.60 | ✅ |
| muted | tint-to `#F6F1FF` | 4.49 | ⚠️ just under 4.5 (right edge of hero/contact gradient, 13–18px text) |
| muted | primary-wash `#EEF2FF` | 4.45 | ⚠️ just under 4.5 ("AI-powered workflow…" badge, 10–11px) |
| muted | surface-muted `#F6F8FC` | 4.68 | ✅ |
| primary `#2F5BFF` | white / primary-wash / primary-tint | 5.17 / 4.62 / 4.53 | ✅ |
| white | gradient `#2F5BFF` → `#7B4DFF` | 5.17 → 4.83 | ✅ |
| white | menu gradient `#5B47FB` → `#4F46E5` | 5.62 → 6.29 | ✅ |
| accent `#7B4DFF` (quote mark) | white | 4.83 | ✅ |
| danger `#D92D20` | white | 4.83 | ✅ |
| menu-ink `#1E293B` | white | 14.63 | ✅ |
| logos `#7A879B` | white | 3.64 | ⚠️ passes only as logotypes (WCAG exempts logos); fails as 13px text |
| placeholder `#6B7280` (checkbox border) | white | 4.83 | ✅ (UI ≥ 3:1) |
| border `#DCE3F0` (input outline) | white | 1.29 | ⚠️ below 3:1 for UI boundaries; inputs stay identifiable through labels/placeholders, but this is a design-level issue |
| subtle / success / warning (mockup statuses) | white | 2.58 / 2.65 / 2.04 | ⚠️ fail, but only inside the decorative `role="img"` dashboard, which is summarised by its label |
| rating `#F7B500` (stars) | white | 1.82 | ⚠️ decorative; exposed as "Rated 5 out of 5" |

The ⚠️ rows are brand colours from the design and were **not changed**; they're listed for the developer to decide (see decisions D-15).
