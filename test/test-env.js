(function( $ ) {
	'use strict';


	module( 'environment' );

	test( 'test fields are in test form', function() {

		strictEqual( $( '#foo' ).length, 1, '#foo exists' );
		strictEqual( $( '#bar' ).length, 1, '#bar exists' );
		strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is visible' );
		strictEqual( $( '#bar' ).is( ':hidden' ), true, '#bar is hidden' );

	});


}( jQuery ));
