(function( $ ) {
	'use strict';
	

	module( 'legacy API' );

	test( 'can use .forcesRelevance()', function() {

		strictEqual( $.fn.forcesRelevance, $.fn.relevance, '.forcesRelevance === .relevance' );

	});


	module( 'chaining' );

	test( 'null', 2, function() {

		$( '#foo, #bar' ).forcesRelevance().attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});

	test( 'relevant', 2, function() {

		$( '#foo, #bar' ).forcesRelevance( 'relevant', true ).attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});

	test( 'show', 2, function() {

		$( '#foo, #bar' ).forcesRelevance( 'show' ).attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});

	test( 'hide', 2, function() {

		$( '#foo, #bar' ).forcesRelevance( 'hide' ).attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});

	test( 'instructions', 2, function() {

		$( '#foo, #bar' ).forcesRelevance( 'instructions' ).attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});

	test( 'relevantWhen', 2, function() {

		$( '#foo, #bar' ).forcesRelevance( 'relevantWhen', {} ).attr( 'title', 'foo' );
		strictEqual( $( '#foo' ).attr( 'title' ), 'foo', '#foo was chained' );
		strictEqual( $( '#bar' ).attr( 'title' ), 'foo', '#bar was chained' );

	});


	module( 'default behaviour' );

	test( 'toggle relevance', 8, function() {

		$( '#foo' )
		.bind( 'irrelevant-done', function() {
			// start qunit
			start();

			strictEqual( $( '#foo' ).is( ':hidden' ), true, '#foo is hidden' );
			strictEqual( $( '#foo' ).attr( 'aria-hidden' ), 'true', '#foo is aria-hidden when irrelevant' );
			ok( $( '#foo' )[ 0 ].getAttribute( 'hidden' ), '#foo is @hidden when irrelevant' );
			strictEqual( $( '#foo' )[ 0 ].disabled, true, '#foo is @disabled when irrelevant' );

		})
		.bind( 'relevant-done', function() {
			// start qunit
			start();

			strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is visible' );
			strictEqual( $( '#foo' )[ 0 ].getAttribute( 'aria-hidden' ), null, '#foo is not aria-hidden' );
			strictEqual( $( '#foo' )[ 0 ].getAttribute( 'hidden' ), null, '#foo is not hidden' );
			ok( ! $( '#foo' )[ 0 ].getAttribute( 'disabled' ), '#foo is not disabled' );

		});

		// stop qunit (until event triggers)
		stop();
		// make foo irrelevant
		$( '#foo' ).forcesRelevance( 'relevant', false );

		// stop qunit (until event triggers)
		stop();
		// make foo relevant
		$( '#foo' ).forcesRelevance( 'relevant', true );

	});


}( jQuery ));
