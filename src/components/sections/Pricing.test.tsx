import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { Pricing } from './Pricing'

const plan = (name: string) => screen.getByRole('article', { name })

describe('Pricing', () => {
  it('shows the three plans with monthly prices at handoff', () => {
    render(<Pricing />)
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'true')
    expect(within(plan('Starter')).getByText('$0')).toBeInTheDocument()
    expect(within(plan('Pro')).getByText('$19')).toBeInTheDocument()
    expect(within(plan('Business')).getByText('$49')).toBeInTheDocument()
    expect(screen.getAllByText('/month')).toHaveLength(3)
    expect(within(plan('Pro')).getByText('Most Popular')).toBeInTheDocument()
  })

  it('switches every plan to yearly billing and back', async () => {
    const user = userEvent.setup()
    render(<Pricing />)

    await user.click(screen.getByRole('button', { name: 'Yearly' }))
    expect(screen.getByRole('button', { name: 'Yearly' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Monthly' })).toHaveAttribute('aria-pressed', 'false')
    expect(within(plan('Pro')).getByText('$190')).toBeInTheDocument()
    expect(screen.getAllByText('/year')).toHaveLength(3)

    await user.click(screen.getByRole('button', { name: 'Monthly' }))
    expect(within(plan('Pro')).getByText('$19')).toBeInTheDocument()
  })
})
