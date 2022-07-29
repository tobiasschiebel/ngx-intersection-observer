import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IntersectionObserverModule } from '../../projects/intersection-observer/src/lib/intersection-observer.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IntersectionObserverModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
