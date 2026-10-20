import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockIntersectionObserver, setIntersecting } from '../../test/intersectionObserver'
import { Header } from './Header'

const section = (id: string) => document.getElementById(id)

function renderPage() {
  render(
    <>
      <Header />
      <main>
        {['features', 'how-it-works', 'pricing', 'testimonials', 'contact'].map((id) => (
          <section key={id} id={id} />
        ))}
      </main>
    </>,
  )
}

beforeEach(() => mockIntersectionObserver())
afterEach(() => vi.unstubAllGlobals())

describe('Header active section', () => {
  it('marks the nav link of the section in view as the current location', () => {
    renderPage()
    const nav = screen.getByRole('navigation', { name: 'Main' })
    expect(within(nav).queryByRole('link', { current: 'location' })).not.toBeInTheDocument()

    act(() => setIntersecting(section('pricing'), true))
    expect(within(nav).getByRole('link', { name: 'Pricing' })).toHaveAttribute('aria-current', 'location')

    act(() => {
      setIntersecting(section('pricing'), false)
      setIntersecting(section('contact'), true)
    })
    expect(within(nav).getByRole('link', { name: 'Pricing' })).not.toHaveAttribute('aria-current')
    expect(within(nav).getByRole('link', { name: 'FAQ' })).toHaveAttribute('aria-current', 'location')
  })

  it('highlights the same section in the mobile menu', async () => {
    const user = userEvent.setup()
    renderPage()
    act(() => setIntersecting(section('testimonials'), true))

    await user.click(screen.getByRole('button', { name: /open menu/i }))

    const menu = screen.getByRole('dialog', { name: /main menu/i })
    expect(within(menu).getByRole('link', { name: 'Testimonials' })).toHaveAttribute('aria-current', 'location')
    expect(within(menu).getByRole('link', { name: 'Pricing' })).not.toHaveAttribute('aria-current')
  })
})
