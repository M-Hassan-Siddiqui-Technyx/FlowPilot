import type { IconName } from '../components/ui/Icon'

/** `figma`: the footer as drawn in Figma. `brief`: the PDF's footer (description, grouped links, social links). */
export type FooterVariant = 'figma' | 'brief'

export type FooterLink = {
  label: string
  href: string
}

export type FooterLinkGroup = {
  id: string
  title: string
  links: FooterLink[]
}

export type SocialLink = {
  /** Accessible name of the icon-only link, e.g. "FlowPilot on LinkedIn". */
  label: string
  href: string
  icon: IconName
}
