/** Simulated request: there is no backend, so submission resolves after about a second. */
export function submitContactRequest(delayMs = 1000) {
  return new Promise<void>((resolve) => setTimeout(resolve, delayMs))
}
