/**
 * Where the page starts (D-34). Refreshing always starts at the top: the browser doesn't restore the old scroll
 * position, and a #section left in the address bar by a nav link is dropped so the reload doesn't jump to it.
 * Call before the first render.
 */
export function startAtTopOnReload() {
  history.scrollRestoration = 'manual'

  const [navigation] = performance.getEntriesByType('navigation')
  const reloaded = navigation !== undefined && 'type' in navigation && navigation.type === 'reload'
  if (!reloaded) return

  if (location.hash) history.replaceState(history.state, '', `${location.pathname}${location.search}`)
  // 'instant' overrides the page's CSS smooth scrolling.
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
}

/**
 * A fresh visit to a shared link such as /#contact lands on that section. The browser tries this on its own, but
 * before React has rendered the sections, so it's repeated once they exist. A reload has no hash by then (see above),
 * so it stays at the top. Call once after the first render.
 */
export function scrollToLinkedSection() {
  if (!location.hash) return
  document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
}
