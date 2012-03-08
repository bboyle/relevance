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
