import { useEffect } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { Contact } from './components/sections/Contact'
import { FeatureTabs } from './components/sections/FeatureTabs'
import { Features } from './components/sections/Features'
import { Hero } from './components/sections/Hero'
import { Pricing } from './components/sections/Pricing'
import { Testimonials } from './components/sections/Testimonials'
import { TrustedLogos } from './components/sections/TrustedLogos'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { scrollToLinkedSection } from './lib/initialScroll'

export function App() {
  useSmoothScroll()
  useRevealOnScroll()
  // Shared #section links: the sections exist only now, after the first render.
  useEffect(() => scrollToLinkedSection(), [])

  return (
    <>
      <a
        href="#main"
        className="focus-ring sr-only rounded-md bg-white px-16 py-8 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:top-8 focus:left-8 focus:z-60"
      >
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TrustedLogos />
        <Features />
        <FeatureTabs />
        <Testimonials />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
