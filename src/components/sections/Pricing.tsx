import { useState } from 'react'
import { sectionIds } from '../../data/navigation'
import { billingPeriods, defaultBillingPeriod, plans } from '../../data/pricing'
import { cn } from '../../lib/cn'
import type { BillingPeriod } from '../../types/pricing'
import { Container } from '../ui/Container'
import { PricingCard } from './PricingCard'

// Button widths from Figma (Monthly 92px, Yearly 80px, 8px apart); the gradient pill matches the active one.
const toggleWidth: Record<BillingPeriod, string> = { monthly: 'w-92', yearly: 'w-80' }
const toggleThumb: Record<BillingPeriod, string> = { monthly: 'w-92 translate-x-0', yearly: 'w-80 translate-x-100' }

/** Pricing (Figma desktop 1:812, mobile 2:1184). Mobile shows the cards in a sideways-scrolling row, featured first. */
export function Pricing() {
  const [period, setPeriod] = useState<BillingPeriod>(defaultBillingPeriod)
  const suffix = billingPeriods.find((option) => option.id === period)?.suffix ?? ''

  return (
    <section id={sectionIds.pricing} aria-labelledby="pricing-title" className="pt-24 pb-28 md:pt-80 md:pb-94">
      <Container>
        <div className="reveal md:mx-auto md:flex md:max-w-672 md:flex-col md:items-center md:gap-8 md:text-center">
          <h2
            id="pricing-title"
            className="mb-18 text-h2-sm font-heavy text-ink md:mb-0 md:text-h2-lg-loose md:font-extrabold"
          >
            Simple, transparent
            <br className="md:hidden" /> pricing
          </h2>
          <p className="mb-20 text-xs text-muted md:mb-0 md:text-base">Choose the plan that works best for your team.</p>
          {/* Layers (isolate): white bordered buttons → gradient pill that slides to the active one → labels on top. */}
          <div role="group" aria-label="Billing period" className="relative isolate flex gap-8 md:mt-16">
            <span
              aria-hidden="true"
              className={cn(
                'absolute top-0 left-0 z-10 h-36 rounded-control bg-linear-to-r/srgb from-primary to-accent motion-safe:transition-all motion-safe:duration-400 motion-safe:ease-smooth',
                toggleThumb[period],
              )}
            />
            {billingPeriods.map((option) => {
              const active = option.id === period
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setPeriod(option.id)}
                  className={cn(
                    // before: extends the 36px buttons to a 44px touch target without changing layout.
                    'group focus-ring relative h-36 rounded-control border border-border bg-white text-xs font-semibold before:absolute before:-inset-y-4 before:inset-x-0 motion-safe:transition',
                    toggleWidth[option.id],
                    !active && 'hover:border-primary',
                  )}
                >
                  <span
                    className={cn(
                      'relative z-20 motion-safe:transition-colors motion-safe:duration-400',
                      active ? 'text-white' : 'text-ink group-hover:text-primary',
                    )}
                  >
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <ul className="-mx-20 mt-12 flex scrollbar-none snap-x snap-mandatory scroll-px-20 gap-24 overflow-x-auto px-20 pb-4 md:mx-0 md:mt-86 md:grid md:snap-none md:grid-cols-3 md:gap-24 md:overflow-visible md:px-0 md:pb-0 xl:gap-42">
          {/* Each card reveals on its own (also when swiped into view on mobile), 90ms apart on desktop. */}
          {plans.map((plan, index) => (
            <li
              key={plan.id}
              className={cn('reveal w-277 shrink-0 snap-start md:w-auto', plan.featured && 'order-first md:order-none')}
              style={{ '--reveal-delay': `${index * 90}ms` }}
            >
              <PricingCard plan={plan} price={plan.price[period]} suffix={suffix} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
