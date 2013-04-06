(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', function() {

		strictEqual( $( '#foo' ).length, 1, '#foo exists' );
		strictEqual( $( '#bar' ).length, 1, '#bar exists' );
		strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is visible' );
		strictEqual( $( '#bar' ).is( ':hidden' ), true, '#bar is hidden' );

	});


	module( 'visibility' );

	test( 'elements are visible after show', 4, function() {

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is visible' );
		strictEqual( $( '#bar' ).is( ':visible' ), true, '#bar is visible' );

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is still visible' );
		strictEqual( $( '#bar' ).is( ':visible' ), true, '#bar is still visible' );

	});

	test( 'elements are hidden after hide', 4, function() {

		$( '#foo, #bar' ).forcesRelevance( 'hide' );
		strictEqual( $( '#foo' ).is( ':hidden' ), true, '#foo is hidden' );
		strictEqual( $( '#bar' ).is( ':hidden' ), true, '#bar is hidden' );

		$( '#foo, #bar' ).forcesRelevance( 'hide' );
		strictEqual( $( '#foo' ).is( ':hidden' ), true, '#foo is still hidden' );
		strictEqual( $( '#bar' ).is( ':hidden' ), true, '#bar is still hidden' );
	});


	module( 'accessibility' );

	test( 'aria hidden state is flagged', 6, function() {

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' )[0].getAttribute( 'aria-hidden' ), null, '#foo is not aria-hidden' );
		strictEqual( $( '#bar' )[0].getAttribute( 'aria-hidden' ), null, '#bar is not aria-hidden' );

		$( '#foo, #bar' ).forcesRelevance( 'hide' );
		strictEqual( $( '#foo' ).attr( 'aria-hidden' ), 'true', '#foo is aria-hidden after hide()' );
		strictEqual( $( '#bar' ).attr( 'aria-hidden' ), 'true', '#bar is aria-hidden after hide()' );

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' )[0].getAttribute( 'aria-hidden' ), null, '#foo is not aria-hidden after show()' );
		strictEqual( $( '#bar' )[0].getAttribute( 'aria-hidden' ), null, '#bar is not aria-hidden after show()' );

	});

	test( 'html5 @hidden state is flagged', 6, function() {

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' )[0].getAttribute( 'hidden' ), null, '#foo is not hidden' );
		strictEqual( $( '#bar' )[0].getAttribute( 'hidden' ), null, '#bar is not hidden' );

		$( '#foo, #bar' ).forcesRelevance( 'hide' );
		// in html5 browsers, the value will be true
		// in older browsers, the value will be 'hidden'
		// just ensure it is not null
		notStrictEqual( $( '#foo' )[0].getAttribute( 'hidden' ), null, '#foo is @hidden after hide()' );
		notStrictEqual( $( '#bar' )[0].getAttribute( 'hidden' ), null, '#bar is @hidden after hide()' );

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		strictEqual( $( '#foo' )[0].getAttribute( 'hidden' ), null, '#foo is not hidden after show()' );
		strictEqual( $( '#bar' )[0].getAttribute( 'hidden' ), null, '#bar is not hidden after show()' );

	});


	module( 'interoperability' );

	test( 'input fields are disabled when irrelevant', 6, function() {

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		// IE6 returns 'false', FF7 returns 'null'
		ok( ! $( '#foo' )[0].getAttribute( 'disabled' ), '#foo is not disabled' );
		ok( ! $( '#bar' )[0].getAttribute( 'disabled' ), '#bar is not disabled' );

		$( '#foo, #bar' ).forcesRelevance( 'hide' );
		// @disabled is true when set
		strictEqual( $( '#foo' ).prop( 'disabled' ), true, '#foo is @disabled after hide()' );
		strictEqual( $( '#bar' ).prop( 'disabled' ), true, '#bar is @disabled after hide()' );

		$( '#foo, #bar' ).forcesRelevance( 'show' );
		ok( ! $( '#foo' )[0].getAttribute( 'disabled' ), '#foo is not disabled after show()' );
		ok( ! $( '#bar' )[0].getAttribute( 'disabled' ), '#bar is not disabled after show()' );

	});


}( jQuery ));
