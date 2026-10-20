---
paths:
  - "src/**/*Form*.{ts,tsx}"
  - "src/**/*form*.{ts,tsx}"
  - "src/**/Contact*.{ts,tsx}"
---

# Forms (React Hook Form)

The spec is in `docs/requirements.md` under "Contact Form". Wording the brief fixes must match exactly. In particular, the success message is **"Thanks! Our team will contact you shortly."**

## Values and Validation

- Use one typed values object (`type ContactFormValues = { … }`) and `useForm<ContactFormValues>()`. Choose a validation `mode` deliberately and record why in `docs/decisions.md`.
- Put validation rules in `register` options. Don't add a schema library unless it's agreed first.
- Error messages say what to fix ("Enter at least 3 characters"), not just "Invalid".

## Field Markup

- Every field has a `<label htmlFor>`.
- When a field has an error:
  - set `aria-invalid="true"` on it
  - give the error element an `id`
  - list that `id` in the field's `aria-describedby`
- **Team Size** is a `<select>` whose placeholder option has `value=""`, so the `required` rule works.
- **Message** shows a live `N / 300` counter based on the watched value, and the counter is also listed in `aria-describedby`.
- **Terms** is a required checkbox with its own error message.

## Conditional Field

**Preferred Demo Time** is rendered only when Team Size is `200+` (use `useWatch` or `watch`).

When the field is hidden, its value and its validation must go away too, for example by registering it with `shouldUnregister: true`. Test both directions:
- Choosing `200+` shows the field and makes it required.
- Switching away hides the field and lets the form submit.

## Submission

- Pass an async submit handler to `handleSubmit` that waits about 1000ms to simulate the request.
- While submitting:
  - set `disabled={isSubmitting}` on the button
  - change the visible label (e.g. "Submitting…")
- A double click or Enter-spam must not send twice. Verify this with a test.
- After success, show the exact success message in a `role="status"` region so screen readers announce it.
