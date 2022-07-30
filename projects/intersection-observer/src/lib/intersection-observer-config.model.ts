export class IntersectionObserverConfig {
  /** Debounces the intersection check. */
  debounce: number = 50;
  /** Specifies how many precentage of the element need to be visible to treat it as intersection. */
  threshold: number = 30;
  /** Automatically remove classes from the element. */
  autoRemove: boolean = true;
  /**  Scroll Listener, false = IntersectionObserver */
  useScroll: boolean = false;
}
