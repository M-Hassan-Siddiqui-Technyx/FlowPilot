import { resolveFooterVariant } from '../../data/footer'
import type { FooterVariant } from '../../types/footer'
import { FooterBar } from './FooterBar'
import { FooterLinks } from './FooterLinks'

type FooterProps = {
  /** Defaults to `?footer=` in the URL, then to `defaultFooterVariant` in src/data/footer.ts. */
  variant?: FooterVariant
}

/**
 * Two footers (docs/decisions.md D-23): `figma` is the row as designed; `brief` adds the PDF's description,
 * grouped links and social links above that same row.
 */
export function Footer({ variant = resolveFooterVariant(window.location.search) }: FooterProps) {
  return (
    <footer className="border-t border-divider bg-white">
      {variant === 'brief' ? (
        <>
          <FooterLinks />
          <div className="border-t border-divider">
            <FooterBar showLogo={false} className="py-24" />
          </div>
        </>
      ) : (
        <FooterBar className="pt-24 pb-16 md:py-48" />
      )}
    </footer>
  )
}
