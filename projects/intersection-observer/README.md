# ngx-intersection-observer

 Observe visiblity of elements and get notified when they enter/leave the window viewport.

 ## Features
 - Observe elements via IntersectionObserver API or fallback to scroll listener to detect if the element enters/leaves the viewport.
 - Apply classes when the element enters the viewport.
 - Specify which classes should be keept when entering/leaving the viewport.
 - Specify threshold, how many precentage of the element need to be visible to trigger intersection.
 - Specify intersection method (IntersectionObserver API or scroll listener)
 - Event binding for intersecting elements. 

 ## Dependencies

 ---

 ngx-intersection-observer | Angular
 ---                       | ---
 1.0.7                     | 14.x

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
  //...
  imports: [
    //...
    IntersectionObserverModule.forRoot()
  ],
  //...
})
export class AppModule { }
```

## Usage and Options

---

Name          | Type       | Options                                                                                                                                                  | Optional
---           | ---        | ---                                                                                                                                                      | ---
applyClass    | `String`   | List of classes to apply when the element gets visible within the viewport. Those classes will be removed when the element leaves the viewport.          | Yes
keepClass     | `String`   | List of classes to keep when the element leaves the viewport and enters it again.                                                                        | Yes
useScroll     | `Boolean`  | `true / false` If `true`, use scoll listener otherwhise use IntersectionObserver. By default IntersectionBehavior is used, fallback to scroll listener.  | Yes
threshold     | `Number`   | Specifies how many precentage of the element need to be visible in the viewport to treat it as intersection. Specify a value between 0% and 100%         | Yes
intersection  | `Event`    | Function which is called when the element enters/leaves the viewport.                                                                                     | Yes

**Example**
```html
<div intersectionObserver
     [applyClass]="'bg-blue border'"
     [keepClass]="'border'"
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

If you want to apply animations from animate.style, i recomment to use the following css class on your element to prevent flickering.
```css
.hide-on-init {
  visibility: hidden;
}
```

**Example**
```html
<div intersectionObserver
     [applyClass]="'bg-blue border'"
     [keepClass]="'border'"
     [threshold]="30"
     [useScroll]="false"     
     (intersection)="intersect($event)"
     class="bg-red hide-on-init"
     id="my-div"></div>
</div>
```

Ive build my portfolio website <https://www.t-schiebel.de> with this library, you can check it out in order to see it in action. It uses animate.css for all the animations. The animate.css classes get applied when the element visits the viewport.

## License

---

MIT

---

> GitHub [@tobiasschiebel](https://github.com/tobiasschiebel) &nbsp;&middot;&nbsp;



