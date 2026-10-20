import { render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { defaultFooterVariant, footerLinkGroups, resolveFooterVariant, socialLinks } from '../../data/footer'
import { Footer } from './Footer'

afterEach(() => window.history.replaceState(null, '', '/'))

describe('Footer', () => {
  it('figma variant: logo, copyright and legal links only, as designed', () => {
    render(<Footer variant="figma" />)
    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'FlowPilot' })).toHaveAttribute('href', '#hero')
    expect(within(footer).getByText(/© \d{4} FlowPilot Inc\. All rights reserved\./)).toBeInTheDocument()
    const legal = within(footer).getByRole('navigation', { name: 'Legal' })
    expect(within(legal).getAllByRole('link').map((link) => link.textContent)).toEqual(['Privacy', 'Terms', 'Security'])
    expect(within(footer).queryByRole('list', { name: 'Social media' })).not.toBeInTheDocument()
  })

  it('brief variant: adds the description, grouped links and social links the PDF asks for', () => {
    render(<Footer variant="brief" />)
    const footer = screen.getByRole('contentinfo')

    expect(within(footer).getByText(/helps modern teams plan work/i)).toBeInTheDocument()
    const groups = within(footer).getByRole('navigation', { name: 'Footer' })
    for (const group of footerLinkGroups) {
      expect(within(groups).getByRole('heading', { name: group.title })).toBeInTheDocument()
    }
    expect(within(groups).getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '#pricing')

    const social = within(footer).getByRole('list', { name: 'Social media' })
    for (const link of socialLinks) {
      const anchor = within(social).getByRole('link', { name: `${link.label} (opens in a new tab)` })
      expect(anchor).toHaveAttribute('target', '_blank')
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer')
    }
    // The designed row (copyright and legal links) stays at the bottom.
    expect(within(footer).getByRole('navigation', { name: 'Legal' })).toBeInTheDocument()
    expect(within(footer).getByText(/All rights reserved/)).toBeInTheDocument()
  })

  it('picks the variant from ?footer= and falls back to the default', () => {
    expect(resolveFooterVariant('?footer=brief')).toBe('brief')
    expect(resolveFooterVariant('?footer=figma')).toBe('figma')
    expect(resolveFooterVariant('?footer=nope')).toBe(defaultFooterVariant)
    expect(resolveFooterVariant('')).toBe(defaultFooterVariant)

    window.history.replaceState(null, '', '/?footer=brief')
    render(<Footer />)
    expect(screen.getByRole('list', { name: 'Social media' })).toBeInTheDocument()
  })
})
