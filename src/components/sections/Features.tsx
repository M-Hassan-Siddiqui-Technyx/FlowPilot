import { features } from '../../data/features'
import { sectionIds } from '../../data/navigation'
import { Container } from '../ui/Container'
import { FeatureCard } from './FeatureCard'

/** Capabilities (Figma desktop 1:712, mobile 2:1021). */
export function Features() {
  return (
    <section id={sectionIds.features} aria-labelledby="features-title" className="pt-16 md:py-64">
      <Container className="flex flex-col gap-16 md:items-center md:gap-48">
        <div className="reveal pb-4 md:flex md:max-w-768 md:flex-col md:gap-11 md:pb-0 md:text-center">
          <h2 id="features-title" className="text-h2-sm font-heavy text-ink md:text-h2 md:font-extrabold md:tracking-tight">
            Everything your team
            <br className="md:hidden" /> needs to move faster
          </h2>
          <p className="hidden text-md text-muted md:block">
            Powerful features to help you plan, automate and collaborate, all in one place.
          </p>
        </div>

        <ul className="flex w-full flex-col gap-16 md:grid md:grid-cols-2 md:gap-24 xl:grid-cols-4">
          {/* Cards reveal one after another (90ms apart); the delay is a runtime value, passed as a CSS variable. */}
          {features.map((feature, index) => (
            <li key={feature.id} className="reveal" style={{ '--reveal-delay': `${index * 90}ms` }}>
              <FeatureCard feature={feature} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
