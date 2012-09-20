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
		// config
		selectors = {
			// instruction-based relevance
			instructionSelector: '.relevance',
			questionSelector: '.questions > li'
		},

		answerMap = function( element ) {
			return element.value;
		},

		recalculateRelevance = function() {
			var $this = $( this ),
				values,
				question = $this.closest( selectors.questionSelector ),
				dependencyMap = question.data( 'forces-relevance' )
			;

			// bail out if not setup
			if ( ! dependencyMap || dependencyMap.length < 1 ) {
				return;
			}

			// checkbox, test if it was checked or unchecked
			if ( /^checkbox$/i.test( this.type )) {
				values = $.map( $( this.form.elements[ this.name ] ).filter( ':checked' ), function( element ) {
					return element.value;
				});
			} else {
				values = $this.val() || $this.find( 'select' ).val();
				if ( values === undefined ) {
					values = $.map( $this.find( 'input' ).filter( ':checked' ), answerMap );
				} else {
					values = [ values ];
				}
			}

			$.each( dependencyMap, function( index, element ) {
				element.question.forcesRelevance( 'relevant', ( $.inArray( element.value, values ) >= 0 ) === element.bool );
			});
		},


	methods = {

		// $( x ).forcesRelevance( 'relevant', true )
		// if the element is hidden, fire a 'relevant' event
		// $( x ).forcesRelevance( 'relevant', false )
		// if the element is visible, fire an "irrelevant" event
		relevant: function( makeRelevant ) {
			if ( ! makeRelevant ) {
				this.filter( ':visible' ).trigger( irrelevantEvent ).each(function() {
					var dependencyMap = $( this ).data( 'forces-relevance' );
					// hide any dependent elements
					if ( dependencyMap && dependencyMap.length > 0 ) {
						$.each( dependencyMap, function( index, element ) {
							element.question.forcesRelevance( 'relevant', false );
						});
					}
				});
			} else {
				this.filter( ':hidden' ).trigger( relevantEvent ).each(function() {
					// recalculate relevance for dependencies
					recalculateRelevance.call( this );
				});
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

		// $( x ).forcesRelevance( 'relevantWhen', { name: radio/checkbox/select, value: requiredValue })
		// sets up dependent relevance
		// example: $( '#red' ).forcesRelevance( 'relevantWhen', { name: 'rgb', value: 'red' })
		// #red will be shown/hidden when '@name=rgb' value changes.
		relevantWhen: function( nameValue ) {
			return this;
		},

		// $( x ).forcesRelevance( 'instructions', options )
		// sets up relevance handling based on text instructions
		// options ::= { instructions: '.relevance', questions: '.questions > li' }
		instructions: function( options ) {
			$.extend( selectors, options );

			this.find( selectors.instructionSelector ).each(function() {
				var $this = $( this ),
					value = $this.text().replace( /^[\S\s]*chose \W([\w\s]+)\W above[\S\s]*$/, '$1' ),
					question = $this.closest( selectors.questionSelector ),
					toggle = question.prevAll( selectors.questionSelector ),
					i, answers,
					bool = true,
					dependencyMap
				;

				// pattern: (If different to <PREVIOUS QUESTION>)
				if ( /If different to/.test( value )) {
					// assume previous 'li' is the toggle
					toggle = toggle.eq( 0 );
					value = toggle.find( ':checkbox' ).val();
					bool = false;
				} else {
					// which of the previous questions is the toggle?
					i = 0;
					while ( i < toggle.length ) {
						// skip sections
						if ( ! toggle.eq( i ).is( '.section' )) {
							// does this item have the answer we need?
							answers = $.map( toggle.eq( i ).find( 'option,:radio,:checkbox' ), answerMap );
							if ( $.inArray( value, answers ) >= 0 ) {
								toggle = toggle.eq( i );
							}
						}
						i++;
					}
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
				answers = $.map( toggle.find( 'select,:checked' ), answerMap );
				question.forcesRelevance( 'relevant', toggle.is( ':visible' ) && ( $.inArray( value, answers ) >= 0 ) === bool );
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
