import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { ViewportService } from "./viewport.service";

@Directive({
  selector: "[appViewport]",
})
export class ViewportDirective implements OnInit, OnDestroy {

  // Private fields
  private viewportChangeSub: Subscription = new Subscription();
  private classes: string[] = [];
  private hasClasses: boolean = false;
  private isVisible: boolean = false;

  // Directive inputs
  @Input() viewportClasses: string | undefined; // Classes to apply when intersecting.
  @Input() keepClasses: boolean = true; // Specifies if the classes should be keept or removed when the element intersects.
  @Input() useScroll?: boolean; // true = Scroll Listener, false = IntersectionObserver
  @Input() threshold?: number; // Threshold, how many precentage of the element must be out of the viewport to treat it as invisible.

  // Directive outputs
  @Output() intersecting: EventEmitter<boolean> = new EventEmitter<boolean>(); // Event that fires once an element intersects.

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private viewportService: ViewportService) {
  }

  ngOnInit(): void {
    // Get all classes that should be set on intersection
    this.viewportClasses?.split(" ").forEach(cls => {
      if (cls.trim()) {
        this.classes.push(cls.trim());
      }
    });

    // Identify which intersection mechanism should be used (IntersectionObserver or Scroll Listener)
    let useScroll = false;
    if (this.useScroll == undefined) {
      useScroll = false;
    }
    else {
      useScroll = this.useScroll!
    }

    // Get threshold or default to 0.5
    this.threshold = this.threshold ? this.threshold || 0.5 : 0.5;

    // using intersecting observer by default, else fallback to scroll Listener
    if ("IntersectionObserver" in window && !useScroll) {
      const options: IntersectionObserverInit = {
        root: null, // Use window as root
        threshold: this.threshold,
        rootMargin: "0px"
      };
      const observer: IntersectionObserver = new IntersectionObserver(
        (entries, _) => {
          entries.forEach((entry) => {
            this.handleIntersecting(entry.isIntersecting);
          });
        },
        options
      );
      observer.observe(this.elementRef.nativeElement);
      return;
    }

    // Fallback to scroll listener
    this.viewportChangeSub = this.viewportService.windowViewportChange$.subscribe(() =>
      this.checkForIntersection()
    );
  }

  /**
   * Checks if the element is visible within the viewport.
   * @returns void
   * */
  private checkForIntersection(): void {
    const thresholdPx = (this.elementHeight / 100) * (this.threshold! * 100);
    const scrollTriggerMax = this.offsetTop + thresholdPx - this.winHeight;
    const scrollTriggerMin = (this.offsetTop + (this.elementHeight - thresholdPx));
    this.handleIntersecting(
      this.viewportService.positionY >= scrollTriggerMax &&
      this.viewportService.positionY <= scrollTriggerMin);
  }

  /**
   * 
   * @param value Determines if the elements intersects with its viewport or not.
   * @returns void
   */
  private handleIntersecting(value: boolean): void {
    this.isVisible = value;
    this.handleClasses();
    this.intersecting.emit(this.isVisible);
  }

  /**
   * Adds or removes classes on the element when it enters or leaves the viewport.
   * @returns void
   * */
  private handleClasses(): void {
    if (!this.classes)
      return;

    if (this.isVisible && !this.hasClasses) {
      this.addClasses(this.classes);
      this.hasClasses = true;
    }
    else if (!this.isVisible && this.hasClasses && !this.keepClasses) {
      this.removeClasses(this.classes);
      this.hasClasses = false;
    }
  }

  /**
   * Helper to add a list of classes to the element.
   * @param classes The list of classes to add.
   * @returns void
   */
  private addClasses(classes: string[]): void {
    classes.forEach(cls => {
      if (!this.elementRef.nativeElement.classList.contains(cls)) {
        this.renderer.addClass(this.elementRef.nativeElement, cls);
      }
    });
  }

  /**
  * Helper to remove a list of classes from the element.
  * @param classes The list of classes to remove.
  * @returns void
  */
  private removeClasses(classes: string[]) {
    classes.forEach(cls => {
      if (this.elementRef.nativeElement.classList.contains(cls)) {
        this.renderer.removeClass(this.elementRef.nativeElement, cls);
      }
    });
  }

  /**
  * Gets the height of the browser window. 
  * @returns the height of the browser window.
  */
  private get winHeight() {
    return typeof window !== "undefined" ? window.innerHeight : 0;
  }

  /**
  * Gets the offset of the element. 
  * @returns The elements offset.
  */
  private get offsetTop() {
    if (typeof this.elementRef.nativeElement.getBoundingClientRect === "function") {
      const viewportTop = this.elementRef.nativeElement.getBoundingClientRect().top;
      return viewportTop + this.viewportService.positionY - this.elementRef.nativeElement.clientTop;
    }
    else {
      return 0;
    }
  }

  /**
  * Gets the height of the element (Including border)
  * @returns the height of the element.
  */
  private get elementHeight() {
    return this.elementRef.nativeElement.offsetHeight as number;
  }

  ngOnDestroy(): void {
    this.viewportChangeSub.unsubscribe();
  }
}
