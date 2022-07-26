# ngx-intersection-observer

 Observe elements and get notified when they show up in the viewport.

 ## Features
 - Observe elements via IntersectionObserver API or fallback to scroll listener
 - Threshold, how many precentage of the element need to be visible to trigger intersection
 - Apply classes when element is in viewport
 - Event binding for intersection 

 ## Install

 ```shell
 $ npm install --save  ngx-intersection-observer
 ```
 
**Import the module**
```typescript
//...
import { NgxViewportModule } from 'ngx-viewport';
@NgModule({
  //...
  imports: [
    //...
    NgxViewportModule
  ],
  //...
})
export class AppModule { }
```

# Usage and Options

Name      | Type               | Options                                   | Optional
---       | ---                | ---                                       | ---
classes   | `String`           | Classes to apply on intersection          | Yes
threshold | `Number`           | Precentage how many of the element needs to be visible to trigger intersection  | Yes
useScroll | `Boolean`          | `true / false` If `true`, use scoll listener otherwhise use IntersectionObserver. By default IntersectionBehavior is used, fallback to scroll listener                     | Yes
intersecting | `Event`           | Function to call on intersection | Yes

**Example**

```html
<div appViewport
     classes="animate animate_pulse"
     [threshold]="0.3"
     [useScroll="false"]
     (intersecting)="someAction()">
</div>
````
