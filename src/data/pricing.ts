import type { BillingPeriod, Plan } from '../types/pricing'

/** The brief requires monthly pricing at handoff. */
export const defaultBillingPeriod: BillingPeriod = 'monthly'

export const billingPeriods: { id: BillingPeriod; label: string; suffix: string }[] = [
  { id: 'monthly', label: 'Monthly', suffix: '/month' },
  { id: 'yearly', label: 'Yearly', suffix: '/year' },
]

// Yearly prices are not in the design: placeholder "two months free" (10 × monthly), see docs/decisions.md.
export const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'For individuals getting started',
    price: { monthly: 0, yearly: 0 },
    features: ['Up to 3 projects', 'Basic AI suggestions', 'Community support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For growing teams',
    price: { monthly: 19, yearly: 190 },
    features: ['Unlimited projects', 'Advanced AI suggestions', 'Team collaboration', 'Priority support'],
    featured: true,
  },
  {
    id: 'business',
    name: 'Business',
    description: 'For larger organizations',
    price: { monthly: 49, yearly: 490 },
    features: ['Everything in Pro', 'Advanced automations', 'Custom integrations', 'Dedicated support'],
  },
]
