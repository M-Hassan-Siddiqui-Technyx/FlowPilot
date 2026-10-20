---
paths:
  - "src/**/*.test.{ts,tsx}"
  - "src/test/**"
---

# Testing (Vitest + React Testing Library)

## Writing Tests

- **Test what the user sees.**
  - Query by role, label or text, e.g. `getByRole('button', { name: /next testimonial/i })`.
  - Use `data-testid` only as a last resort.
  - Don't assert on internal state or class names.
- **Interact with `userEvent.setup()`** and `await` every call. Don't use `fireEvent`.
- **Import test APIs from `vitest` explicitly** (`describe`, `it`, `expect`, `vi`); globals are off. The jest-dom matchers and the `cleanup` call are already in `src/test/setup.ts`.
- **Waiting for async UI:** use `findBy*` or `waitFor`. For the ~1s simulated submit, either:
  - pass a longer timeout (`findByText(…, {}, { timeout: 2000 })`; the default of 1000ms is too tight), or
  - use fake timers: `vi.useFakeTimers({ shouldAdvanceTime: true })` together with `userEvent.setup({ advanceTimers: vi.advanceTimersByTime })`.
- **Keep tests independent.** No shared mutable state and no snapshot tests.

## Coverage (brief §12)

**Required**
- An invalid form can't submit.
- Team Size `200+` shows Preferred Demo Time and makes it required, and switching back stops it from blocking submission.
- Tabs change the displayed content.

**Recommended**
- The mobile menu opens and closes, and closes when a link is selected.
- Slider Previous/Next and the active indicator work.
- Double submission is prevented.
- The success message appears.

## Done Means

- A test must fail if the behaviour breaks. After writing a new test, break the code once to prove it.
- `npm test` passes with no act() warnings or console errors.
