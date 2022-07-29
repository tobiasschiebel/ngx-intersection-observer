import { Injectable, OnDestroy, Optional } from '@angular/core';
import { debounceTime, distinctUntilChanged, EMPTY, fromEvent, merge, Observable, ReplaySubject, Subscription } from 'rxjs';
import { IntersectionObserverConfig } from './intersection-observer-config.model';

@Injectable({
  providedIn: 'root'
})
export class IntersectionObserverService implements OnDestroy {
  private _windowScrollY$: ReplaySubject<number> = new ReplaySubject<number>();
  private _windowResize$: ReplaySubject<number> = new ReplaySubject<number>();
  private _windowViewportChange$: ReplaySubject<number> = new ReplaySubject<number>();
  private _pageYOffset: number = 0;
  private _config: IntersectionObserverConfig;

  private onScroll$: Observable<any>;
  private onResize$: Observable<any>;

  private scrollSub: Subscription;
  private resizeSub: Subscription;
  private viewportChangeSub: Subscription;

  constructor(@Optional() config?: IntersectionObserverConfig) {

    // Get the config or default
    this._config = config ? config : {
      debounce: 10
    } as IntersectionObserverConfig;

    // Manage scroll position initially
    this.manageScrollPos();

    // Subscribe to window scroll event and debounce it
    this.onScroll$ =
      typeof window !== "undefined" ? fromEvent(window, "scroll") : EMPTY;
    this.scrollSub = this.onScroll$
      .pipe(
        debounceTime(this.config.debounce),
        distinctUntilChanged())
      .subscribe(t => {
        this.manageScrollPos();
        this._windowScrollY$.next(this._pageYOffset);
      });

    // Subscribe to window resize event and debounce it
    this.onResize$ =
      typeof window !== "undefined" ? fromEvent(window, "resize") : EMPTY;
    this.resizeSub = this.onResize$
      .pipe(
        debounceTime(this.config.debounce),
        distinctUntilChanged())
      .subscribe(t => {
        this.manageScrollPos();
        this._windowResize$.next(this._pageYOffset);
      });

    // Observable that fires on scroll or resize
    this.viewportChangeSub = merge(this._windowScrollY$, this._windowResize$)
      .subscribe(t => {
        this._windowViewportChange$.next(this._pageYOffset);
      });
  }

  /** Gets the page offset Y axis */
  get pageYOffset() {
    return this._pageYOffset;
  }

  /** Gets the intersection observer config */
  get config() {
    return this._config;
  }

  /** Gets an observable to the window scroll event */
  get windowScrollY$() {
    return this._windowScrollY$;
  }

  /** Gets an observable to the window resize event */
  get windowResize$() {
    return this._windowResize$;
  }

  /** Gets an observable to the window viewport event (combination of resize and scroll) */
  get windowViewportChange$() {
    return this._windowViewportChange$;
  }

  private manageScrollPos(): void {
    this._pageYOffset = typeof window !== "undefined" ? window.pageYOffset : 0;
  }

  ngOnDestroy(): void {
    this.scrollSub.unsubscribe();
    this.resizeSub.unsubscribe();
    this.viewportChangeSub.unsubscribe();
  }
}
