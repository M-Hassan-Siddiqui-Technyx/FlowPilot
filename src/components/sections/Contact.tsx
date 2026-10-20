import { sectionIds } from '../../data/navigation'
import { Container } from '../ui/Container'
import { ContactForm } from './ContactForm'

/** Contact (Figma desktop 1:909, mobile 2:1228). On mobile the form sits directly on white, without the card. */
export function Contact() {
  return (
    <section
      id={sectionIds.contact}
      aria-labelledby="contact-title"
      className="pt-16 pb-48 md:bg-linear-to-r/srgb md:from-tint-from md:to-tint-to md:py-80"
    >
      {/* From xl the intro and the form card keep Figma's 428.78 : 675.22 proportions as the row stretches (grid
          template = Figma widths). The intro keeps its 429dp measure, so the heading breaks as designed. */}
      <Container className="xl:grid xl:grid-cols-[428.78fr_675.22fr] xl:items-start xl:gap-48">
        <div className="reveal pb-24 md:pb-32 xl:max-w-429 xl:min-w-0 xl:pt-16 xl:pb-0">
          <p className="hidden text-xs font-bold tracking-wider text-primary uppercase md:mb-8 md:block">Get in touch</p>
          <h2 id="contact-title" className="text-h3 font-heavy text-ink md:text-h2-tight md:font-extrabold">
            Let&apos;s build the future together
          </h2>
          <p className="mt-4 text-xs font-medium text-muted md:mt-15 md:max-w-384 md:text-body-relaxed md:font-normal">
            Have questions? Want a demo? Send us a message and our team will get back to you.
          </p>
        </div>

        <div className="reveal md:rounded-card md:border md:border-border md:bg-white md:p-32 md:shadow-card">
          <ContactForm />
        </div>
      </Container>
    </section>
  )
}
