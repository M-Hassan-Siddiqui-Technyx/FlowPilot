import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'

type FormFieldProps = {
  id: string
  label: string
  /** Shows the design's "*" from md up; every field in this form is required. */
  required?: boolean
  error?: string
  errorId: string
  className?: string
  /** Extra content positioned against the field, e.g. a character counter. */
  aside?: ReactNode
  children: ReactNode
}

/** Label + control + error message. The caller wires `aria-invalid`/`aria-describedby` on the control. */
export function FormField({ id, label, required, error, errorId, className, aside, children }: FormFieldProps) {
  return (
    <div className={cn('relative flex flex-col gap-4 md:gap-6', className)}>
      <label htmlFor={id} className="text-xs font-medium text-ink md:text-sm md:font-semibold">
        {label}
        {required && (
          <span aria-hidden="true" className="hidden md:inline">
            {' *'}
          </span>
        )}
      </label>
      {children}
      {aside}
      {error && (
        <p id={errorId} className="text-2xs font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
