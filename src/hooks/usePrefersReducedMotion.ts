import { useSyncExternalStore } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const canMatch = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function'

function subscribe(onChange: () => void) {
  if (!canMatch()) return () => {}
  const media = window.matchMedia(QUERY)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

/** True when the user asked the OS for reduced motion; follows changes live. */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => canMatch() && window.matchMedia(QUERY).matches,
    () => false,
  )
}
