import { useEffect, useRef } from 'react'
import { useForm, useWatch, type FieldPath } from 'react-hook-form'
import {
  demoTeamSize,
  demoTimeOptions,
  messageLength,
  successMessage,
  teamSizeOptions,
} from '../../data/contact'
import { cn } from '../../lib/cn'
import { submitContactRequest } from '../../lib/submitContactRequest'
import type { ContactFormValues } from '../../types/contact'
import { Button } from '../ui/Button'
import { FormField } from '../ui/FormField'
import { Icon } from '../ui/Icon'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Focus shows as a grey border instead of a ring (developer's choice, D-28); red stays on invalid fields.
// outline-hidden (a transparent outline) hides the browser's own ring but still shows one in forced-colours mode.
const controlBase =
  'w-full rounded-md border border-border bg-surface-muted autofill-bg-surface-muted text-field-sm placeholder:text-muted focus:border-muted focus:outline-hidden aria-invalid:border-danger md:bg-white md:autofill-bg-white md:text-field motion-safe:transition'
const inputClasses = cn(controlBase, 'h-40 px-12 text-ink md:h-46 md:px-14')
const selectClasses = cn(controlBase, 'h-40 appearance-none pr-40 pl-12 md:h-46 md:pl-14')

const defaultValues: ContactFormValues = {
  fullName: '',
  workEmail: '',
  companyName: '',
  teamSize: '',
  message: '',
  terms: false,
}

type ContactFormProps = {
  /** Injected for tests; defaults to the simulated ~1s request. */
  onSubmitRequest?: (values: ContactFormValues) => Promise<void>
}

/**
 * Contact form (Figma desktop 1:918, mobile 2:1234).
 * Validation runs when a field loses focus, then on every change (`onTouched`); see docs/decisions.md.
 */
export function ContactForm({ onSubmitRequest = () => submitContactRequest() }: ContactFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setFocus,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({ mode: 'onTouched', defaultValues, shouldUnregister: true })

  const teamSize = useWatch({ control, name: 'teamSize' })
  const message = useWatch({ control, name: 'message' }) ?? ''
  const showDemoTime = teamSize === demoTeamSize

  // Focus follows the swap: success panel after sending, first field after "Send another message".
  const successRef = useRef<HTMLDivElement>(null)
  const showedSuccess = useRef(false)
  useEffect(() => {
    if (isSubmitSuccessful) {
      showedSuccess.current = true
      successRef.current?.focus()
    } else if (showedSuccess.current) {
      showedSuccess.current = false
      setFocus('fullName')
    }
  }, [isSubmitSuccessful, setFocus])

  const a11y = (name: FieldPath<ContactFormValues>, describedBy?: string) => {
    const errorId = `contact-${name}-error`
    const invalid = Boolean(errors[name])
    return {
      id: `contact-${name}`,
      'aria-required': true,
      'aria-invalid': invalid || undefined,
      'aria-describedby': cn(describedBy, invalid && errorId) || undefined,
    }
  }
  const errorProps = (name: FieldPath<ContactFormValues>) => ({
    id: `contact-${name}`,
    errorId: `contact-${name}-error`,
    error: errors[name]?.message,
  })

  // No repeat submissions: the submit button is disabled while isSubmitting, which also blocks implicit (Enter) submission.
  const onSubmit = (values: ContactFormValues) => onSubmitRequest(values)

  return (
    <>
      <div role="status" aria-live="polite">
        {isSubmitSuccessful && (
          <div
            ref={successRef}
            tabIndex={-1}
            className="focus-ring flex flex-col items-center gap-16 rounded-card py-40 text-center motion-safe:animate-fade-in"
          >
            <span className="flex size-48 items-center justify-center rounded-full bg-success/10 text-success">
              <Icon name="check" className="w-20" />
            </span>
            <p className="text-lg font-bold text-ink">{successMessage}</p>
            <Button variant="secondary" className="h-40 px-20 text-sm" onClick={() => reset()}>
              Send another message
            </Button>
          </div>
        )}
      </div>

      {!isSubmitSuccessful && (
        <form
          noValidate
          aria-label="Contact FlowPilot"
          onSubmit={(event) => void handleSubmit(onSubmit)(event)}
          className="grid gap-14 md:grid-cols-2 md:gap-x-20 md:gap-y-19"
        >
          <FormField label="Full Name" required {...errorProps('fullName')}>
            <input
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              className={inputClasses}
              {...a11y('fullName')}
              {...register('fullName', {
                validate: (value) => value.trim().length >= 3 || 'Enter your full name (at least 3 characters).',
              })}
            />
          </FormField>

          <FormField label="Work Email" required {...errorProps('workEmail')}>
            <input
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              className={inputClasses}
              {...a11y('workEmail')}
              {...register('workEmail', {
                required: 'Enter your work email.',
                pattern: { value: EMAIL_PATTERN, message: 'Enter a valid email address, like name@company.com.' },
              })}
            />
          </FormField>

          <FormField label="Company Name" required {...errorProps('companyName')}>
            <input
              type="text"
              autoComplete="organization"
              placeholder="Acme Inc."
              className={inputClasses}
              {...a11y('companyName')}
              {...register('companyName', {
                validate: (value) => value.trim().length > 0 || 'Enter your company name.',
              })}
            />
          </FormField>

          <FormField label="Team Size" required {...errorProps('teamSize')}>
            <div className="relative">
              <select
                className={cn(selectClasses, teamSize === '' ? 'text-muted' : 'text-ink')}
                {...a11y('teamSize')}
                {...register('teamSize', { required: 'Select your team size.' })}
              >
                <option value="">Select team size</option>
                {teamSizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevronDown"
                className="pointer-events-none absolute top-1/2 right-9 size-20 -translate-y-1/2 text-placeholder md:size-21"
              />
            </div>
          </FormField>

          {showDemoTime && (
            <FormField
              label="Preferred Demo Time"
              required
              className="motion-safe:animate-fade-in md:col-span-2"
              {...errorProps('demoTime')}
            >
              <div className="relative">
                <select
                  className={cn(selectClasses, 'text-ink')}
                  {...a11y('demoTime')}
                  {...register('demoTime', { required: 'Choose a preferred demo time.' })}
                >
                  <option value="">Select a time</option>
                  {demoTimeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevronDown"
                  className="pointer-events-none absolute top-1/2 right-9 size-20 -translate-y-1/2 text-placeholder md:size-21"
                />
              </div>
            </FormField>
          )}

          <FormField
            label="Message"
            required
            className="md:col-span-2 md:pb-6"
            {...errorProps('message')}
            aside={
              // Beside the label on mobile, inside the textarea's bottom-right corner from md (as designed).
              <p
                id="contact-message-count"
                className={cn(
                  'absolute top-0 right-0 text-2xs md:top-auto md:right-12 md:bottom-10',
                  message.length > messageLength.max ? 'font-semibold text-danger' : 'text-muted',
                  errors.message && 'md:bottom-32',
                )}
              >
                {message.length} / {messageLength.max}
              </p>
            }
          >
            <textarea
              placeholder="Tell us about your needs…"
              className={cn(controlBase, 'h-94 resize-none p-10 text-ink md:h-78 md:p-12 md:placeholder:text-placeholder')}
              {...a11y('message', 'contact-message-count')}
              {...register('message', {
                validate: (value) => {
                  const length = value.trim().length
                  if (length === 0) return 'Enter a message.'
                  if (length < messageLength.min) return `Enter at least ${messageLength.min} characters.`
                  if (value.length > messageLength.max) return `Keep it to ${messageLength.max} characters or fewer.`
                  return true
                },
              })}
            />
          </FormField>

          <div className="md:col-span-2">
            {/* Mobile: 13px of extra padding above and below (cancelled by negative margins) makes the row a 44px touch target. */}
            <label htmlFor="contact-terms" className="-my-13 flex items-start gap-8 pt-15 pb-13 text-2xs text-muted md:my-0 md:items-center md:gap-6 md:pt-5 md:pb-0">
              <span className="relative mt-1 flex shrink-0 md:mt-0">
                <input
                  type="checkbox"
                  className="peer focus-ring size-14 appearance-none rounded-xs border border-placeholder bg-white checked:border-primary checked:bg-primary aria-invalid:border-danger md:size-16"
                  {...a11y('terms')}
                  {...register('terms', { validate: (value) => value || 'Accept the Terms of Service and Privacy Policy to continue.' })}
                />
                <Icon name="checkbox" className="pointer-events-none absolute inset-0 hidden size-full text-white peer-checked:block" />
              </span>
              <span>
                I agree to the Terms of Service and Privacy Policy
                <span aria-hidden="true"> *</span>
              </span>
            </label>
            {errors.terms && (
              <p id="contact-terms-error" className="mt-4 text-2xs font-medium text-danger">
                {errors.terms.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 h-42 w-full text-sm md:col-span-2 md:mt-0 md:h-43"
          >
            {isSubmitting ? 'Sending…' : 'Send Message'}
          </Button>
        </form>
      )}
    </>
  )
}
