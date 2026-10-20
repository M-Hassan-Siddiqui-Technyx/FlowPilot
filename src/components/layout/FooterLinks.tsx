import { footerDescription, footerLinkGroups, socialLinks } from '../../data/footer'
import { sectionIds } from '../../data/navigation'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

/**
 * Upper band of the brief footer variant: the content the PDF asks for (short description, grouped links and
 * social links). It isn't in Figma, so it reuses the design's logo, type scale, colours and link styles.
 */
export function FooterLinks() {
  return (
    <Container className="grid grid-cols-2 gap-x-24 gap-y-36 pt-40 pb-32 md:grid-cols-5 md:gap-x-48 md:pt-64 md:pb-48">
      <div className="col-span-2">
        <a href={`#${sectionIds.hero}`} className="focus-ring inline-flex rounded-xs">
          <Logo className="h-26 w-94 text-ink" />
        </a>
        <p className="mt-16 max-w-320 text-sm text-muted">{footerDescription}</p>
        <ul aria-label="Social media" className="mt-24 flex gap-12">
          {socialLinks.map((social) => (
            <li key={social.icon}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${social.label} (opens in a new tab)`}
                className="focus-ring flex size-44 items-center justify-center rounded-full border border-border text-muted hover:border-primary hover:text-primary motion-safe:transition motion-safe:hover:-translate-y-2 md:size-40"
              >
                <Icon name={social.icon} className="size-16" />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <nav aria-label="Footer" className="col-span-2 grid grid-cols-2 gap-x-24 gap-y-32 md:col-span-3 md:grid-cols-3">
        {footerLinkGroups.map((group) => (
          <div key={group.id}>
            <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
            <ul className="mt-16 flex flex-col gap-12 text-sm">
              {group.links.map((link) => (
                <li key={link.label}>
                  {/* 6dp above and below (cancelled by margins) enlarge the hit area without moving the list. */}
                  <a
                    href={link.href}
                    className="focus-ring -my-6 inline-block rounded-xs py-6 text-muted hover:text-ink motion-safe:transition"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </Container>
  )
}
