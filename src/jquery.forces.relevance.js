/*
	jquery forces relevance plugin

	jquery.forcesForms( "relevant", true|false ) -- get label element
	requires jquery

*/

if ( jQuery !== 'undefined' ) {
(function( $, window ) {
	'use strict';

	var relevantEvent = $.Event( 'relevant' ),
		irrelevantEvent = $.Event( 'irrelevant' ),

	methods = {

		// $( x ).forcesRelevance( "relevant", true )
		// if the element is hidden, fire a "relevant" event
		// $( x ).forcesRelevance( "relevant", false )
		// if the element is visible, fire an "irrelevant" event
		relevant : function( makeRelevant ) {
			if ( ! makeRelevant ) {
				this.filter( ':visible' ).trigger( irrelevantEvent );
			} else {
				this.filter( ':hidden' ).trigger( relevantEvent );
			}
			return this;
		}

	};


	// fallback (default) event handling
	$( window.document ).bind( 'relevant irrelevant', function( event ) {
		var target = $( event.target );
		if ( event.type === 'relevant' ) {
			target.show( 0 );
		} else {
			target.hide( 0 );
		}
	});


	$.fn.forcesRelevance = function( method ) {

		// Method calling logic
		// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.forcesRelevance' );
		}

	};


}( jQuery, window ));
}
