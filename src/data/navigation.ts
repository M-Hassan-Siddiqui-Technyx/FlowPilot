import type { CtaLink, NavLink, SectionHref, SectionId } from '../types/navigation'

/** Single source for section anchor ids: sections, nav links and CTAs all read from here. */
export const sectionIds = {
  hero: 'hero',
  features: 'features',
  howItWorks: 'how-it-works',
  testimonials: 'testimonials',
  pricing: 'pricing',
  contact: 'contact',
} as const satisfies Record<string, SectionId>

const href = (id: SectionId): SectionHref => `#${id}`

export const navLinks: NavLink[] = [
  { label: 'Features', href: href(sectionIds.features) },
  { label: 'How It Works', href: href(sectionIds.howItWorks) },
  { label: 'Pricing', href: href(sectionIds.pricing) },
  { label: 'Testimonials', href: href(sectionIds.testimonials) },
  // The design has no FAQ section; the mobile menu labels this link "FAQ & Contact" (docs/decisions.md).
  { label: 'FAQ', mobileLabel: 'FAQ & Contact', href: href(sectionIds.contact) },
]

export const ctaLinks = {
  // No login page is in scope (no backend); Log In leads to the contact form (docs/decisions.md).
  logIn: { label: 'Log In', href: href(sectionIds.contact) },
  getStarted: { label: 'Get Started', href: href(sectionIds.pricing) },
  startFree: { label: 'Start Free', href: href(sectionIds.pricing) },
  seeHowItWorks: { label: 'See How It Works', href: href(sectionIds.howItWorks) },
  contactSales: { label: 'Get Started', href: href(sectionIds.contact) },
} satisfies Record<string, CtaLink>
