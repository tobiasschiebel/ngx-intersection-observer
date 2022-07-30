import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IntersectionObserverConfig } from '../../projects/intersection-observer/src/lib/intersection-observer-config.model';
import { IntersectionObserverModule } from '../../projects/intersection-observer/src/lib/intersection-observer.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IntersectionObserverModule.forRoot({
      debounce: 50,
      threshold: 30,
      autoRemove: true
    } as IntersectionObserverConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
