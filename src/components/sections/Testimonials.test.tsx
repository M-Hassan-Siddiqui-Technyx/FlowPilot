import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { testimonials } from '../../data/testimonials'
import { mockIntersectionObserver, setIntersecting } from '../../test/intersectionObserver'
import { Testimonials } from './Testimonials'

// Inactive slides stay in the DOM (for a stable card height) but are aria-hidden, so only the active one has the role.
const visibleSlide = () => screen.getByRole('group', { name: new RegExp(`of ${testimonials.length}$`) })
const indicator = (n: number) => screen.getByRole('button', { name: `Show testimonial ${n}` })
const carousel = () => screen.getByRole('region', { name: 'Customer testimonials' })

// The active bullet's 6s fill animation is the autoplay clock. jsdom doesn't run CSS animations,
// so the tests dispatch the browser's animationend event themselves (it's not a user interaction).
const finishBulletTimer = () => fireEvent.animationEnd(screen.getByTestId('slide-progress'))

/** Presses on the card, moves and releases (a touch by default), like a finger swiping. */
async function swipe(user: ReturnType<typeof userEvent.setup>, dx: number, dy = 0, pointer = 'TouchA') {
  const target = visibleSlide()
  await user.pointer([
    { keys: `[${pointer}>]`, target, coords: { clientX: 200, clientY: 300 } },
    { pointerName: pointer === 'MouseLeft' ? 'mouse' : pointer, target, coords: { clientX: 200 + dx, clientY: 300 + dy } },
    { keys: `[/${pointer}]`, target, coords: { clientX: 200 + dx, clientY: 300 + dy } },
  ])
}

function renderInView() {
  mockIntersectionObserver()
  render(<Testimonials />)
  act(() => setIntersecting(carousel(), true))
}

afterEach(() => vi.unstubAllGlobals())

describe('Testimonials slider', () => {
  it('starts on the first testimonial with its indicator marked current', () => {
    render(<Testimonials />)
    expect(visibleSlide()).toHaveAccessibleName(`1 of ${testimonials.length}`)
    expect(visibleSlide()).toHaveTextContent(testimonials[0].name)
    expect(indicator(1)).toHaveAttribute('aria-current', 'true')
    expect(indicator(2)).not.toHaveAttribute('aria-current')
  })

  it('moves forward and back with Next and Previous, wrapping at the ends', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)
    const next = screen.getByRole('button', { name: 'Next testimonial' })
    const previous = screen.getByRole('button', { name: 'Previous testimonial' })

    await user.click(next)
    expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
    expect(indicator(2)).toHaveAttribute('aria-current', 'true')
    expect(indicator(1)).not.toHaveAttribute('aria-current')

    await user.click(previous)
    await user.click(previous)
    expect(visibleSlide()).toHaveTextContent(testimonials[testimonials.length - 1].name)
    expect(indicator(testimonials.length)).toHaveAttribute('aria-current', 'true')

    await user.click(next)
    expect(visibleSlide()).toHaveTextContent(testimonials[0].name)
  })

  it('jumps to a testimonial from its indicator', async () => {
    const user = userEvent.setup()
    render(<Testimonials />)

    await user.click(indicator(3))

    expect(visibleSlide()).toHaveAccessibleName(`3 of ${testimonials.length}`)
    expect(visibleSlide()).toHaveTextContent(testimonials[2].quote)
  })

  describe('autoplay', () => {
    it('does not advance before the slider has been scrolled into view', () => {
      mockIntersectionObserver()
      render(<Testimonials />)

      finishBulletTimer()

      expect(visibleSlide()).toHaveAccessibleName(`1 of ${testimonials.length}`)
    })

    it('advances to the next testimonial when the active bullet finishes filling, once in view', () => {
      renderInView()

      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
      expect(indicator(2)).toHaveAttribute('aria-current', 'true')

      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[2].name)
    })

    it('keeps playing while the pointer is over the slider', async () => {
      const user = userEvent.setup()
      renderInView()

      await user.hover(carousel())
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
    })

    it('waits until at least half of the slider is visible', () => {
      mockIntersectionObserver()
      render(<Testimonials />)

      act(() => setIntersecting(carousel(), true, 0.4))
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)

      act(() => setIntersecting(carousel(), true, 0.6))
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)

      // Scrolling back below half pauses again, even though part of it is still on screen.
      act(() => setIntersecting(carousel(), true, 0.3))
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
    })

    it('pauses while keyboard focus is inside the slider and resumes when it leaves', async () => {
      const user = userEvent.setup()
      renderInView()

      await user.tab()
      expect(screen.getByRole('button', { name: 'Pause testimonials' })).toHaveFocus()
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)

      // Tab past the last control (Next) and out of the slider.
      while (carousel().contains(document.activeElement)) await user.tab()
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
    })

    it('stops with the keyboard Pause control and starts again with Play', async () => {
      const user = userEvent.setup()
      renderInView()

      // The control is the first stop in the slider and is only shown while focused (the design has none).
      await user.tab()
      await user.keyboard('{Enter}')
      expect(screen.getByRole('button', { name: 'Play testimonials' })).toHaveFocus()
      await user.tab({ shift: true })
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)

      await user.tab()
      await user.keyboard('{Enter}')
      await user.tab({ shift: true })
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)
    })

    it('never autoplays for reduced motion, keeps changes announced and drops the Pause button', () => {
      vi.stubGlobal('matchMedia', (query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      }))
      renderInView()

      expect(visibleSlide().parentElement).toHaveAttribute('aria-live', 'polite')
      expect(screen.queryByRole('button', { name: /pause testimonials/i })).not.toBeInTheDocument()
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)
    })

    it('pauses when the slider scrolls out of view and keeps quiet for screen readers while playing', () => {
      renderInView()
      const liveRegion = visibleSlide().parentElement
      expect(liveRegion).toHaveAttribute('aria-live', 'off')

      act(() => setIntersecting(carousel(), false))
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
      finishBulletTimer()
      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)
    })
  })

  describe('swipe (phones show no arrows or bullets)', () => {
    it('swipes left for the next testimonial and right for the previous one', async () => {
      const user = userEvent.setup()
      render(<Testimonials />)

      await swipe(user, -80)
      expect(visibleSlide()).toHaveTextContent(testimonials[1].name)

      await swipe(user, 80)
      await swipe(user, 80)
      expect(visibleSlide()).toHaveTextContent(testimonials[testimonials.length - 1].name)
    })

    it('ignores short or mostly vertical drags and mouse drags', async () => {
      const user = userEvent.setup()
      render(<Testimonials />)

      await swipe(user, -20)
      await swipe(user, -60, 120)
      await swipe(user, -80, 0, 'MouseLeft')

      expect(visibleSlide()).toHaveTextContent(testimonials[0].name)
    })
  })
})
