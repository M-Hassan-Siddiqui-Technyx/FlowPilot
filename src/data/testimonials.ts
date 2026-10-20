import type { Testimonial } from '../types/testimonials'

// Only Jessica Lee's quote is in the Figma file; the other three are placeholder copy (docs/decisions.md).
export const testimonials: Testimonial[] = [
  {
    id: 'jessica-lee',
    quote:
      'FlowPilot has completely changed how our team works. We’re more organized, more productive, and spend less time on repetitive tasks.',
    shortQuote:
      'FlowPilot has completely changed how our team works. We’re more organized and spend less time on repetitive tasks.',
    name: 'Jessica Lee',
    role: 'Product Manager, Acme Inc.',
    rating: 5,
  },
  {
    id: 'marcus-chen',
    quote:
      'The AI suggestions surface blockers before stand-up. Our sprint planning went from two hours to twenty minutes.',
    name: 'Marcus Chen',
    role: 'Engineering Lead, Northwind',
    rating: 5,
  },
  {
    id: 'priya-patel',
    quote:
      'Automations took over our weekly reporting entirely. The team finally spends Fridays on real work instead of status updates.',
    name: 'Priya Patel',
    role: 'Operations Director, Lumen Labs',
    rating: 5,
  },
  {
    id: 'daniel-okafor',
    quote:
      'Everyone sees the same priorities in real time, so hand-offs between design and engineering just happen.',
    name: 'Daniel Okafor',
    role: 'Head of Design, Brightline',
    rating: 5,
  },
]
