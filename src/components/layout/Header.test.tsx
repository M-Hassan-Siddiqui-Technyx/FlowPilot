import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { navLinks } from '../../data/navigation'
import { Header } from './Header'

function renderHeader() {
  const user = userEvent.setup()
  render(
    <>
      <Header />
      <main>Page content</main>
    </>,
  )
  const toggle = screen.getByRole('button', { name: /open menu/i })
  return { user, toggle }
}

describe('Header mobile navigation', () => {
  it('opens the menu with every navigation link and moves focus into it', async () => {
    const { user, toggle } = renderHeader()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAttribute('aria-controls', 'mobile-menu')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(toggle)

    const menu = screen.getByRole('dialog', { name: /main menu/i })
    expect(menu).toHaveAttribute('id', 'mobile-menu')
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(toggle).toHaveAccessibleName('Close menu')
    expect(document.querySelector('main')).toHaveAttribute('inert')
    for (const link of navLinks) {
      expect(within(menu).getByRole('link', { name: link.mobileLabel ?? link.label })).toHaveAttribute('href', link.href)
    }
    expect(within(menu).getByRole('button', { name: /close menu/i })).toHaveFocus()
  })

  it('closes with the close button and returns focus to the toggle', async () => {
    const { user, toggle } = renderHeader()
    await user.click(toggle)

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close menu/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    expect(toggle).toHaveAccessibleName('Open menu')
    expect(toggle).toHaveFocus()
    expect(document.querySelector('main')).not.toHaveAttribute('inert')
  })

  it('gives focus back to the toggle without scrolling the page', async () => {
    // The toggle is in the sticky header, always on screen; a scrolling focus() moved the page up on mobile (D-37).
    const { user, toggle } = renderHeader()
    await user.click(toggle)
    const focus = vi.spyOn(toggle, 'focus')

    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /close menu/i }))

    expect(focus).toHaveBeenCalledWith({ preventScroll: true })
    expect(toggle).toHaveFocus()
  })

  it('closes on Escape and returns focus to the toggle', async () => {
    const { user, toggle } = renderHeader()
    await user.click(toggle)

    await user.keyboard('{Escape}')

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(toggle).toHaveFocus()
  })

  it('closes when a navigation link is selected', async () => {
    const { user, toggle } = renderHeader()
    await user.click(toggle)

    await user.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Pricing' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('keeps keyboard focus inside the open menu', async () => {
    const { user, toggle } = renderHeader()
    await user.click(toggle)
    const menu = screen.getByRole('dialog')
    const closeButton = within(menu).getByRole('button', { name: /close menu/i })

    // Close button → Start Free (the last item) when tabbing backwards.
    await user.tab({ shift: true })
    await user.tab({ shift: true })
    expect(within(menu).getByRole('link', { name: 'Start Free' })).toHaveFocus()

    await user.tab()
    expect(within(menu).getByRole('link', { name: 'FlowPilot' })).toHaveFocus()
    expect(closeButton).not.toHaveFocus()
  })
})
