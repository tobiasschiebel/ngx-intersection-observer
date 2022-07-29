import { ElementRef } from "@angular/core";

export interface IntersectionObserverEvent {
  /** True if the element is intersecting, otherwhise fals */
  intersect: boolean,
  /** Intersecting element */
  element: ElementRef<any>
}
