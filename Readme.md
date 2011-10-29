## Progressive disclosure

Only show what is relevant, making the interface simpler for the user.
Simply put, you may consider a *relevant* element to be *visible*, whilst *irrelevant* elements are *hidden*.

## Related concepts

* `relevant`, XForms
* `@hidden`, html5
* `@aria-hidden`, ARIA

# API

* `.forcesRelevance( 'relevant', true )` indicates an element should be made relevant (shown). No change for relevant elements, irrelevant elements will trigger a `relevant` event.
* `.forcesRelevance( 'relevant', false )` indicates an element should be made irrelevant (hidden). No change for irrelevant elements, relevant elements will trigger an `irrelevant` event.
* `.forcesRelevance( 'makeRelevant' )`
** enables descendent form elements
** removes `aria-hidden`
** removes `@hidden` attribute
** shows the element
** fires event `relevant-done`
* `.forcesRelevance( 'makeIrrelevant' )`
** hides element
** disables descendent form fields
** adds `@hidden` attribute
** adds `aria-hidden`

## Events

If you catch and cancel the `relevant` or `irrelevant` event, nothing will happen.
Events bubbles, so you may wish to catch them on a wrapper object.

