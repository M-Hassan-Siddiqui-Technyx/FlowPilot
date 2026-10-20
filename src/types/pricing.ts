export type BillingPeriod = 'monthly' | 'yearly'

export type Plan = {
  id: string
  name: string
  description: string
  /** Price in US dollars per billing period. */
  price: Record<BillingPeriod, number>
  features: string[]
  /** Highlighted "Most Popular" plan. */
  featured?: boolean
}
