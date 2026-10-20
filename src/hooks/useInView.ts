import { useEffect, useState, type RefObject } from 'react'

/**
 * True while at least `threshold` of the element is inside the viewport.
 * `isIntersecting` alone is true for any overlap, so the visible ratio decides; the 0 threshold makes the
 * browser report the moment the element fully leaves as well. Stays false where IntersectionObserver is missing.
 */
export function useInView(ref: RefObject<Element | null>, threshold = 0.5) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.isIntersecting && entry.intersectionRatio >= threshold)
      },
      { threshold: [0, threshold] },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, threshold])

  return inView
}
