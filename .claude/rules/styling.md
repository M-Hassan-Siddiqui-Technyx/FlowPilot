# Styling: Use Tokens, Never Hard-Coded Values

The target is a **pixel-perfect** match with Figma at the desktop frame's 1280px (the brief's 1440 page is that layout ×1.125) and 375px, checked against the Figma MCP. Exactness comes from exact token values and exact spacing-scale numbers, never from hard-coded values.

Every visual value comes from a design token. Tokens live in the `@theme` block in `src/index.css`. They are taken from the Figma variables and documented in `docs/design-tokens.md`. Components use the Tailwind utilities those tokens generate. A design change should be a one-line token edit, not a search-and-replace.

## Colours

- Use token utilities only, e.g. `bg-primary`, `text-ink`, `text-muted`, `border-border`, `ring-focus`. (These names are examples; use whatever the token file defines.)
- **Never** write a literal colour in a component:
  - `bg-[#4F46E5]`, `text-[rgb(0,0,0)]`, `style={{ color: '#fff' }}`
  - default palette colours like `bg-indigo-600` or `text-gray-500`; they are not from the design
- Opacity modifiers on tokens are fine: `bg-primary/10`.
- Missing a colour? Add a semantic token to `@theme`, named by role (`--color-surface-muted`, not `--color-light-grey-2`). Document it in `docs/design-tokens.md`, then use it.
- In custom CSS, reference `var(--color-primary)`, never the literal value.

## Breakpoints and Media Queries

- **Mobile-first.** Unprefixed classes give the 375px mobile layout. Use `md:` for tablet (768px) and `lg:`/`xl:` for desktop (designed at 1440px).
- Only use breakpoint variants defined by `--breakpoint-*` tokens. **No arbitrary breakpoints** such as `min-[900px]:` or `max-[767px]:`. Avoid `max-*:` variants unless there is no mobile-first way to express the change.
- In CSS files, **never write pixel media queries** like `@media (min-width: 768px)`. Use `@variant md { … }` or `@media (width >= theme(--breakpoint-md))`.
- Need a new breakpoint? Add `--breakpoint-<name>` to `@theme` instead of writing an inline value.
- Wrap non-essential animation in `motion-safe:`, and respect `prefers-reduced-motion`.

## Spacing, Sizing, Typography, Effects

- **Spacing and sizing** use the `--spacing` scale, which is one design pixel (`--dp`, rem-based, see `src/index.css`). The class number is the **exact** Figma px: 24 → `p-24`, 13 → `p-13`, 19.5 → `h-19.5`, 640 → `max-w-640`. Tailwind 4 accepts any multiple of 0.25, so pixel-exact never needs an arbitrary value. Don't round to a "nicer" step; the design is pixel-perfect.
- **Everything is rem.** The root font size is fluid (12px at 375, 16px at 1280 = the desktop frame, 18px at 1440), so never write `px` lengths in components or tokens; token lengths are `calc(var(--dp) * px)`. Hairlines (1–2px borders, focus outlines) are the only px exception.
- **Fonts, font sizes, line heights, letter spacing, radii, shadows and easing** use tokens only, e.g. `font-display`, `text-display`, `rounded-card`, `shadow-card`.
  - Not allowed: `text-[42px]`, `rounded-[14px]`, `shadow-[0_4px_12px_…]`.
- **Page width** comes from the shared `Container` component (no max-width; fluid gutters). Don't repeat `mx-auto px-…` or add a max-width in each section.

## Allowed Exceptions

Arbitrary values are allowed only for non-design geometry that has no token equivalent, and each one needs a short comment explaining it:
- grid templates (`grid-cols-[auto_1fr]`)
- percentage positions inside the decorative dashboard visual
- `calc()` expressions built from tokens

Never use them for colours, fonts or breakpoints.

## General

- **No inline `style`** except for values computed at runtime. Even then, set a CSS variable and use it from a class.
- **No parallel CSS system:** no CSS modules and no `@apply` chains for component styles. A repeated set of classes should become a component (Button, Card), not a CSS class. Use `@utility` only for a genuinely reusable custom utility.
- **Focus** uses `focus-visible:` with the focus token. Never remove the outline without a visible replacement.
- **Hover, active, disabled and selected states** follow the Figma component/state reference area.
