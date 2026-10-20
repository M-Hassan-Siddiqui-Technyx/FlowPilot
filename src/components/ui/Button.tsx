import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

type ButtonVariant = 'primary' | 'secondary'

type VariantProps = { variant?: ButtonVariant }
type ButtonAsButton = VariantProps & ComponentPropsWithoutRef<'button'> & { href?: undefined }
type ButtonAsLink = VariantProps & ComponentPropsWithoutRef<'a'> & { href: string }
type ButtonProps = ButtonAsButton | ButtonAsLink

// Hover lifts by 2px and press settles back, with a soft ease (motion-safe only).
const base =
  'focus-ring inline-flex items-center justify-center rounded-control font-semibold motion-safe:transition motion-safe:duration-200 motion-safe:ease-smooth motion-safe:hover:-translate-y-2 motion-safe:active:translate-y-0 motion-safe:active:scale-98'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-linear-to-r/srgb from-primary to-accent text-white shadow-xs hover:shadow-card hover:brightness-110 active:brightness-95 disabled:pointer-events-none disabled:opacity-70',
  secondary: 'border border-border bg-white text-ink hover:border-primary hover:text-primary hover:shadow-xs',
}

/**
 * Brand button. Renders an `<a>` when `href` is given (section CTAs), otherwise a `<button>`.
 * Size and width vary per placement in the design, so callers pass them in `className`.
 */
export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { variant = 'primary', className, ...rest } = props
    return <a className={cn(base, variants[variant], className)} {...rest} />
  }
  const { variant = 'primary', className, type = 'button', ...rest } = props
  return <button type={type} className={cn(base, variants[variant], className)} {...rest} />
}
