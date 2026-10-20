import { ctaLinks } from '../../data/navigation'
import { cn } from '../../lib/cn'
import type { Plan } from '../../types/pricing'
import { Button } from '../ui/Button'
import { Icon } from '../ui/Icon'

type PricingCardProps = {
  plan: Plan
  price: number
  suffix: string
}

/** Plan card (Figma desktop 1:825 / 1:849, mobile 2:1190). The featured plan gets the gradient banner. */
export function PricingCard({ plan, price, suffix }: PricingCardProps) {
  const titleId = `plan-${plan.id}-title`
  return (
    <article
      aria-labelledby={titleId}
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-card bg-white motion-safe:transition motion-safe:duration-300 motion-safe:ease-smooth md:min-h-302 md:hover:-translate-y-4 md:hover:shadow-card',
        plan.featured ? 'border-2 border-primary shadow-xs md:shadow-card' : 'border border-border pt-30 md:pt-0 md:hover:border-primary/40',
      )}
    >
      {plan.featured && (
        <p className="flex h-30 shrink-0 items-center justify-center bg-linear-to-r/srgb from-primary to-accent text-xs font-bold tracking-wide text-white">
          Most Popular
        </p>
      )}
      <div className={cn('flex flex-1 flex-col p-24', plan.featured && 'md:pt-8')}>
        <h3 id={titleId} className="text-lg font-bold text-ink">
          {plan.name}
        </h3>
        <p className="flex items-baseline gap-4 pt-4 pb-2 md:mt-4 md:pb-0">
          {/* Keyed by the suffix, so both spans remount and roll in whenever the billing period changes. */}
          <span key={`price-${suffix}`} className="text-price-sm font-bold text-ink motion-safe:animate-price-in md:text-price">
            ${price}
          </span>
          <span
            key={`suffix-${suffix}`}
            className="text-xs font-medium text-muted motion-safe:animate-price-in motion-safe:anim-delay-80"
          >
            {suffix}
          </span>
        </p>
        <p className="mb-20 text-xs text-muted md:mt-4 md:mb-0">{plan.description}</p>
        {/* Mobile keeps Figma's 24dp above the button. Figma's 302px desktop cards leave the Pro card only 2px here
            (its banner takes the room), so md keeps at least 8dp (D-26); every card grows 6dp to stay equal height. */}
        <ul className="mb-24 flex flex-col gap-10 md:mb-8 md:gap-6 md:pt-16">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-12 text-xs text-muted md:gap-8">
              <Icon name="check" className="w-9 shrink-0 text-success" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <Button
          href={ctaLinks.contactSales.href}
          variant={plan.featured ? 'primary' : 'secondary'}
          aria-label={`${ctaLinks.contactSales.label} with ${plan.name}`}
          className="mt-auto h-40 w-full text-sm"
        >
          <span>{ctaLinks.contactSales.label}</span>
        </Button>
      </div>
    </article>
  )
}
