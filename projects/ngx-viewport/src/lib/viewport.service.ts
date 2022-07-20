import { Inject, Injectable, OnDestroy } from '@angular/core';
import { debounceTime, distinctUntilChanged, EMPTY, fromEvent, merge, Observable, ReplaySubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViewportService implements OnDestroy {
  private _windowScroll$: ReplaySubject<number>;
  private _windowResize$: ReplaySubject<number>;
  private _windowViewportChange$: ReplaySubject<number>;
  private _positionY: number = 0;
  private _scrollConfig: ScrollConfig;

  private onScroll$: Observable<any>;
  private onResize$: Observable<any>;

  private scrollSub: Subscription;
  private resizeSub: Subscription;
  private viewportChangeSub: Subscription;  

  constructor(@Inject("scrollConfig") sc: ScrollConfig) {

    this._scrollConfig = sc ? sc : new ScrollConfig(100);

    this.manageScrollPos();

    this._windowScroll$ = new ReplaySubject();
    this._windowResize$ = new ReplaySubject();
    this._windowViewportChange$ = new ReplaySubject();

    this.onScroll$ =
      typeof window !== "undefined" ? fromEvent(window, "scroll") : EMPTY;
    this.scrollSub = this.onScroll$
      .pipe(
        debounceTime(this.scrollConfig.debounce),
        distinctUntilChanged())
      .subscribe(t => {
        this.manageScrollPos();
        this._windowScroll$.next(this._positionY);
      });

    this.onResize$ =
      typeof window !== "undefined" ? fromEvent(window, "resize") : EMPTY;
    this.resizeSub = this.onResize$
      .pipe(
        debounceTime(this.scrollConfig.debounce),
        distinctUntilChanged())
      .subscribe(t => {
        this.manageScrollPos();
        this._windowResize$.next(this._positionY);
      });

    this.viewportChangeSub = merge(this._windowScroll$, this._windowResize$)
      .subscribe(t => {
        this._windowViewportChange$.next(this._positionY);
      });
  }

  get positionY() {
    return this._positionY;
  }

  get scrollConfig() {
    return this._scrollConfig;
  }

  get windowScroll$() {
    return this._windowScroll$;
  }

  get windowResize$() {
    return this._windowResize$;
  }

  get windowViewportChange$() {    
    return this._windowViewportChange$;
  }

  private manageScrollPos(): void {
    this._positionY = typeof window !== "undefined" ? window.pageYOffset : 0;
  }

  scrollToPositionYSmooth(top: number) {
    window.scrollTo({ top: top, left: 0, behavior: "smooth" });
  }

  scrollToPositionY(top: number) {
    window.scrollTo({ top: top, left: 0, behavior: "auto" });
  }

  ngOnDestroy(): void {
    this.scrollSub.unsubscribe();
    this.resizeSub.unsubscribe();
    this.viewportChangeSub.unsubscribe();
  }
}

export class ScrollConfig {
  private _debounce: number;

  constructor(debounce: number) {
    this._debounce = debounce;
  }

  get debounce() {
    return this._debounce;
  }
}
