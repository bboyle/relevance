/*
	jquery forces relevance plugin

	jquery.forcesForms( "relevant", true|false ) -- get label element
	requires jquery

*/

if ( jQuery !== 'undefined' ) {
(function( $ ) {
	'use strict';

	var relevantEvent = 'relevant',
		irrelevantEvent = 'irrelevant',
		relevantDoneEvent = 'relevant-done',
		irrelevantDoneEvent = 'irrelevant-done',
		elementsToDisable = 'button, input, select, textarea',

		recalculateRelevance = function() {
			var $this = $( this ),
				question = $this.closest( '.questions > li' ),
				value = $this.val(),
				// TODO how to find dependency map without assuming .questions > li?
				dependencyMap = question.data( 'forces-relevance' )
			;

			// checkbox, test if it was checked or unchecked
			if ( /^checkbox$/i.test( this.type )) {
				if ( ! this.checked ) {
					value = null;
				}
			}

			$.each( dependencyMap, function( index, element ) {
				element.question.forcesRelevance( 'relevant', ( element.value === value ) === element.bool );
			});
		},


	methods = {

		// $( x ).forcesRelevance( 'relevant', true )
		// if the element is hidden, fire a 'relevant' event
		// $( x ).forcesRelevance( 'relevant', false )
		// if the element is visible, fire an "irrelevant" event
		relevant: function( makeRelevant ) {
			if ( ! makeRelevant ) {
				this.filter( ':visible' ).trigger( irrelevantEvent );
			} else {
				this.filter( ':hidden' ).trigger( relevantEvent );
			}
			return this;
		},

		// $( x ).forcesRelevance( 'show' )
		// shows the element (does not check if element is already visible)
		// triggers 'relevant-done' after showing is complete
		show: function() {

			// enable elements before they are shown
			this.add( this.find( elementsToDisable )).each(function() {
				this.removeAttribute( 'disabled' );
			});

			// stop animation, remove @hidden and @aria-hidden, start showing
			return this.stop( true, true ).removeAttr( 'hidden' ).removeAttr( 'aria-hidden' ).slideDown(function() {
				// done
				$( this ).trigger( relevantDoneEvent );
			});
		},

		// $( x ).forcesRelevance( 'hide' )
		// hides the element (does not check if element is already hidden)
		// triggers 'irrelevant-done' after hiding is complete
		hide: function() {

			// stop animation, start hiding
			return this.stop( true, true ).hide( 0, function() {
				var $this = $( this );
	
				// disable elements (including self if appropriate)
				$this.filter( elementsToDisable ).add( $this.find( elementsToDisable )).each(function() {
					this.setAttribute( 'disabled', 'disabled' );
				});

				// once hidden, toggle irrelevant with @hidden and aria-hidden
				this.setAttribute( 'hidden', 'hidden' );
				this.setAttribute( 'aria-hidden', 'true' );

				// done
				$this.trigger( irrelevantDoneEvent );
			});
		},

		// $( x ).forcesRelevance( 'instructions', options )
		// sets up relevance handling based on text instructions
		instructions: function( options ) {

			this.find( '.relevance' ).each(function() {
				var $this = $( this ),
					value = $this.text().replace( /^[\S\s]*chose \W([\w\s]+)\W above[\S\s]*$/, '$1' ),
					question = $this.closest( 'li' ),
					toggle = question.prev( 'li' ).eq( 0 ),
					bool = true,
					dependencyMap
				;

				// by default, we assume:
				// 'this' is an instruction within a question/section represented by .closest( 'li' )
				// the previous question (li, it should NOT be nested in a previous section) value must match the value in the instruction
				// the toggle question is radio buttons, a checkbox or a select list

				// pattern: (If different to <PREVIOUS QUESTION>)
				if ( /If different to/.test( value )) {
					value = toggle.find( ':checkbox' ).val();
					bool = false;
				}

				// we could write a function for this relevance rule, but we would be writing multiple functions for the same question
				// is that too inefficient? probably. we should not keep adding event handlers.
				// need to store a dependency map.
				// when values change, check their dependency map.
				dependencyMap = toggle.data( 'forces-relevance' );
				if ( typeof dependencyMap !== 'object' ) {
					dependencyMap = [];
					toggle.data( 'forces-relevance', dependencyMap );

					// setup relevance handler
					$( 'input', toggle ).bind( 'click', recalculateRelevance );
					$( 'select', toggle ).bind( 'change', recalculateRelevance );
				}

				// push this item onto the map
				dependencyMap.push({
					question : question,
					value : value,
					bool : bool
				});

				// initial relevance
				question.forcesRelevance( 'relevant', ( toggle.find( 'input' ).filter( ':checked' ).val() === value ) === bool );
			});

			return this;
		}

	};


	// fallback (default) event handling
	$( document ).bind( 'relevant irrelevant', function( event ) {
		var target = $( event.target );
		if ( event.type === 'relevant' ) {
			target.forcesRelevance( 'show' );
		} else {
			target.forcesRelevance( 'hide' );
		}
	});


	$.fn.forcesRelevance = function( method ) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			// return methods.init.apply( this, arguments );
			return this;
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.forcesRelevance' );
		}

	};


}( jQuery ));
}
