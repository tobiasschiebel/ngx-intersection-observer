# ngx-intersection-observer

 Observe visiblity of elements and get notified when they visit/leave the window viewport.

 ## Features
 - Observe elements via IntersectionObserver API or fallback to scroll listener to detect if the element enters/leaves the viewport.
 - Apply or remove classes based on element visiblity
 - Specify threshold, how many precentage of the element need to be visible to trigger intersection.
 - Specify intersection method (IntersectionObserver API or scroll listener)
 - Event binding for intersecting elements.

 ## Dependencies

 ---

 ngx-intersection-observer | Angular
 ---                       | ---
 1.0.13                    | >=13.x

 ## Install

 ---

 Install the package via NPM
 ```shell
 $ npm install --save  ngx-intersection-observer
 ```
 
Import the module
Import the module to your angular application
```typescript
//...
import { IntersectionObserverModule } from 'ngx-intersection-observer';

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
```

## Usage and Options

---

Name             | Type       | Description                                                                                                                                                  | Optional | Default
---              | ---        | ---                                                                                                                                                      | --- | ---
visitClass       | `String`   | List of classes to apply, when the element visits the windows viewport.        | Yes
leaveClass       | `String`   | List of classes to apply, when the element leaves the window viewport.                                                                  | Yes
removeVisitClass | `String`   | List of classes to remove, when the element visits the window viewport.
removeLeaveClass | `String`   | List of classes to remove, when the element leaves the windows viewport. | Yes
autoRemove       | `Boolean`  | `true / false` If `true` classes will be removed automatically when the element leaves the viewport, otherwhise use removeVisitClass property. | Yes | true
useScroll        | `Boolean`  | `true / false` If `true`, use scoll listener otherwhise use IntersectionObserver. By default IntersectionBehavior is used, fallback to scroll listener.  | Yes | true
threshold        | `Number`   | Specifies how many precentage of the element need to be visible in the viewport to treat it as intersection. Specify a value between 0% and 100%         | Yes | 30%
intersection     | `Event`    | Function which is called when the element enters/leaves the viewport.                                                                                     | Yes

**Example**
```html
<div intersectionObserver
     [visitClass]="'bg-blue border'"
     [autoRemove]="true"
     [threshold]="30"
     [useScroll]="false"     
     (intersection)="intersect($event)"
     class="bg-red"
     id="my-div"></div>
</div>
```

```css
#my-div {
  width: 300px;
  height: 300px;
  margin-top: 2000px;
}

.bg-red {
  background-color: red;
}

.bg-blue{
    background-color: blue;
}

.border{
    border: 5px solid black;
```

## Use with animate.css 

---

Animate.css is a library of ready-to-use, cross-browser animations for use in your web projects. Great for emphasis, home pages, sliders, and attention-guiding hints. <https://animate.style/>

If you want to apply animations from animate.style, use those two classes to prevent flickering.
```css
.hide-on-init {
  visibility: hidden;
}

.animate__animated {
  visibility: visible !important;
}
```
**Example**
```html
<div intersectionObserver
     [visitClass]="'bg-blue border'"
     [autoRemove]="true"
     [threshold]="30"
     [useScroll]="false"     
     (intersection)="intersect($event)"
     class="bg-red hide-on-init"
     id="my-div"></div>
</div>
```

## License

---

MIT

---

> GitHub [@tobiasschiebel](https://github.com/tobiasschiebel) | Twitter [@SchiebelTobias](https://twitter.com/SchiebelTobias)



