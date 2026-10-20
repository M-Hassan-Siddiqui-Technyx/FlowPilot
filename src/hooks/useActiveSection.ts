import { useEffect, useState } from 'react'

/**
 * Returns the id of the section that currently crosses the middle of the viewport, or null.
 * `ids` must be a stable array (define it outside the component).
 */
export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const intersecting = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id)
          else intersecting.delete(entry.target.id)
        }
        // First match in page order wins if two sections touch the band at once.
        setActiveId(ids.find((id) => intersecting.has(id)) ?? null)
      },
      // A thin horizontal band just above the middle of the viewport.
      { rootMargin: '-45% 0px -50% 0px' },
    )
    for (const id of ids) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
