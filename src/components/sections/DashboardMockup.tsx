import { useId, useRef, useState, type KeyboardEvent } from 'react'
import { dashboardScreens } from '../../data/hero'
import type { DashboardScreenId, ResponsiveLabel, StatusTone } from '../../types/hero'
import { cn } from '../../lib/cn'

const statusColor: Record<StatusTone, string> = {
  warning: 'text-warning',
  success: 'text-success',
  subtle: 'text-subtle',
}

// Vertical tab list (WAI-ARIA tabs pattern): Up/Down wrap around, Home/End jump to the ends.
const navigationKeys: Partial<Record<string, (index: number, count: number) => number>> = {
  ArrowDown: (index, count) => (index + 1) % count,
  ArrowUp: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_index, count) => count - 1,
}

/** Shows the short mobile copy below md and the full copy from md up. */
function ResponsiveText({ label, shortLabel }: ResponsiveLabel) {
  if (!shortLabel) return label
  return (
    <>
      <span className="whitespace-pre-line md:hidden">{shortLabel}</span>
      <span className="hidden md:inline">{label}</span>
    </>
  )
}

/**
 * Coded product preview for the hero (the brief requires HTML/CSS, not an image).
 * Base classes follow the 375px mockup (Figma 2:1114); `md:` follows the desktop mockup (1:619).
 * The sidebar entries are tabs: each shows its own screen in the same layout as the designed Overview (D-31).
 */
export function DashboardMockup() {
  const [activeId, setActiveId] = useState<DashboardScreenId>(dashboardScreens[0].id)
  const tabRefs = useRef(new Map<DashboardScreenId, HTMLButtonElement>())
  const baseId = useId()
  const tabId = (id: DashboardScreenId) => `${baseId}-tab-${id}`
  const panelId = `${baseId}-panel`

  const activeIndex = dashboardScreens.findIndex((item) => item.id === activeId)
  const screen = dashboardScreens[activeIndex]

  const onTabListKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = navigationKeys[event.key]
    if (!move) return
    event.preventDefault()
    const next = dashboardScreens[move(activeIndex, dashboardScreens.length)]
    setActiveId(next.id)
    tabRefs.current.get(next.id)?.focus()
  }

  return (
    <div
      role="group"
      aria-label="FlowPilot dashboard preview"
      className="flex overflow-hidden rounded-card-lg border border-border bg-white p-14 shadow-card motion-safe:transition motion-safe:duration-500 motion-safe:ease-smooth md:h-430 md:gap-16 md:p-16 md:motion-safe:hover:-translate-y-4"
    >
      <div className="flex w-110 shrink-0 flex-col gap-6 rounded-pill border border-divider bg-surface-muted p-10 md:w-150 md:gap-0 md:border-0 md:p-16">
        <p className="mb-4 h-28 p-4 text-sm font-bold text-ink md:mb-0 md:h-42 md:p-0 md:text-logo">FlowPilot</p>
        <div
          role="tablist"
          aria-label="Dashboard"
          aria-orientation="vertical"
          onKeyDown={onTabListKeyDown}
          className="flex flex-col gap-6 md:gap-4"
        >
          {dashboardScreens.map((item) => {
            const selected = item.id === activeId
            return (
              <button
                key={item.id}
                ref={(element) => {
                  if (element) tabRefs.current.set(item.id, element)
                  else tabRefs.current.delete(item.id)
                }}
                id={tabId(item.id)}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={panelId}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  'focus-ring flex cursor-pointer items-center rounded-md px-8 text-2xs md:px-12 md:text-sm motion-safe:transition',
                  selected
                    ? 'h-26 bg-primary-tint font-semibold text-primary md:h-30'
                    : 'h-25 font-medium text-muted hover:text-ink md:h-32',
                )}
              >
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Keyed by screen, so the new screen fades in on every switch. */}
      <div
        key={screen.id}
        id={panelId}
        role="tabpanel"
        aria-labelledby={tabId(screen.id)}
        tabIndex={0}
        className="focus-ring min-w-0 flex-1 rounded-md pl-12 motion-safe:animate-fade-in md:py-8 md:pr-8 md:pl-0"
      >
        <p className="truncate text-base font-bold text-ink md:text-2xl">{screen.title}</p>
        <p className="text-mock-caption text-muted md:mt-4 md:text-2xs">
          <ResponsiveText {...screen.subtitle} />
        </p>

        <ul className="flex gap-6 pt-8 md:gap-10 md:pt-16">
          {screen.stats.map((stat) => (
            <li
              key={stat.id}
              className="flex flex-1 flex-col items-center rounded-md border border-border bg-surface-raised p-4 text-center md:h-82 md:items-start md:justify-center md:rounded-lg md:px-12 md:py-0 md:text-left"
            >
              <span className="text-stat-sm font-bold text-ink md:text-stat">{stat.value}</span>
              <span className="pt-2 text-3xs font-medium text-muted md:pt-4 md:text-2xs">
                <ResponsiveText label={stat.label} shortLabel={stat.shortLabel} />
              </span>
            </li>
          ))}
        </ul>

        <p className="pt-10 pb-4 text-2xs font-bold text-ink md:pt-24 md:pb-8 md:text-base">{screen.listTitle}</p>
        <ul>
          {screen.rows.map((row) => (
            <li key={row.id} className="flex items-center justify-between gap-8 border-t border-divider py-4 md:py-8">
              <span className="flex min-w-0 items-center gap-6 md:gap-12">
                <span className="size-14 shrink-0 rounded-xs bg-primary-faint md:size-18 md:rounded-sm" />
                <span className="truncate text-mock-task font-medium text-ink md:text-xs">
                  <ResponsiveText label={row.label} shortLabel={row.shortLabel} />
                </span>
              </span>
              <span className={cn('shrink-0 text-mock-status font-semibold md:text-2xs', statusColor[row.tone])}>
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
