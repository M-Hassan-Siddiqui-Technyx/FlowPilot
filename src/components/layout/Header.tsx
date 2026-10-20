import { useCallback, useEffect, useRef, useState } from 'react'
import { ctaLinks, navLinks, sectionIds } from '../../data/navigation'
import { useActiveSection } from '../../hooks/useActiveSection'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'
import { MobileNav } from './MobileNav'

const MOBILE_MENU_ID = 'mobile-menu'
const NAV_SECTION_IDS = navLinks.map((link) => link.href.slice(1))

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)

  // The header bar is inert while the menu is open, so focus can only return to the toggle after the re-render.
  const restoreFocus = useRef(false)
  const closeMenu = useCallback(() => {
    restoreFocus.current = true
    setMenuOpen(false)
  }, [])
  useEffect(() => {
    if (menuOpen || !restoreFocus.current) return
    restoreFocus.current = false
    // preventScroll: the toggle sits in the sticky header, inside the page's scroll-padding-top, so a plain focus()
    // made the browser think it was covered and scroll the page up to centre it. It's always on screen anyway.
    toggleRef.current?.focus({ preventScroll: true })
  }, [menuOpen])
  const closeMenuAfterNavigation = useCallback(() => setMenuOpen(false), [])
  const activeSection = useActiveSection(NAV_SECTION_IDS)
  const activeHref = activeSection ? `#${activeSection}` : null

  return (
    <header className="scroll-shadow sticky top-0 z-40 border-b border-divider bg-white">
      {/* Reading progress: fills with the page scroll (scroll-driven CSS, see index.css). */}
      <span
        aria-hidden="true"
        className="scroll-progress pointer-events-none absolute inset-x-0 -bottom-px h-hairline bg-linear-to-r/srgb from-primary to-accent"
      />
      <Container inert={menuOpen} className="flex h-63 items-center justify-between lg:h-75">
        <a href={`#${sectionIds.hero}`} className="focus-ring rounded-xs">
          <Logo className="h-26 w-94 text-ink" />
        </a>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-36 text-sm font-medium">
            {navLinks.map((link) => {
              const active = link.href === activeHref
              return (
                <li key={link.label}>
                  {/* Gradient underline grows on hover and stays under the section in view. It animates its width (painted
                      on whole pixels every frame) at a fixed 2px height, so it never looks thicker mid-animation. */}
                  <a
                    href={link.href}
                    aria-current={active ? 'location' : undefined}
                    data-active={active || undefined}
                    className="focus-ring relative rounded-xs text-muted after:absolute after:-bottom-6 after:left-0 after:right-full after:h-hairline after:rounded-full after:bg-linear-to-r/srgb after:from-primary after:to-accent hover:text-ink hover:after:right-0 data-active:text-ink data-active:after:right-0 motion-safe:transition motion-safe:after:transition-all motion-safe:after:duration-300 motion-safe:after:ease-smooth"
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-24 lg:flex">
          <a
            href={ctaLinks.logIn.href}
            className="focus-ring rounded-xs text-sm font-semibold text-ink hover:text-primary motion-safe:transition"
          >
            {ctaLinks.logIn.label}
          </a>
          <Button href={ctaLinks.getStarted.href} className="h-42 w-150 text-sm">
            <span>{ctaLinks.getStarted.label}</span>
          </Button>
        </div>

        {/* 44px touch target around the 26×24.5 design button; the negative margins keep its layout box. */}
        <button
          ref={toggleRef}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls={MOBILE_MENU_ID}
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
          className="focus-ring -mx-9 -my-10 flex size-44 items-center justify-center rounded-md text-ink lg:hidden"
        >
          <Icon name="menu" className="w-18" />
        </button>
      </Container>

      <MobileNav
        id={MOBILE_MENU_ID}
        open={menuOpen}
        onClose={closeMenu}
        onNavigate={closeMenuAfterNavigation}
        activeHref={activeHref}
      />
    </header>
  )
}
