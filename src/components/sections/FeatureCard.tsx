import { cn } from '../../lib/cn'
import type { Feature, FeatureIcon, FeatureTone } from '../../types/features'
import { Icon, type IconName } from '../ui/Icon'

const toneBackground: Record<FeatureTone, string> = {
  plan: 'bg-icon-plan',
  ai: 'bg-icon-ai',
  team: 'bg-icon-team',
  automation: 'bg-icon-automation',
}

// Glyph widths from Figma: the planning icon is 14px wide, the team icon 16px.
const svgWidth: Partial<Record<IconName, string>> = { featurePlan: 'w-14', featureTeam: 'w-16' }

type TileGlyphProps = { icon: FeatureIcon }

function TileGlyph({ icon }: TileGlyphProps) {
  switch (icon.kind) {
    case 'svg':
      return <Icon name={icon.name} className={svgWidth[icon.name] ?? 'w-16'} />
    case 'text':
      return (
        <span aria-hidden="true" className="text-logo font-bold">
          {icon.text}
        </span>
      )
    case 'image':
      return <img src={icon.src} alt="" width={17} height={17} className="size-17" />
  }
}

type FeatureCardProps = { feature: Feature }

/** Compact row card on mobile (Figma 2:1025), tall card with hover lift from md (1:720). */
export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <article className="group flex h-76 items-center gap-14 rounded-pill border border-border bg-white p-14 md:block md:h-auto md:min-h-200 md:rounded-card md:p-24 motion-safe:transition motion-safe:duration-200 md:hover:-translate-y-4 md:hover:border-primary/40 md:hover:shadow-card">
      <div
        className={cn(
          'flex size-44 shrink-0 items-center justify-center rounded-lg text-white motion-safe:transition motion-safe:duration-300 motion-safe:ease-smooth md:mb-20 md:group-hover:scale-110 md:group-hover:-rotate-3',
          toneBackground[feature.tone],
        )}
      >
        <TileGlyph icon={feature.icon} />
      </div>
      {/* Mobile: the text column is as wide as the title and the copy wraps inside it, as in the design. */}
      <div className="w-fit md:w-auto">
        <h3 className="text-feature-title-sm font-bold whitespace-nowrap text-ink md:mb-6 md:text-lg md:whitespace-normal">
          {feature.title}
        </h3>
        <p className="pt-2 text-2xs text-muted contain-inline-size md:hidden">{feature.shortDescription}</p>
        <p className="hidden max-w-220 text-feature-body text-muted md:block">{feature.description}</p>
      </div>
    </article>
  )
}
