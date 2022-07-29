import { Component } from '@angular/core';
import { IntersectionObserverEvent } from '../../projects/intersection-observer/src/lib/intersection-observer-event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-intersection-observer';

  intersect(event: IntersectionObserverEvent) {
    console.log(event.intersect);
  }
}
