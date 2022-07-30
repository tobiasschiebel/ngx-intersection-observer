export class IntersectionObserverConfig {
  /** Debounces the intersection check by the amount of milliseconds. Default value is 50ms. */
  debounce: number = 50;
  /** Specifies how many precentage of the element need to be visible to treat it as intersection. */
  threshold: number = 30
}
