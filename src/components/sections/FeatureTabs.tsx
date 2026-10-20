import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { sectionIds } from '../../data/navigation'
import { workflowTabs } from '../../data/tabs'
import { useCountUp } from '../../hooks/useCountUp'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import type { WorkflowTabId } from '../../types/tabs'
import { Container } from '../ui/Container'

type Direction = 'next' | 'prev'

// Each key gives the new tab and the direction the copy travels in (the wrap from the end still reads as "next").
const navigationKeys: Partial<Record<string, (index: number, count: number) => [number, Direction]>> = {
  ArrowRight: (index, count) => [(index + 1) % count, 'next'],
  ArrowLeft: (index, count) => [(index - 1 + count) % count, 'prev'],
  Home: () => [0, 'prev'],
  End: (_index, count) => [count - 1, 'next'],
}

const enterAnimation: Record<Direction, string> = {
  next: 'motion-safe:animate-tab-enter-next',
  prev: 'motion-safe:animate-tab-enter-prev',
}

/** "Plan, automate, collaborate" (Figma desktop 1:756, mobile 60:64). One active tab; content comes from data. */
export function FeatureTabs() {
  const [activeId, setActiveId] = useState<WorkflowTabId>(workflowTabs[0].id)
  const [direction, setDirection] = useState<Direction>('next')
  const tabRefs = useRef(new Map<WorkflowTabId, HTMLButtonElement>())
  const baseId = useId()
  const tabId = (id: WorkflowTabId) => `${baseId}-tab-${id}`
  const panelId = `${baseId}-panel`

  const activeIndex = workflowTabs.findIndex((tab) => tab.id === activeId)
  const active = workflowTabs[activeIndex]
  const statRef = useCountUp<HTMLParagraphElement>(active.stat.value)
  const reducedMotion = usePrefersReducedMotion()

  const select = (index: number, travel: Direction = index < activeIndex ? 'prev' : 'next') => {
    setDirection(travel)
    setActiveId(workflowTabs[index].id)
    // On mobile the row scrolls sideways and crops the last tab: scroll just enough to show the chosen tab in full.
    // block 'nearest' leaves the page itself where it is; on desktop the row doesn't overflow, so nothing moves.
    tabRefs.current
      .get(workflowTabs[index].id)
      ?.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'nearest', inline: 'nearest' })
  }

  const onTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = navigationKeys[event.key]
    if (!move) return
    event.preventDefault()
    const [index, travel] = move(activeIndex, workflowTabs.length)
    select(index, travel)
    tabRefs.current.get(workflowTabs[index].id)?.focus({ preventScroll: true })
  }

  return (
    <section
      id={sectionIds.howItWorks}
      aria-labelledby="workflow-title"
      className="pt-24 pb-53 md:py-56"
    >
      <Container>
        {/* From xl the columns keep Figma's 585 : 487 proportions as the banner stretches (grid template = Figma widths). */}
        <div className="reveal rounded-banner bg-linear-to-r/srgb from-tint-from to-tint-to pt-40 pb-57 md:p-40 xl:grid xl:grid-cols-[585fr_487fr] xl:items-center xl:gap-40">
          <div className="pr-19 pl-26 md:px-0 xl:min-w-0">
            <h2 id="workflow-title" className="mb-4 pt-6 text-h2-md font-extrabold text-ink md:mb-8 md:pt-0">
              Plan, automate, collaborate
            </h2>
            <p className="mb-14 text-base text-muted md:mb-24">One workflow, three ways to move work forward.</p>

            {/* Mobile: the pills scroll sideways to the banner edge, as the design crops the third one.
                Layers (isolate): white pills → the gradient pill that slides to the active tab → labels on top. */}
            <div
              role="tablist"
              aria-label="Workflow"
              onKeyDown={onTabListKeyDown}
              className="relative isolate -m-4 -mr-19 mb-24 flex scrollbar-none scroll-pl-4 scroll-pr-19 gap-12 overflow-x-auto p-4 pr-19 md:-mr-4 md:mb-28 md:scroll-pr-4 md:pr-4"
            >
              {/* One tab step is its 108dp width plus the 12dp gap (calc from the spacing token). */}
              <span
                aria-hidden="true"
                className="absolute top-4 left-4 z-10 h-40 w-108 translate-x-[calc(var(--tab-index)*var(--spacing)*120)] rounded-control bg-linear-to-r/srgb from-primary to-accent motion-safe:transition-transform motion-safe:duration-400 motion-safe:ease-smooth"
                style={{ '--tab-index': activeIndex }}
              />
              {workflowTabs.map((tab, index) => {
                const selected = tab.id === activeId
                return (
                  <button
                    key={tab.id}
                    ref={(element) => {
                      if (element) tabRefs.current.set(tab.id, element)
                      else tabRefs.current.delete(tab.id)
                    }}
                    id={tabId(tab.id)}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => select(index)}
                    // before: extends the 40px pill to a 48px touch target without changing layout.
                    className="group focus-ring relative h-40 w-108 shrink-0 rounded-control bg-white text-xs font-semibold before:absolute before:-inset-y-4 before:inset-x-0"
                  >
                    <span
                      className={cn(
                        'relative z-20 motion-safe:transition-colors motion-safe:duration-400',
                        selected ? 'text-white' : 'text-ink group-hover:text-primary',
                      )}
                    >
                      {tab.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* The card stays; its copy is keyed by tab, so it re-enters from the side of travel (title, then text). */}
            <div
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId(active.id)}
              tabIndex={0}
              className="focus-ring flex min-h-80 flex-col justify-center overflow-hidden rounded-pill py-10 border border-border bg-white px-24 md:max-w-560 xl:mr-25 xl:max-w-none"
            >
              <h3 key={`${active.id}-title`} className={cn('text-card-title font-bold text-ink', enterAnimation[direction])}>
                {active.title}
              </h3>
              <p
                key={`${active.id}-description`}
                className={cn('text-xs text-muted', enterAnimation[direction], 'motion-safe:anim-delay-60')}
              >
                {active.description}
              </p>
              <p className="sr-only">
                {active.stat.value} {active.stat.label}
              </p>
            </div>
          </div>

          {/* Visual summary of the active tab; its text is also in the panel above for assistive tech. */}
          <div
            aria-hidden="true"
            className="mx-7 mt-26 flex h-179 flex-col rounded-card border border-border bg-white px-32 pt-52 md:mx-0 md:mt-32 md:h-210 md:max-w-560 md:justify-center md:pt-0 xl:mt-0 xl:max-w-none"
          >
            {/* The number counts up to the new value (useCountUp) while the bar glides to its new length. */}
            <p ref={statRef} key={active.id} className="pb-4 text-stat-lg font-extrabold text-ink motion-safe:animate-fade-in">
              {active.stat.value}
            </p>
            <p
              key={`${active.id}-label`}
              className="mb-10 text-sm font-medium text-muted motion-safe:animate-fade-in motion-safe:anim-delay-80 md:mb-24"
            >
              {active.stat.label}
            </p>
            <div className="h-16 w-full max-w-420 overflow-hidden rounded-md bg-primary-wash xl:max-w-none">
              {/* Grows in from zero the first time the banner is revealed on scroll (in-data-revealed). */}
              <div
                className="h-full w-(--progress) rounded-md bg-linear-to-r/srgb from-primary to-accent motion-safe:transition-[width] motion-safe:duration-700 motion-safe:ease-smooth in-data-revealed:motion-safe:animate-bar-grow"
                style={{ '--progress': `${active.stat.progress}%` }}
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
