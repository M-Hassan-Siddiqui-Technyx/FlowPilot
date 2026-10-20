import 'react'

// Lets components pass runtime values to CSS through custom properties (styling rule: no other inline styles).
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined
  }
}
