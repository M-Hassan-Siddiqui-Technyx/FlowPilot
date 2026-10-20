import { useLayoutEffect, useRef } from 'react'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

/** Prefix, number and suffix of a stat such as "40%", "12h" or "3x". */
const STAT = /^(\D*)(\d+(?:\.\d+)?)(.*)$/

/**
 * Counts the number in a stat up from zero whenever `value` changes. It doesn't run on the first render, so the page
 * (and its pixel checks) always start on the real value. It writes the element's text node from requestAnimationFrame
 * instead of re-rendering every frame, and puts React's text back when it stops. Off with reduced motion.
 * Returns the ref to put on the element that shows the value.
 */
export function useCountUp<T extends HTMLElement>(value: string, duration = 700) {
  const ref = useRef<T>(null)
  const reducedMotion = usePrefersReducedMotion()
  const lastValue = useRef(value)

  useLayoutEffect(() => {
    if (value === lastValue.current) return
    lastValue.current = value
    const text = ref.current?.firstChild
    const match = STAT.exec(value)
    if (reducedMotion || !match || !(text instanceof Text) || typeof requestAnimationFrame !== 'function') return

    const [, prefix, digits, suffix] = match
    const target = Number(digits)
    const decimals = digits.split('.')[1]?.length ?? 0
    const show = (progress: number) => {
      text.nodeValue = `${prefix}${(target * progress).toFixed(decimals)}${suffix}`
    }
    const start = performance.now()
    let frame = 0
    // performance.now() rather than the frame timestamp, whose time origin differs between environments (jsdom).
    const tick = () => {
      const elapsed = Math.min(1, (performance.now() - start) / duration)
      show(1 - (1 - elapsed) ** 3) // ease-out cubic: fast start, gentle landing
      if (elapsed < 1) frame = requestAnimationFrame(tick)
    }
    // Layout effect: the 0 is in place before the browser paints the new value.
    show(0)
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      text.nodeValue = value
    }
  }, [value, reducedMotion, duration])

  return ref
}
