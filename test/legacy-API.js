(function( $ ) {
	'use strict';
	

	module( 'legacy API' );

	test( 'can use .forcesRelevance()', function() {

		strictEqual( $.fn.forcesRelevance, $.fn.relevance, '.forcesRelevance === .relevance' );

	});


}( jQuery ));
