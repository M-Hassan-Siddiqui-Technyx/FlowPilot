import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { workflowTabs } from '../../data/tabs'
import { FeatureTabs } from './FeatureTabs'

const [plan, automate, collaborate] = workflowTabs

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('FeatureTabs', () => {
  it('starts on Plan with exactly one selected tab', () => {
    render(<FeatureTabs />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(['Plan', 'Automate', 'Collaborate'])
    expect(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1)
    expect(screen.getByRole('tabpanel', { name: 'Plan' })).toHaveTextContent(plan.title)
  })

  it('shows the content of the tab that is clicked', async () => {
    const user = userEvent.setup()
    render(<FeatureTabs />)

    await user.click(screen.getByRole('tab', { name: 'Automate' }))

    expect(screen.getByRole('tab', { name: 'Automate' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Plan' })).toHaveAttribute('aria-selected', 'false')
    const panel = screen.getByRole('tabpanel', { name: 'Automate' })
    expect(panel).toHaveTextContent(automate.title)
    expect(panel).toHaveTextContent(automate.description)
    expect(panel).not.toHaveTextContent(plan.title)
  })

  it('moves between tabs with the arrow, Home and End keys', async () => {
    const user = userEvent.setup()
    render(<FeatureTabs />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Plan' })).toHaveFocus()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Automate' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent(automate.title)

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Collaborate' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(collaborate.title)

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('tab', { name: 'Plan' })).toHaveFocus()

    await user.keyboard('{ArrowLeft}{Home}')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(plan.title)
  })

  it('keeps only the active tab in the Tab order', () => {
    render(<FeatureTabs />)
    const tabIndexes = screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'))
    expect(tabIndexes).toEqual(['0', '-1', '-1'])
  })

  it('counts the stat up to the new value when the tab changes', async () => {
    const user = userEvent.setup()
    render(<FeatureTabs />)
    expect(screen.getByText(plan.stat.value)).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Automate' }))

    // Automate's stat is "12h": right after the click the count is still on its way up from zero...
    const counting = screen.getByText(/^\d+h$/)
    expect(Number.parseInt(counting.textContent ?? '', 10)).toBeLessThan(12)
    // ...and it ends on the real value.
    expect(await screen.findByText(automate.stat.value)).toBeInTheDocument()
    expect(screen.getByRole('tabpanel')).toHaveTextContent(automate.stat.value)
  })

  it('shows the new stat at once for reduced motion', async () => {
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
    const user = userEvent.setup()
    render(<FeatureTabs />)

    await user.click(screen.getByRole('tab', { name: 'Collaborate' }))

    expect(screen.getByText(collaborate.stat.value)).toBeInTheDocument()
  })

  it('scrolls the sideways tab row so the chosen tab shows in full (mobile)', async () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    const user = userEvent.setup()
    render(<FeatureTabs />)

    await user.click(screen.getByRole('tab', { name: 'Collaborate' }))

    expect(scrollIntoView).toHaveBeenLastCalledWith({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
    expect(scrollIntoView.mock.contexts.at(-1)).toBe(screen.getByRole('tab', { name: 'Collaborate' }))
  })
})
