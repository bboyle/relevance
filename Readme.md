## Progressive disclosure

Only show what is relevant, making the interface simpler for the user.
Simply put, you may consider a *relevant* element to be *visible*, whilst *irrelevant* elements are *hidden*.

### Accessibility

As noted in the HTML5 spec, do not flag elements as irrelevant if you want to temporarily hide them (e.g. tabbed interfaces).
Use `.hide()` from jquery core in those situations. Use this library when elements are irrelevant.
Tabbed interfaces still use *progressive disclosure* techniques, but **should not** use this script.

## Related concepts

* `relevant`, XForms
* `@hidden`, html5
* `@aria-hidden`, ARIA

# API

* `.forcesRelevance( 'relevant', true )` indicates an element should be made relevant (shown). No change for relevant elements, irrelevant elements will trigger a `relevant` event.
* `.forcesRelevance( 'relevant', false )` indicates an element should be made irrelevant (hidden). No change for irrelevant elements, relevant elements will trigger an `irrelevant` event.
* `.forcesRelevance( 'show' )`
  * enables descendent form elements
  * removes `aria-hidden`
  * removes `@hidden` attribute
  * shows the element
  * fires event `relevant-done`
* `.forcesRelevance( 'hide' )`
  * hides element
  * disables descendent form fields
  * adds `@hidden` attribute
  * adds `aria-hidden`
  * fires event `irrelevant-done`

## Events

If you catch and cancel the `relevant` or `irrelevant` event, nothing will happen.
Events bubble, so you may wish to catch them on a wrapper object.

As showing/hiding content can affect some layouts, you may wish to listen for the `relevant-done` and `irrelevant-done` events and then recalculate the layout. These events fire after show/hide animations are complete.
