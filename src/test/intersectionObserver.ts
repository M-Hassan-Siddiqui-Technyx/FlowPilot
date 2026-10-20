import { vi } from 'vitest'

/** Minimal IntersectionObserver stand-in (jsdom has none): tests decide what is "in view". */
class MockIntersectionObserver implements IntersectionObserver {
  static instances: MockIntersectionObserver[] = []
  readonly root = null
  readonly rootMargin = '0px'
  readonly scrollMargin = '0px'
  readonly thresholds = [0]
  readonly observed = new Set<Element>()
  private readonly callback: IntersectionObserverCallback

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
    MockIntersectionObserver.instances.push(this)
  }
  observe(target: Element) {
    this.observed.add(target)
  }
  unobserve(target: Element) {
    this.observed.delete(target)
  }
  disconnect() {
    this.observed.clear()
  }
  takeRecords() {
    return []
  }
  notify(target: Element, isIntersecting: boolean, intersectionRatio: number) {
    const rect = target.getBoundingClientRect()
    const entry = {
      target,
      isIntersecting,
      intersectionRatio,
      boundingClientRect: rect,
      intersectionRect: rect,
      rootBounds: null,
      time: 0,
    }
    this.callback([entry], this)
  }
}

/** Installs the mock for the current test; call `vi.unstubAllGlobals()` in afterEach. */
export function mockIntersectionObserver() {
  MockIntersectionObserver.instances = []
  vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
}

/**
 * Tells every observer watching `target` how much of it is visible. Wrap in `act()`.
 * `ratio` defaults to fully visible (1) or hidden (0); pass e.g. 0.4 for a partial overlap.
 */
export function setIntersecting(target: Element | null, isIntersecting: boolean, ratio = isIntersecting ? 1 : 0) {
  if (!target) throw new Error('setIntersecting: target element not found')
  const observers = MockIntersectionObserver.instances.filter((observer) => observer.observed.has(target))
  if (observers.length === 0) throw new Error('setIntersecting: nothing observes this element')
  for (const observer of observers) observer.notify(target, isIntersecting, ratio)
}
