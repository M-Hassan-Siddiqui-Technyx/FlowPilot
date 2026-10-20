export type SectionId = 'hero' | 'features' | 'how-it-works' | 'testimonials' | 'pricing' | 'contact'

export type SectionHref = `#${SectionId}`

export type NavLink = {
  label: string
  /** The mobile menu uses a longer label for some links ("FAQ & Contact"). */
  mobileLabel?: string
  href: SectionHref
}

export type CtaLink = {
  label: string
  href: SectionHref
}
