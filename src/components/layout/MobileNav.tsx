import { useEffect, useRef } from 'react'
import { ctaLinks, navLinks, sectionIds } from '../../data/navigation'
import { cn } from '../../lib/cn'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

type MobileNavProps = {
  id: string
  open: boolean
  /** Close and return focus to the menu toggle (Escape, close button). */
  onClose: () => void
  /** Close after a link was chosen; the browser moves focus to the target section. */
  onNavigate: () => void
  /** Href of the section in view, highlighted in the list. */
  activeHref?: string | null
}

// Menu items slide in one after another (40ms apart).
const staggerDelay = ['anim-delay-40', 'anim-delay-80', 'anim-delay-120', 'anim-delay-160', 'anim-delay-200']

/** Keeps Tab and Shift+Tab inside the open menu. */
function trapFocus(event: KeyboardEvent, container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
  if (focusable.length === 0) return
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/** Full-screen mobile menu (Figma 16:584). Rendered below lg only. */
export function MobileNav({ id, open, onClose, onNavigate, activeHref }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'Tab' && panelRef.current) trapFocus(event, panelRef.current)
    }
    document.addEventListener('keydown', onKeyDown)

    // Make the rest of the page (skip link, main, footer) inert so only the menu can be reached.
    const header = panelRef.current?.closest('header')
    const outside = header?.parentElement ? [...header.parentElement.children].filter((el) => el !== header) : []
    for (const element of outside) element.setAttribute('inert', '')

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      for (const element of outside) element.removeAttribute('inert')
    }
  }, [open, onClose])

  return (
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Main menu"
      hidden={!open}
      data-scroll-lock
      data-lenis-prevent
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white shadow-menu motion-safe:animate-menu-in lg:hidden"
    >
      <div className="flex items-center justify-between px-24 pt-28 pb-21">
        <a href={`#${sectionIds.hero}`} onClick={onNavigate} className="focus-ring rounded-xs">
          <Logo className="h-26 w-94 text-ink" />
        </a>
        {/* 44px hit area around the 40px design button; the margins keep the 32px layout slot of the design. */}
        <button
          ref={closeButtonRef}
          type="button"
          aria-label="Close menu"
          onClick={onClose}
          className="focus-ring -my-2 -mr-10 -ml-2 flex size-44 items-center justify-center rounded-lg text-menu-close"
        >
          <Icon name="close" className="size-20" />
        </button>
      </div>

      <nav aria-label="Mobile">
        <ul className="flex flex-col gap-4 px-20 pt-12">
          {navLinks.map((link, index) => {
            const active = link.href === activeHref
            return (
              <li key={link.label} className={cn('motion-safe:animate-fade-in', staggerDelay[index])}>
                <a
                  href={link.href}
                  onClick={onNavigate}
                  aria-current={active ? 'location' : undefined}
                  data-active={active || undefined}
                  className="group focus-ring flex h-54 items-center justify-between rounded-lg px-14 font-menu text-menu font-semibold text-menu-ink hover:bg-surface-muted data-active:bg-surface-muted motion-safe:transition"
                >
                  <span>{link.mobileLabel ?? link.label}</span>
                  <Icon
                    name="chevronRight"
                    className="size-16 text-menu-icon group-hover:translate-x-2 group-hover:text-primary group-data-active:text-primary motion-safe:transition"
                  />
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-12 px-24 pt-16 pb-36">
        <a
          href={ctaLinks.logIn.href}
          onClick={onNavigate}
          className="focus-ring flex h-54 items-center justify-center rounded-lg border border-menu-border font-menu text-menu-cta font-semibold text-menu-ink hover:bg-surface-muted motion-safe:transition"
        >
          <span>{ctaLinks.logIn.label}</span>
        </a>
        <a
          href={ctaLinks.startFree.href}
          onClick={onNavigate}
          className="focus-ring flex h-52 items-center justify-center rounded-lg bg-linear-to-r/srgb from-menu-cta-from to-menu-cta-to font-menu text-menu-cta font-semibold text-white shadow-menu-cta hover:brightness-110 motion-safe:transition"
        >
          <span>{ctaLinks.startFree.label}</span>
        </a>
      </div>
    </div>
  )
}
