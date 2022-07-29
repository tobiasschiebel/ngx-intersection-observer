import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Optional, Output, Renderer2 } from "@angular/core";
import { Subscription } from "rxjs";
import { IntersectionObserverConfig } from "./intersection-observer-config.model";
import { IntersectionObserverEvent } from "./intersection-observer-event.model";
import { IntersectionObserverService } from "./intersection-observer.service";

@Directive({
  selector: "[intersectionObserver]",
  
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {

  // Private fields
  private _viewportChangeSub: Subscription = new Subscription();
  private _addVisit: string[] = [];
  private _addLeave: string[] = [];
  private _removeVisit: string[] = [];
  private _removeLeave: string[] = [];  
  private _elementVisible: boolean = false;
  private _hasClasses: boolean = false;

  // Directive inputs
  @Input() addVisit: string | undefined;     // Classes to apply when the element visits the viewport.
  @Input() addLeave: string | undefined;     // Classes to apply when the element visits the viewport.
  @Input() removeVisit: string | undefined   // Classes to remove whe the element visits the viewport
  @Input() removeLeave: string | undefined   // Classes to remove when the element leaves the viewport.

  @Input() useScroll: boolean | undefined     // true = Scroll Listener, false = IntersectionObserver
  @Input() threshold: number | undefined;        // Threshold, how many precentage of the element must be out of the viewport to treat it as invisible.
  @Input() autoRemove: boolean | undefined;    // true = Automatically remove classes from the element, false -> use removeLeave

  // Directive outputs
  @Output() intersection: EventEmitter<IntersectionObserverEvent> =
    new EventEmitter<IntersectionObserverEvent>(); // Event that fires once an element intersects.

  constructor(
    private element: ElementRef<any>,
    private renderer: Renderer2,
    private intersectionObserverService: IntersectionObserverService,
    @Optional() private intersectionObserverConfig?: IntersectionObserverConfig) {
  }

  ngOnInit(): void {

    // Generate arrays of class stings
    this._addVisit = this.getClassArray(this.addVisit ?? "");
    this._addLeave = this.getClassArray(this.addLeave ?? "");
    this._removeVisit = this.getClassArray(this.removeVisit ?? "");
    this._removeLeave = this.getClassArray(this.removeLeave ?? "");
    this._hasClasses = (this.addVisit || this.addLeave || this.removeVisit || this.removeLeave) ? true : false;

    // Identify which intersection mechanism should be used (IntersectionObserver or Scroll Listener)
    let useScroll = false;
    if (this.useScroll == undefined) {
      useScroll = false;
    }
    else {
      useScroll = this.useScroll!
    }

    // Get threshold or default to 30
    let threshold = this.intersectionObserverConfig?.threshold ?
      this.intersectionObserverConfig?.threshold : 30;
    if (this.threshold == undefined) {
      this.threshold = threshold;
    }
    else {
      threshold = this.threshold;
    }

    // using intersecting observer by default, else fallback to scroll Listener
    if ("IntersectionObserver" in window && !useScroll) {
      const options: IntersectionObserverInit = {
        root: null, // Use window as root
        threshold: threshold / 100,
        rootMargin: "0px"
      };
      const observer: IntersectionObserver = new IntersectionObserver(
        (entries, _) => {
          entries.forEach((entry) => {
            this.handleIntersection(entry.isIntersecting);
          });
        },
        options
      );
      observer.observe(this.element.nativeElement);
      return;
    }

    // Fallback to scroll listener
    this._viewportChangeSub = this.intersectionObserverService.windowViewportChange$.subscribe(() =>
      this.checkForIntersection()
    );
  }

  /**
   * Gets an array of classes.
   * @param classString String with classes separated by whitespace.
   * @returns An array with classes.
   */
  private getClassArray(classString: string): string[] {
    let classes = new Array<string>();
    classString.split(" ").forEach(cls => {
      if (cls.trim()) {
        classes.push(cls.trim());
      }
    });

    return classes;
  }

  /**
   * Checks if the element is visible within the viewport.
   * @returns void
   * */
  private checkForIntersection(): void {
    const thresholdPx = (this.elementHeight / 100) * this.threshold!;
    const scrollTriggerMax = this.offsetTop + thresholdPx - this.winHeight;
    const scrollTriggerMin = (this.offsetTop + (this.elementHeight - thresholdPx));
    this.handleIntersection(
      this.intersectionObserverService.pageYOffset >= scrollTriggerMax &&
      this.intersectionObserverService.pageYOffset <= scrollTriggerMin);
  }

  /**
   * 
   * @param intersect Determines if the elements intersects with its viewport or not.
   * @returns void
   */
  private handleIntersection(intersect: boolean): void {
    this._elementVisible = intersect;
    this.handleClasses();
    this.intersection.emit({ element: this.element, intersect: intersect } as IntersectionObserverEvent);
  }

  /**
   * Adds or removes classes on the element when it enters or leaves the viewport.
   * @returns void
   * */
  private handleClasses(): void {
    // No classes, skip
    if (!this._hasClasses)
      return;

    if (this._elementVisible) {
      this.addClasses(this._addVisit);
      if (this.autoRemove) {
        this.removeClasses(this._addLeave);
      }
      this.removeClasses(this._removeVisit);
    }
    else {
      this.addClasses(this._addLeave);
      if (this.autoRemove) {
        this.removeClasses(this._addVisit);
      }
      this.removeClasses(this._removeLeave)
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
    this._viewportChangeSub.unsubscribe();
  }
}
