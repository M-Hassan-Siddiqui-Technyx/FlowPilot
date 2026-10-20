import { useRef, useState, type FocusEvent, type PointerEvent } from 'react'
import { sectionIds } from '../../data/navigation'
import { testimonials } from '../../data/testimonials'
import { useInView } from '../../hooks/useInView'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { cn } from '../../lib/cn'
import { Container } from '../ui/Container'
import { Icon } from '../ui/Icon'

const MAX_RATING = 5

type SlideDirection = 'next' | 'prev'

type SlideState = {
  index: number
  /** The slide that is animating out, if any. */
  previous: number | null
  direction: SlideDirection
}

const enterAnimation: Record<SlideDirection, string> = {
  next: 'motion-safe:animate-slide-enter-next',
  prev: 'motion-safe:animate-slide-enter-prev',
}
const exitAnimation: Record<SlideDirection, string> = {
  next: 'motion-safe:animate-slide-exit-next',
  prev: 'motion-safe:animate-slide-exit-prev',
}

/** How far (CSS px) a finger must travel sideways on the card to change slides. */
const SWIPE_DISTANCE = 40

// Phones (below md) hide the arrows and bullets, as the mobile design has none (D-38): visually only, so screen
// readers keep them. max-md is needed because sr-only's reset (not-sr-only) would undo the controls' own sizes.
const phoneHidden = 'max-md:sr-only'

const arrowButton =
  'group focus-ring flex size-44 shrink-0 items-center justify-center rounded-control border border-border bg-white text-arrow font-semibold text-ink hover:border-primary hover:text-primary motion-safe:transition xl:size-42'

/** Keyboard focus pauses autoplay; a mouse click on a control (which also focuses it) doesn't. */
function isKeyboardFocus(element: Element) {
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

/**
 * Testimonial slider (Figma desktop 1:787; mobile 63:30, 63:35, 2:1061).
 * Autoplay (docs/decisions.md D-20): starts once the slider is in view and keeps playing under the mouse
 * (developer request); pauses on keyboard focus or when scrolled away; stops with the Pause button; never runs
 * with reduced motion. The active bullet's fill animation is the clock, so bullet and slide always stay in sync.
 * Touch: swiping the card sideways changes slides; on phones that replaces the visible arrows and bullets (D-38).
 */
export function Testimonials() {
  const [slide, setSlide] = useState<SlideState>({ index: 0, previous: null, direction: 'next' })
  const [stopped, setStopped] = useState(false)
  const [focused, setFocused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const inView = useInView(carouselRef)
  const reducedMotion = usePrefersReducedMotion()

  const count = testimonials.length
  const activeIndex = slide.index
  // Autoplay needs IntersectionObserver (to start in view) and never runs for reduced motion; without it the live
  // region always announces changes and the active bullet shows full instead of a frozen, empty countdown.
  const canAutoplay = !reducedMotion && typeof IntersectionObserver !== 'undefined'
  const autoplay = canAutoplay && !stopped
  const running = autoplay && inView && !focused

  const showSlide = (index: number, direction: SlideDirection) => {
    const next = (index + count) % count
    if (next === activeIndex) return
    setSlide({ index: next, previous: activeIndex, direction })
  }

  // Swipe: remember where a touch or pen press started; on release, a mostly sideways move changes slides.
  const swipeStart = useRef<{ x: number; y: number } | null>(null)
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    swipeStart.current = event.pointerType === 'mouse' ? null : { x: event.clientX, y: event.clientY }
  }
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current
    swipeStart.current = null
    if (!start) return
    const dx = event.clientX - start.x
    if (Math.abs(dx) < SWIPE_DISTANCE || Math.abs(dx) < Math.abs(event.clientY - start.y)) return
    if (dx < 0) showSlide(activeIndex + 1, 'next')
    else showSlide(activeIndex - 1, 'prev')
  }

  const onFocus = (event: FocusEvent<HTMLDivElement>) => {
    if (isKeyboardFocus(event.target)) setFocused(true)
  }
  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
  }

  return (
    <section id={sectionIds.testimonials} aria-labelledby="testimonials-title" className="pb-49 md:py-80">
      {/* From xl the text and the slider (arrows + card) keep Figma's 468 : 669 proportions as the row stretches
          (grid template = Figma widths). */}
      <Container className="flex flex-col xl:grid xl:grid-cols-[468fr_669fr] xl:items-center xl:gap-14">
        <div className="reveal mb-18 md:mb-40 xl:mb-0 xl:min-w-0">
          <p className="mb-8 text-sm font-bold tracking-wide text-primary uppercase md:mb-9">Testimonials</p>
          <h2
            id="testimonials-title"
            className="mb-28 text-h2-sm-loose font-extrabold text-ink md:mb-11 md:text-h2-lg"
          >
            Loved by modern teams
          </h2>
          <p className="text-md text-muted">See how FlowPilot helps teams work smarter and save time.</p>
        </div>

        {/* One set of controls: below the card when stacked, flanking it from xl (CSS order). */}
        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Customer testimonials"
          onFocus={onFocus}
          onBlur={onBlur}
          className="reveal relative flex flex-wrap items-center justify-center gap-x-8 gap-y-20 xl:flex-nowrap xl:gap-14"
        >
          {/* WCAG 2.2.2: moving content needs a way to stop it. The design has no pause control, so this one is
              invisible and click-through until a keyboard user tabs onto it (like a skip link); screen readers always
              find it. First in the carousel, as in the WAI-ARIA carousel pattern; absolute, so it never moves the
              layout. Not rendered when autoplay can't run. */}
          {canAutoplay && (
            <button
              type="button"
              onClick={() => setStopped((value) => !value)}
              className="focus-ring pointer-events-none absolute top-12 right-12 z-10 flex items-center gap-6 rounded-full bg-white px-12 py-6 text-xs font-semibold whitespace-nowrap text-ink opacity-0 shadow-card focus-visible:pointer-events-auto focus-visible:opacity-100"
            >
              <Icon name={stopped ? 'play' : 'pause'} className="size-14 text-primary" />
              {stopped ? 'Play testimonials' : 'Pause testimonials'}
            </button>
          )}
          {/* touch-pan-y: vertical drags still scroll the page, sideways ones reach the swipe handlers. */}
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipeStart.current = null)}
            className="relative order-1 flex w-full touch-pan-y flex-col overflow-hidden rounded-card-lg bg-linear-to-r/srgb from-tint-from to-tint-to p-20 md:border md:border-border md:bg-white md:bg-none md:p-32 md:shadow-card xl:order-2 xl:min-w-0 xl:flex-1">
            <span
              aria-hidden="true"
              className="h-40 text-quote-mark-sm font-bold text-accent md:absolute md:top-17 md:left-25 md:h-auto md:text-quote-mark"
            >
              “
            </span>
            {/* Slides share one grid cell, so the card keeps the height of the longest quote.
                Automatic changes aren't announced (live region off) while autoplay runs. */}
            <div aria-live={running ? 'off' : 'polite'} className="grid">
              {testimonials.map((testimonial, index) => {
                const active = index === activeIndex
                const leaving = index === slide.previous
                return (
                  <figure
                    key={testimonial.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} of ${count}`}
                    aria-hidden={!active || undefined}
                    className={cn(
                      'col-start-1 row-start-1 flex flex-col',
                      active && enterAnimation[slide.direction],
                      leaving && cn('pointer-events-none motion-reduce:invisible', exitAnimation[slide.direction]),
                      !active && !leaving && 'invisible',
                    )}
                  >
                    {/* xl:max-w-493 keeps the quote at its Figma measure in the wider card, so lines break as designed. */}
                    <blockquote className="text-quote-sm font-medium text-ink md:pt-7 md:pb-24 md:pl-28 md:text-quote xl:max-w-493">
                      {testimonial.shortQuote ? (
                        <>
                          <span className="md:hidden">{testimonial.shortQuote}</span>
                          <span className="hidden md:inline">{testimonial.quote}</span>
                        </>
                      ) : (
                        testimonial.quote
                      )}
                    </blockquote>
                    <figcaption
                      className={cn(
                        'mt-auto flex items-center justify-between gap-16 pt-50 md:pt-7 md:pl-28',
                        active && 'motion-safe:animate-fade-in motion-safe:anim-delay-200',
                      )}
                    >
                      <span>
                        <span className="block text-xs font-bold text-ink md:text-sm">{testimonial.name}</span>
                        <span className="block text-tiny text-muted md:mt-1 md:text-2xs">{testimonial.role}</span>
                      </span>
                      <span
                        role="img"
                        aria-label={`Rated ${testimonial.rating} out of ${MAX_RATING}`}
                        className="hidden text-rating md:flex"
                      >
                        {Array.from({ length: MAX_RATING }, (_, star) => (
                          <Icon
                            key={`star-${star}`}
                            name="star"
                            className={cn('h-21', star >= testimonial.rating && 'text-border')}
                          />
                        ))}
                      </span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>

          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => showSlide(activeIndex - 1, 'prev')}
            className={cn(arrowButton, phoneHidden, 'order-2 xl:order-1')}
          >
            <span aria-hidden="true" className="motion-safe:transition-transform group-hover:-translate-x-2">
              ‹
            </span>
          </button>

          <div className={cn(phoneHidden, 'order-3 flex items-center xl:absolute xl:top-full xl:left-1/2 xl:mt-16 xl:-translate-x-1/2')}>
            {testimonials.map((testimonial, index) => {
              const active = index === activeIndex
              return (
                <button
                  key={testimonial.id}
                  type="button"
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => showSlide(index, index < activeIndex ? 'prev' : 'next')}
                  className="group focus-ring flex size-44 items-center justify-center rounded-full xl:size-32"
                >
                  {/* Active bullet: a pill whose gradient fill tracks the autoplay time; full when not playing. */}
                  <span
                    className={cn(
                      'relative h-8 overflow-hidden rounded-full motion-safe:transition-all motion-safe:duration-500 motion-safe:ease-smooth',
                      active ? 'w-32 bg-primary/20' : 'w-8 bg-placeholder group-hover:scale-125 group-hover:bg-ink',
                    )}
                  >
                    {active && (
                      <span
                        key={activeIndex}
                        data-testid="slide-progress"
                        onAnimationEnd={() => {
                          if (running) showSlide(activeIndex + 1, 'next')
                        }}
                        className={cn(
                          'absolute inset-0 origin-left rounded-full bg-linear-to-r/srgb from-primary to-accent',
                          autoplay && 'animate-slide-progress',
                          !running && 'animation-paused',
                        )}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>

          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => showSlide(activeIndex + 1, 'next')}
            className={cn(arrowButton, phoneHidden, 'order-4 xl:order-3')}
          >
            <span aria-hidden="true" className="motion-safe:transition-transform group-hover:translate-x-2">
              ›
            </span>
          </button>
        </div>
      </Container>
    </section>
  )
}
