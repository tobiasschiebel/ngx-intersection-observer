import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { IntersectionObserverEvent } from "./intersection-observer-event.model";
import { IntersectionObserverService } from "./intersection-observer.service";

@Directive({
  selector: "[intersectionObserver]",
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {

  // Private fields
  private viewportChangeSub: Subscription = new Subscription();
  private _applyClasses: string[] = [];
  private _keepClasses: string[] = [];
  private classesApplyed: boolean = false;
  private isVisible: boolean = false;

  // Directive inputs
  @Input() applyClass: string | undefined; // Classes to apply when intersecting.
  @Input() keepClass: string | undefined; // Specifies if the classes should be keept or removed when the element intersects.
  @Input() useScroll?: boolean; // true = Scroll Listener, false = IntersectionObserver
  @Input() threshold?: number; // Threshold, how many precentage of the element must be out of the viewport to treat it as invisible.

  // Directive outputs
  @Output() intersection: EventEmitter<IntersectionObserverEvent> = new EventEmitter<IntersectionObserverEvent>(); // Event that fires once an element intersects.

  constructor(
    private element: ElementRef<any>,
    private renderer: Renderer2,
    private intersectionObserverService: IntersectionObserverService) {
  }

  ngOnInit(): void {
    // Get all classes that should be set on intersection
    this.applyClass?.split(" ").forEach(cls => {
      if (cls.trim()) {
        this._applyClasses.push(cls.trim());
      }
    });

    // Get all classes that should stary after intersection
    this.keepClass?.split(" ").forEach(cls => {
      if (cls.trim()) {
        this._keepClasses.push(cls.trim());
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
    this.threshold = this.threshold ? this.threshold : 50;

    // using intersecting observer by default, else fallback to scroll Listener
    if ("IntersectionObserver" in window && !useScroll) {
      const options: IntersectionObserverInit = {
        root: null, // Use window as root
        threshold: this.threshold / 100,
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
      observer.observe(this.element.nativeElement);
      return;
    }

    // Fallback to scroll listener
    this.viewportChangeSub = this.intersectionObserverService.windowViewportChange$.subscribe(() =>
      this.checkForIntersection()
    );
  }

  /**
   * Checks if the element is visible within the viewport.
   * @returns void
   * */
  private checkForIntersection(): void {
    const thresholdPx = (this.elementHeight / 100) * this.threshold!;
    const scrollTriggerMax = this.offsetTop + thresholdPx - this.winHeight;
    const scrollTriggerMin = (this.offsetTop + (this.elementHeight - thresholdPx));
    this.handleIntersecting(
      this.intersectionObserverService.pageYOffset >= scrollTriggerMax &&
      this.intersectionObserverService.pageYOffset <= scrollTriggerMin);
  }

  /**
   * 
   * @param intersect Determines if the elements intersects with its viewport or not.
   * @returns void
   */
  private handleIntersecting(intersect: boolean): void {
    this.isVisible = intersect;
    this.handleClasses();
    this.intersection.emit({ element: this.element, intersect: intersect } as IntersectionObserverEvent);
  }

  /**
   * Adds or removes classes on the element when it enters or leaves the viewport.
   * @returns void
   * */
  private handleClasses(): void {
    // No classes, skip
    if (!this._applyClasses)
      return;

    // Element visible and no classes applied yet -> Apply classes
    if (this.isVisible && !this.classesApplyed) {
      this.addClasses(this._applyClasses);
      this.classesApplyed = true;
    }

    // Element is not visible, but classes have been assigned and no classes to keep -> remove all classes
    if (!this.isVisible && this.classesApplyed && !this.keepClass) {
      this.removeClasses(this._applyClasses);
      this.classesApplyed = false;
    }

    // Element is not visible and classes have been assigned but there are classes to keep -> remove all but keep classes
    if (!this.isVisible && this.classesApplyed && this.keepClass) {
      let removeClasses = this._applyClasses.concat(this._keepClasses);
      this._applyClasses.forEach(cls => {
        if (this._keepClasses.find(t => t == cls)) {
          removeClasses = removeClasses.filter(t => t != cls);
        }
      });
      removeClasses.forEach(cls => {
        this.renderer.removeClass(this.element.nativeElement, cls);
      });
      this.classesApplyed = false;
    }
  }

  /**
   * Helper to add a list of classes to the element.
   * @param classes The list of classes to add.
   * @returns void
   */
  private addClasses(classes: string[]): void {
    classes.forEach(cls => {
      if (!this.element.nativeElement.classList.contains(cls)) {
        this.renderer.addClass(this.element.nativeElement, cls);
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
      if (this.element.nativeElement.classList.contains(cls)) {
        this.renderer.removeClass(this.element.nativeElement, cls);
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
    if (typeof this.element.nativeElement.getBoundingClientRect === "function") {
      const viewportTop = this.element.nativeElement.getBoundingClientRect().top;
      return viewportTop + this.intersectionObserverService.pageYOffset - this.element.nativeElement.clientTop;
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
    return this.element.nativeElement.offsetHeight as number;
  }

  ngOnDestroy(): void {
    this.viewportChangeSub.unsubscribe();
  }
}
