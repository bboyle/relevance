/*
	jquery forces relevance plugin

	jquery.forcesForms( "relevant", true|false ) -- get label element
	requires jquery

*/

if ( jQuery !== 'undefined' ) {
(function( $ ) {
	'use strict';

	var i = 0,

	methods = {

		// $( x ).forcesRelevance( "relevant" )
		// if the element is hidden, fire a "relevant" event
		relevant : function( makeRelevant ) {
			if ( !! makeRelevant ) {
				this.filter( ':hidden' ).trigger( 'relevant' );
			} else {
				this.filter( ':visible' ).trigger( 'irrelevant' );
			}
			return this;
		}

	};


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


}( jQuery ));
}
