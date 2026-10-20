import { footerLinks } from '../../data/footer'
import { sectionIds } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'

const year = new Date().getFullYear()

type FooterBarProps = {
  /** The brief variant already shows the logo above this row. */
  showLogo?: boolean
  className?: string
}

/** The footer row as designed (Figma desktop 1:965, mobile 2:1075): one row from md, two rows on mobile. */
export function FooterBar({ showLogo = true, className }: FooterBarProps) {
  return (
    <Container className={cn('flex flex-wrap items-center justify-between gap-y-26 md:flex-nowrap', className)}>
      {showLogo && (
        <a href={`#${sectionIds.hero}`} className="focus-ring flex items-center gap-5 rounded-xs text-sm font-bold text-ink md:gap-8">
          {/* Each frame's own mark: the narrow box of the mobile frame, the parallelogram of the desktop one. */}
          <Icon name="logoMarkMobile" className="ml-1.5 h-15 w-4.5 md:hidden" />
          <Icon name="logoMark" className="hidden w-13 md:block" />
          FlowPilot
        </a>
      )}
      <p className="text-2xs text-muted md:text-sm">
        <span className="md:hidden">© {year} FlowPilot, Inc.</span>
        <span className="hidden md:inline">© {year} FlowPilot Inc. All rights reserved.</span>
      </p>
      <nav aria-label="Legal" className="w-full md:w-auto">
        {/* Mobile: spread across the first 297px, as designed; never wider than the gutter on small phones. */}
        <ul className="flex max-w-297 justify-between text-sm md:max-w-none md:justify-start md:gap-x-24">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="focus-ring -my-12 inline-block rounded-xs py-12 text-muted hover:text-ink motion-safe:transition"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  )
}
