import { ModuleWithProviders, NgModule } from '@angular/core';
import { IntersectionObserverConfig } from './intersection-observer-config.model';
import { IntersectionObserverDirective } from './intersection-observer.directive';
import { IntersectionObserverService } from './intersection-observer.service';

@NgModule({
  declarations: [
    IntersectionObserverDirective
  ],
  imports: [
  ],
  exports: [
    IntersectionObserverDirective
  ]
})
export class IntersectionObserverModule {
  static forRoot(config?: IntersectionObserverConfig): ModuleWithProviders<IntersectionObserverModule> {
    return {
      ngModule: IntersectionObserverModule,
      providers: [
        { provide: IntersectionObserverConfig, useValue: config ? config : { debounce: 10 } as IntersectionObserverConfig },
        IntersectionObserverService
      ]
    };
  }
}
