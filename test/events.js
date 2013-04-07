(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test fields are in test form', function() {

		strictEqual( $( '#foo' ).length, 1, '#foo exists' );
		strictEqual( $( '#bar' ).length, 1, '#bar exists' );
		strictEqual( $( '#foo' ).is( ':visible' ), true, '#foo is visible' );
		strictEqual( $( '#bar' ).is( ':hidden' ), true, '#bar is hidden' );

	});


	module( 'relevant events' );

	test( 'relevant event is triggered for hidden elements', 1, function() {

		var eventDetected = 0;
		
		$( '#bar' ).bind( 'relevant', function() {
			eventDetected += 1;
			strictEqual( eventDetected, 1, 'relevant event detected' );
		});

		$( '#bar' ).relevance( 'relevant', true );
		// should not fire event now element is relevant
		$( '#bar' ).relevance( 'relevant', true );

	});


	test( 'relevant event not triggered for visible elements', 0, function() {
		
		$( '#foo' ).bind( 'relevant', function() {
			ok( false, 'relevant event detected' );
		});

		$( '#foo' ).relevance( 'relevant', true );

	});

	test( 'relevant event bubbles', 3, function() {

		$( '#bar' ).parent().bind( 'relevant', function() {
			ok( true, 'relevant event detected on #bar parent with .bind()' );
		});
		$( 'body' ).bind( 'relevant', function() {
			ok( true, 'relevant event detected with body.bind()' );
		});
		$( document ).bind( 'relevant', function() {
			ok( true, 'relevant event detected with document.bind()' );
		});

		$( '#bar' ).relevance( 'relevant', true );

		$( '#foo, body' ).unbind( 'relevant.test' );
		$( document ).unbind( 'relevant.test' );

	});


	module( 'irrelevant events' );

	test( 'irrelevant event is triggered for visible elements', 1, function() {
		
		var eventDetected = 0;

		$( '#foo' ).bind( 'irrelevant', function() {
			eventDetected += 1;
			strictEqual( eventDetected, 1, 'irrelevant event detected' );
		});

		$( '#foo' ).relevance( 'relevant', false );
		// should not fire event now element is irrelevant
		$( '#foo' ).relevance( 'relevant', false );

	});

	test( 'irrelevant event not triggered for hidden elements', 0, function() {
		
		$( '#bar' ).bind( 'irrelevant', function() {
			ok( true, 'irrelevant event detected' );
		});

		$( '#bar' ).relevance( 'relevant', false );

	});

	test( 'irrelevant event bubbles', 3, function() {

		$( '#foo' ).parent().bind( 'irrelevant.test', function() {
			ok( true, 'irrelevant event detected on #foo parent' );
		});

		$( 'body' ).bind( 'irrelevant.test', function() {
			ok( true, 'irrelevant event detected with body.bind()' );
		});

		$( document ).bind( 'irrelevant.test', function() {
			ok( true, 'irrelevant event detected with document.bind()' );
		});

		$( '#foo' ).relevance( 'relevant', false );

		$( '#foo, body' ).unbind( 'irrelevant.test' );
		$( document ).unbind( 'irrelevant.test' );

	});


	module( 'relevant-done events' );

	test( 'relevant-done event is triggered after showing an element', 4, function() {

		var eventDetectedOnBar = 0,
			eventDetectedOnFoo = 0;
		
		$( '#bar' ).bind( 'relevant-done', function() {
			eventDetectedOnBar++;
			ok( eventDetectedOnBar <= 2, 'relevant-done event detected on #bar' );
		});

		$( '#foo' ).bind( 'relevant-done', function() {
			eventDetectedOnFoo++;
			ok( eventDetectedOnFoo <= 2, 'relevant-done event detected on #foo' );
		});

		$( '#foo, #bar' ).relevance( 'show' );
		// should still fire, even though elements are now relevant
		$( '#foo, #bar' ).relevance( 'show' );

	});


	module( 'irrelevant-done events' );

	test( 'irrelevant-done event is triggered after showing an element', 4, function() {

		var eventDetectedOnBar = 0,
			eventDetectedOnFoo = 0;
		
		$( '#bar' ).bind( 'irrelevant-done', function() {
			eventDetectedOnBar++;
			ok( eventDetectedOnBar <= 2, 'irrelevant-done event detected on #bar' );
		});

		$( '#foo' ).bind( 'irrelevant-done', function() {
			eventDetectedOnFoo++;
			ok( eventDetectedOnFoo <= 2, 'irrelevant-done event detected on #foo' );
		});

		$( '#foo, #bar' ).relevance( 'hide' );
		// should still fire, even though elements are now irrelevant
		$( '#foo, #bar' ).relevance( 'hide' );

	});


}( jQuery ));
