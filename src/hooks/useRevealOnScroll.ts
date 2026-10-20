import { useEffect } from 'react'

/**
 * Fades `.reveal` elements in (rise + fade, see index.css) the first time 15% of each one is on screen.
 * Content is only hidden after this effect marks the page with `reveal-ready`, so without JavaScript or
 * IntersectionObserver everything simply shows. Reduced motion is handled in CSS (no hiding, no transition).
 * Put `.reveal` on stable wrappers only: an element React re-creates would lose its `data-revealed` flag.
 */
export function useRevealOnScroll() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const root = document.documentElement
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', '')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 },
    )
    for (const element of document.querySelectorAll('.reveal:not([data-revealed])')) observer.observe(element)
    root.classList.add('reveal-ready')

    return () => {
      observer.disconnect()
      root.classList.remove('reveal-ready')
    }
  }, [])
}
