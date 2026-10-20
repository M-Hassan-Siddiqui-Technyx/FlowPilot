import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '../../lib/cn'

type ContainerProps = ComponentPropsWithoutRef<'div'>

/**
 * Page column without a max-width (the fluid rem root scales the whole layout instead).
 * Gutters in design pixels: 20 on phones, 32 on tablets and 64 on desktops, as in the Figma frames. The desktop root
 * scales with the viewport from 16px at 1280 to 18px at 1440 (D-29), so the content is the frame's 1152dp. Wider
 * screens keep the 1440 size (D-30): the desktop gutter is max(64dp, half of what's left beside 1152dp), so the
 * content stays 1152dp and centred while the margins grow.
 */
export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        // calc() built from the spacing token: 64dp, or more once the viewport is wider than the 1440 page.
        'w-full px-20 md:px-32 lg:px-[max(calc(var(--spacing)*64),calc((100%_-_var(--spacing)*1152)/2))]',
        className,
      )}
      {...props}
    />
  )
}
