[![Build Status](https://travis-ci.org/bboyle/relevance.svg?branch=travis)](https://travis-ci.org/bboyle/relevance)
[![devDependencies](https://david-dm.org/bboyle/relevance/dev-status.svg)](https://david-dm.org/bboyle/relevance#info=devDependencies)

## Progressive disclosure

Only show what is relevant, making the interface simpler for the user.
Simply put, you may consider a *relevant* element to be *visible* (“perceivable” as [they say in WCAG][WCAG-P1]), whilst *irrelevant* elements are *hidden*.

[WCAG-P1]: http://www.w3.org/TR/WCAG/#perceivable "Principle 1: Perceivable - Information and user interface components must be presentable to users in ways they can perceive."

### Accessibility

As noted in the HTML5 spec, do not flag elements as irrelevant if you want to temporarily hide them (e.g. tabbed interfaces).
Use `.hide()` from jquery core in those situations. Use this library when elements are irrelevant.
Tabbed interfaces still use *progressive disclosure* techniques, but **should not** use this script.

## Related concepts

* `relevant`, XForms
* `@hidden`, html5
* `@aria-hidden`, ARIA

# API

## .relevance( 'relevant', true )

indicates an element should be made relevant (shown). No change for relevant elements, irrelevant elements will trigger a `relevant` event.

## .relevance( 'relevant', false )

indicates an element should be made irrelevant (hidden). No change for irrelevant elements, relevant elements will trigger an `irrelevant` event.

## .relevance( 'show' )

1. enables descendent form elements and self
2. removes `@hidden` attribute
3. removes `aria-hidden`
4. shows the element (uses a `slideDown` transition)

## .relevance( 'hide' )

1. hides element (no animation, hiding is immediate)
2. disables descendent form fields and self (if a form field)
3. adds `@hidden` attribute
4. adds `aria-hidden`

## Events

| Event name | Fired when                                                        | If you cancel it…                                  |
|:-----------|:------------------------------------------------------------------|:---------------------------------------------------|
| relevant   | an element that is hidden has become relevant and will be shown   | the element will remain irrelevant and stay hidden |
| irrelevant | an element that is shown has become irrelevant and will be hidden | the element will remain relevant and be visible    |

You can suppress the `relevant` and `irrelevant` events and cancel them to prevent an elements relevance state from changing.
You will need to cancel the event before it reaches the `document` (this is where the default handlers are bound).

## Browser support notes

### Hiding elements when not relevant

Elements are hidden by toggling the HTML5 `hidden` attribute. Modern browsers support this element. You can provide support in older browsers by using:

```css
[hidden] {
    display: none;
}
```

Hopefully you're beyond needing IE6 support, but just in case:

```css
* {
    _display: expression(this.hidden?'none':'inherit');
}
```

However, the script will check whether 'hidden' elements are visible. If they are, it will use the jQuery `.toggle()` method to control relevance. This results in the style `display` being change to `none` when elements are not relevant.

You can override `hidden` in modern browsers to implement CSS transitions. For example:

```css
body {
    line-height: 1.3;
}
li {
    transition: all 0.3s ease;
}
li[hidden] {
    max-height: 0;
    line-height: 0;
    opacity: 0;
    overflow: hidden;
}
```

### Toggling relevance with `select`

Make sure your `option` elements have a `value` attribute to support older browsers. The relevance script relies on reading the `.value` property of the `select` element. Old browsers do not provide this property unless it is also specified on the `option` elements.

Use this format:

```html
<select id="colour-space" name="colourSpace">
    <option value="RGB">RGB</option>
    <option value="CMYK">CMYK</option>
</select>
```

This format (missing `value`) fails in old browsers:

```html
<select id="colour-space" name="colourSpace">
    <option>RGB</option>
    <option>CMYK</option>
</select>
```
