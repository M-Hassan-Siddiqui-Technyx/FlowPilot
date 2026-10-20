import { afterEach, describe, expect, it, vi } from 'vitest'
import { scrollToLinkedSection, startAtTopOnReload } from './initialScroll'

/** Pretends the current page load was a reload or a fresh navigation. */
function loadedBy(type: 'reload' | 'navigate') {
  const entry = { type, name: '', entryType: 'navigation', startTime: 0, duration: 0, toJSON: () => ({}) }
  vi.spyOn(performance, 'getEntriesByType').mockReturnValue([entry])
}

afterEach(() => {
  vi.restoreAllMocks()
  history.replaceState(null, '', '/')
  document.body.innerHTML = ''
})

describe('startAtTopOnReload', () => {
  it('starts a reload at the top and drops a #section left by a nav link', () => {
    history.replaceState(null, '', '/#pricing')
    loadedBy('reload')
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    startAtTopOnReload()

    expect(history.scrollRestoration).toBe('manual')
    expect(location.hash).toBe('')
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'instant' })
  })

  it('leaves a fresh visit to a shared #link alone', () => {
    history.replaceState(null, '', '/#contact')
    loadedBy('navigate')
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    startAtTopOnReload()

    expect(location.hash).toBe('#contact')
    expect(scrollTo).not.toHaveBeenCalled()
  })
})

describe('scrollToLinkedSection', () => {
  it('brings the linked section into view once it exists', () => {
    document.body.innerHTML = '<section id="contact"></section>'
    const scrollIntoView = vi.fn()
    Object.defineProperty(document.getElementById('contact'), 'scrollIntoView', { value: scrollIntoView })
    history.replaceState(null, '', '/#contact')

    scrollToLinkedSection()

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'instant', block: 'start' })
  })
})
