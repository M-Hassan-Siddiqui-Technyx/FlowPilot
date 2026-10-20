import type { FooterLink, FooterLinkGroup, FooterVariant, SocialLink } from '../types/footer'
import { sectionIds } from './navigation'

/**
 * Which footer ships (docs/decisions.md D-23). Switch here, or per visit with `?footer=brief` / `?footer=figma`.
 *   figma: logo, copyright and legal links, exactly as designed.
 *   brief: adds the PDF's short description, grouped links and social links above the designed row.
 */
export const defaultFooterVariant: FooterVariant = 'figma'

const variants: readonly FooterVariant[] = ['figma', 'brief']

/** Reads `?footer=` from a URL query string; anything unknown falls back to the default. */
export function resolveFooterVariant(search: string): FooterVariant {
  const requested = new URLSearchParams(search).get('footer')
  return variants.find((variant) => variant === requested) ?? defaultFooterVariant
}

// Legal pages are outside the landing-page scope; these are the conventional routes (docs/decisions.md).
export const footerLinks: FooterLink[] = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Security', href: '/security' },
]

export const footerDescription =
  'FlowPilot helps modern teams plan work, automate repetitive tasks and keep everyone aligned.'

// Product links reach the page sections; Company and Resources pages don't exist yet (placeholder routes).
export const footerLinkGroups: FooterLinkGroup[] = [
  {
    id: 'product',
    title: 'Product',
    links: [
      { label: 'Features', href: `#${sectionIds.features}` },
      { label: 'How It Works', href: `#${sectionIds.howItWorks}` },
      { label: 'Pricing', href: `#${sectionIds.pricing}` },
      { label: 'Testimonials', href: `#${sectionIds.testimonials}` },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: `#${sectionIds.contact}` },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'API Docs', href: '/docs' },
    ],
  },
]

// Placeholder profiles: FlowPilot has no real social accounts (docs/decisions.md D-23).
export const socialLinks: SocialLink[] = [
  { label: 'FlowPilot on LinkedIn', href: 'https://www.linkedin.com/', icon: 'linkedin' },
  { label: 'FlowPilot on X', href: 'https://x.com/', icon: 'x' },
  { label: 'FlowPilot on GitHub', href: 'https://github.com/', icon: 'github' },
]
