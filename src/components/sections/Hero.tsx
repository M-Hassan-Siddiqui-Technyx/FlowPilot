import { trustNotes } from '../../data/hero'
import { ctaLinks, sectionIds } from '../../data/navigation'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { DashboardMockup } from './DashboardMockup'

/** Hero (Figma desktop 1:582, mobile 2:1080). Two columns from xl; stacked below. */
export function Hero() {
  return (
    <section
      id={sectionIds.hero}
      aria-labelledby="hero-title"
      className="bg-linear-to-r/srgb from-tint-from to-tint-to"
    >
      {/* From xl the columns keep Figma's 491.2 : 628.8 proportions as the row stretches (grid template = Figma widths).
          The copy keeps its 491dp Figma measure, so the headline and the trust notes break as designed. */}
      <Container className="flex flex-col pt-32 pb-40 md:py-64 xl:grid xl:grid-cols-[491.2fr_628.8fr] xl:items-center xl:gap-32 xl:py-54">
        <div className="xl:max-w-491.25 xl:min-w-0">
          <p className="mb-24 flex h-26 w-fit items-center gap-8 rounded-pill-sm motion-safe:animate-fade-up bg-primary-wash px-10 text-badge-sm md:mb-28 md:h-28 md:rounded-pill md:px-14 md:text-2xs">
            <span className="font-bold text-primary">New</span>
            <span className="font-medium text-muted">AI-powered workflow for modern teams ›</span>
          </p>

          <h1
            id="hero-title"
            className="mb-16 text-display-sm font-heavy text-ink motion-safe:animate-fade-up motion-safe:anim-delay-80 md:mb-20 md:text-display md:font-extrabold"
          >
            Work smarter.{' '}
            <br />
            Let AI handle
            <br className="xl:hidden" /> the repetitive work.
          </h1>

          <p className="mb-28 text-lead-sm text-muted motion-safe:animate-fade-up motion-safe:anim-delay-160 md:mb-32 md:max-w-500 md:text-xl">
            FlowPilot helps modern teams plan work,
            <br className="md:hidden" /> automate repetitive tasks, and keep everyone aligned.
          </p>

          <div className="mb-32 flex gap-14 motion-safe:animate-fade-up motion-safe:anim-delay-240 md:mb-36 md:gap-16">
            <Button href={ctaLinks.startFree.href} className="h-44 flex-1 text-sm md:h-48 md:w-150 md:flex-none md:text-base">
              <span>{ctaLinks.startFree.label}</span>
            </Button>
            <Button
              href={ctaLinks.seeHowItWorks.href}
              variant="secondary"
              className="h-44 flex-1 text-xs md:h-48 md:w-170 md:flex-none md:text-base"
            >
              <span>{ctaLinks.seeHowItWorks.label}</span>
            </Button>
          </div>

          <ul className="mb-32 flex flex-col gap-10 motion-safe:animate-fade-up motion-safe:anim-delay-320 md:mb-48 md:flex-row md:flex-wrap md:gap-x-24 md:gap-y-8 xl:mb-0">
            {trustNotes.map((note) => (
              <li key={note} className="flex items-center gap-12 text-xs text-muted md:gap-8 md:text-sm">
                {/* Desktop keeps the 15×22.5 icon box of the design, with the check offset inside it. */}
                <span className="flex shrink-0 md:h-22 md:w-15 md:items-start md:pt-5 md:pl-3">
                  <Icon name="check" className="w-9 text-success md:w-10" />
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* The dashboard rises in a beat after the copy and lifts slightly on hover. */}
        <div className="motion-safe:animate-fade-up motion-safe:anim-delay-200 md:mx-auto md:w-629 md:max-w-full xl:mx-0 xl:w-auto">
          <DashboardMockup />
        </div>
      </Container>
    </section>
  )
}
