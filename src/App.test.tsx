import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { App } from './App'
import { navLinks, sectionIds } from './data/navigation'
import { mockIntersectionObserver, setIntersecting } from './test/intersectionObserver'

afterEach(() => vi.unstubAllGlobals())

describe('App', () => {
  it('renders the page landmarks and a single h1', () => {
    render(<App />)
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
  })

  it('renders a section for every section id, each labelled by its heading', () => {
    const { container } = render(<App />)
    for (const id of Object.values(sectionIds)) {
      const section = container.querySelector(`section#${id}`)
      expect(section, `section #${id}`).not.toBeNull()
      expect(section?.getAttribute('aria-labelledby')).toBeTruthy()
    }
  })

  it('points every in-page link (nav, CTAs, logo) at an element that exists', () => {
    const { container } = render(<App />)
    const hashLinks = [...container.querySelectorAll<HTMLAnchorElement>('a[href^="#"]')]
    expect(hashLinks.length).toBeGreaterThan(navLinks.length)
    for (const link of hashLinks) {
      const target = link.getAttribute('href')?.slice(1) ?? ''
      expect(document.getElementById(target), `${link.textContent} → #${target}`).not.toBeNull()
    }
  })

  it('links each main navigation item to its section', () => {
    render(<App />)
    const nav = screen.getByRole('navigation', { name: 'Main' })
    for (const link of navLinks) {
      const anchor = nav.querySelector(`a[href="${link.href}"]`)
      expect(anchor).toHaveTextContent(link.label)
    }
  })

  it('reveals each section block once it scrolls into view, and never hides content without IntersectionObserver', () => {
    const { unmount } = render(<App />)
    expect(document.documentElement).not.toHaveClass('reveal-ready')
    unmount()

    mockIntersectionObserver()
    render(<App />)
    expect(document.documentElement).toHaveClass('reveal-ready')
    const featureCards = [...document.querySelectorAll('#features li.reveal')]
    expect(featureCards).toHaveLength(4)
    expect(featureCards[0]).not.toHaveAttribute('data-revealed')

    act(() => setIntersecting(featureCards[0], true))
    expect(featureCards[0]).toHaveAttribute('data-revealed')
    expect(featureCards[1]).not.toHaveAttribute('data-revealed')
  })
})
