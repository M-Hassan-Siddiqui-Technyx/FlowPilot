import Lenis from 'lenis'
import { useEffect } from 'react'

/**
 * Smooth (inertial) mouse-wheel scrolling with Lenis (docs/decisions.md D-25).
 * - Same-page anchor links keep the browser's native smooth scroll (CSS `scroll-behavior`), which already honours
 *   the sticky-header `scroll-padding-top` and moves keyboard focus to the target; any wheel inertia is cancelled
 *   first so the two never fight.
 * - Touch scrolling stays native (Lenis' default), nested scrollers (pricing cards, tab pills) scroll natively, and
 *   the full-screen mobile menu opts out with `data-lenis-prevent`.
 * - Not started with `prefers-reduced-motion` or where `matchMedia` is missing (tests).
 */
export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ autoRaf: true, allowNestedScroll: true })

    const onClick = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a[href^="#"]') : null
      if (link) lenis.scrollTo(lenis.scroll, { immediate: true, force: true })
    }
    document.addEventListener('click', onClick, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      lenis.destroy()
    }
  }, [])
}
