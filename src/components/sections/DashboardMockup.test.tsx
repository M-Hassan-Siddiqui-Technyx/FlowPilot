import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { dashboardScreens } from '../../data/hero'
import { DashboardMockup } from './DashboardMockup'

const [overview, tasks, , , , settings] = dashboardScreens

describe('DashboardMockup', () => {
  it('starts on Overview with exactly one selected tab', () => {
    render(<DashboardMockup />)
    const tabs = screen.getAllByRole('tab')
    expect(tabs.map((tab) => tab.textContent)).toEqual(dashboardScreens.map((item) => item.label))
    expect(tabs.filter((tab) => tab.getAttribute('aria-selected') === 'true')).toHaveLength(1)
    expect(screen.getByRole('tablist', { name: 'Dashboard' })).toHaveAttribute('aria-orientation', 'vertical')

    const panel = screen.getByRole('tabpanel', { name: 'Overview' })
    expect(panel).toHaveTextContent(overview.title)
    expect(panel).toHaveTextContent(overview.listTitle)
  })

  it('shows the screen of the sidebar entry that is clicked', async () => {
    const user = userEvent.setup()
    render(<DashboardMockup />)

    await user.click(screen.getByRole('tab', { name: 'Tasks' }))

    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false')
    const panel = screen.getByRole('tabpanel', { name: 'Tasks' })
    expect(panel).toHaveTextContent(tasks.title)
    expect(panel).toHaveTextContent(tasks.listTitle)
    for (const stat of tasks.stats) expect(panel).toHaveTextContent(stat.value)
    expect(panel).not.toHaveTextContent(overview.title)
  })

  it('moves between entries with the Up, Down, Home and End keys', async () => {
    const user = userEvent.setup()
    render(<DashboardMockup />)

    await user.tab()
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Tasks' })).toHaveFocus()
    expect(screen.getByRole('tabpanel')).toHaveTextContent(tasks.title)

    await user.keyboard('{End}')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(settings.title)

    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus()

    await user.keyboard('{Home}')
    expect(screen.getByRole('tabpanel')).toHaveTextContent(overview.title)
  })

  it('keeps only the active entry in the Tab order', async () => {
    const user = userEvent.setup()
    render(<DashboardMockup />)
    const tabIndexes = () => screen.getAllByRole('tab').map((tab) => tab.getAttribute('tabindex'))
    expect(tabIndexes()).toEqual(['0', '-1', '-1', '-1', '-1', '-1'])

    await user.click(screen.getByRole('tab', { name: 'Team' }))
    expect(tabIndexes()).toEqual(['-1', '-1', '-1', '0', '-1', '-1'])
  })
})
