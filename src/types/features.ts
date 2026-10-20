import type { IconName } from '../components/ui/Icon'

export type FeatureTone = 'plan' | 'ai' | 'team' | 'automation'

/** The icon tiles mix an SVG glyph, a text glyph ("AI") and an emoji-style raster (gear). */
export type FeatureIcon =
  | { kind: 'svg'; name: IconName }
  | { kind: 'text'; text: string }
  | { kind: 'image'; src: string }

export type Feature = {
  id: string
  title: string
  description: string
  /** Shorter copy used by the compact mobile card. */
  shortDescription: string
  icon: FeatureIcon
  tone: FeatureTone
}

export type BrandColor =
  | 'google-blue'
  | 'google-red'
  | 'google-yellow'
  | 'google-green'
  | 'slack'
  | 'notion'
  | 'spotify'
  | 'zoom'
  | 'shopify'

export type Company = {
  name: string
  /** Brand colours shown on hover: one for the whole name, or one per letter (Google). */
  colors: [BrandColor, ...BrandColor[]]
  /** The mobile strip fits five names. */
  hideOnMobile?: boolean
  /** The mobile design lists this name first. */
  firstOnMobile?: boolean
}
