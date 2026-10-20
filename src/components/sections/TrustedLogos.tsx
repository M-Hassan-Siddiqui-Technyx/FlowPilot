import { companies } from '../../data/features'
import { cn } from '../../lib/cn'
import type { BrandColor, Company } from '../../types/features'
import { Container } from '../ui/Container'

const hoverColor: Record<BrandColor, string> = {
  'google-blue': 'group-hover:text-brand-google-blue',
  'google-red': 'group-hover:text-brand-google-red',
  'google-yellow': 'group-hover:text-brand-google-yellow',
  'google-green': 'group-hover:text-brand-google-green',
  slack: 'group-hover:text-brand-slack',
  notion: 'group-hover:text-brand-notion',
  spotify: 'group-hover:text-brand-spotify',
  zoom: 'group-hover:text-brand-zoom',
  shopify: 'group-hover:text-brand-shopify',
}

/**
 * A company name that takes on its brand colours on hover (D-32): the colour sweeps through the letters from left to
 * right while the name lifts slightly. Tailwind applies hover only on devices that can hover, so touch never sticks.
 */
function Wordmark({ name, colors }: Pick<Company, 'name' | 'colors'>) {
  return (
    <span className="inline-block motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-smooth motion-safe:group-hover:-translate-y-3 motion-safe:group-hover:scale-105">
      <span aria-hidden="true">
        {[...name].map((letter, position) => (
          <span
            // A letter's position in the fixed name is its identity.
            key={`${name}-${position}`}
            className={cn('transition-colors duration-300 ease-smooth delay-(--letter-delay)', hoverColor[colors[position % colors.length]])}
            style={{ '--letter-delay': `${position * 45}ms` }}
          >
            {letter}
          </span>
        ))}
      </span>
      <span className="sr-only">{name}</span>
    </span>
  )
}

/** "Trusted by" strip (Figma desktop 1:695, mobile 2:1007). The mobile design shows names only. */
export function TrustedLogos() {
  return (
    <section aria-labelledby="trusted-title" className="pt-36 pb-23 md:pt-55 md:pb-56">
      <Container className="flex flex-col md:gap-32">
        <h2 id="trusted-title" className="sr-only md:not-sr-only md:text-center md:text-sm md:font-semibold md:text-muted">
          Trusted by modern teams
        </h2>
        {/* Mobile: the uneven five-column row of the design (77/77/67/61/52px cells), as fractions so it still fits narrower phones. */}
        <ul className="reveal grid h-20 grid-cols-[77fr_77fr_67fr_61fr_52fr] text-center md:flex md:h-auto md:flex-wrap md:justify-center md:gap-x-48 md:gap-y-16 xl:gap-x-96">
          {companies.map((company) => (
            <li
              key={company.name}
              className={cn(
                // Logos, not copy: arrow cursor, and no selection (which would also copy the screen-reader name twice).
                'group cursor-default text-sm font-semibold text-logos select-none md:text-logo-strip',
                company.hideOnMobile && 'hidden md:block',
                company.firstOnMobile && 'order-first md:order-none',
              )}
            >
              <Wordmark name={company.name} colors={company.colors} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
