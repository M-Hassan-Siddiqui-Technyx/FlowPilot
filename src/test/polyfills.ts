// jsdom has no AnimationEvent. Without it React DOM listens for the prefixed `webkitAnimationEnd`,
// so `onAnimationEnd` handlers never see a dispatched `animationend`. This must load before react-dom.
if (!('AnimationEvent' in window)) {
  class AnimationEventPolyfill extends Event {
    readonly animationName: string
    readonly elapsedTime: number
    readonly pseudoElement: string

    constructor(type: string, init: AnimationEventInit = {}) {
      super(type, init)
      this.animationName = init.animationName ?? ''
      this.elapsedTime = init.elapsedTime ?? 0
      this.pseudoElement = init.pseudoElement ?? ''
    }
  }
  Object.defineProperty(window, 'AnimationEvent', { value: AnimationEventPolyfill, writable: true, configurable: true })
}

// jsdom doesn't lay out, so it has no scrollIntoView; a no-op lets components call it and tests spy on it.
if (!('scrollIntoView' in Element.prototype)) {
  Object.defineProperty(Element.prototype, 'scrollIntoView', { value: () => {}, writable: true, configurable: true })
}
