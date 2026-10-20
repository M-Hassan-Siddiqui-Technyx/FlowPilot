export type Rating = 1 | 2 | 3 | 4 | 5

export type Testimonial = {
  id: string
  quote: string
  /** Shorter quote used by the compact mobile card, when the design has one. */
  shortQuote?: string
  name: string
  role: string
  /** Stars out of 5. */
  rating: Rating
}
