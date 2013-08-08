(function( $ ) {
	'use strict';
	

	var relevanceLifecycle = {
			setup: function() {
				$( '#test' ).relevance( 'instructions' );
			}
		},

		customRelevanceLifecycle = {
			setup: function() {
				$( '#test-custom' ).relevance( 'instructions', {
					instructionSelector : '.relevancy',
					questionSelector : '.Choice, .Text, .group'
				});
			},
			teardown: function() {
				// reset options
				$( '#test-custom' ).relevance( 'instructions', {
					instructionSelector: '.relevance',
					questionSelector: '.questions > li'
				});
			}
		}
	;


	module( 'environment' );

	test( 'test fields are in test form', 18, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test exists' );
		strictEqual( $( '.relevance', '#test' ).length, 14, '14 `.relevance` instructions found' );
		strictEqual( $( '.relevance', '#test' ).eq( 0 ).text(), '(If different to home address)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 1 ).text(), '(If you chose ‘Current working visa’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 2 ).text(), '(If you chose ‘Yes’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 3 ).text(), '(If you chose ‘Yes’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 4 ).text(), '(If you chose ‘Yes’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 5 ).text(), '(If you chose ‘Cat’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 6 ).text(), '(If you chose ‘Dog’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 7 ).text(), '(If you chose ‘Bird’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 8 ).text(), '(If you chose ‘Bar’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 9 ).text(), '(If you chose ‘Baz’ above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 10 ).text(), '(If you chose \'$1000.00\' above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 11 ).text(), '(If you chose \'other amount\' above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 12 ).text(), '(If you chose \'A\' above)', 'correct instruction text' );
		strictEqual( $( '.relevance', '#test' ).eq( 13 ).text(), '(If you chose \'A\' above)', 'correct instruction text' );

		// dependence
		strictEqual( $( '#foo' ).val(), 'Foo', '#foo != Bar' );
		// baz would be relevant, if bar was relevant
		strictEqual( $( '#bar' ).val(), 'Baz', '#bar == Baz' );

	});

	test( 'test fields are in custom form', 7, function() {

		strictEqual( $( 'form#test-custom' ).length, 1, 'form#test-custom exists' );
		strictEqual( $( '.relevancy', '#test-custom' ).length, 5, '5 `.relevance` instructions found' );
		strictEqual( $( '.relevancy', '#test-custom' ).eq( 0 ).text(), '(If you chose \'Yes\' above)', 'correct instruction text' );
		strictEqual( $( '.relevancy', '#test-custom' ).eq( 1 ).text(), '(If you chose \'No\' above)', 'correct instruction text' );
		strictEqual( $( '.relevancy', '#test-custom' ).eq( 2 ).text(), '(If you chose \'Cat\' above)', 'correct instruction text' );
		strictEqual( $( '.relevancy', '#test-custom' ).eq( 3 ).text(), '(If you chose \'Dog\' above)', 'correct instruction text' );
		strictEqual( $( '.relevancy', '#test-custom' ).eq( 4 ).text(), '(If you chose \'Bird\' above)', 'correct instruction text' );

	});


	module( 'before .relevance( \'instructions\' )' );

	test( 'all sections are relevant', 1, function() {
		strictEqual( $( '.relevance', '#test' ).filter( ':visible' ).length, 14, '12 `.relevance` instructions visible' );
	});

	test( 'custom sections are relevant', 1, function() {
		strictEqual( $( '.relevancy', '#test-custom' ).filter( ':visible' ).length, 5, '5 `.relevancy` instructions visible' );
	});


	module( 'after .relevance( \'instructions\' )', relevanceLifecycle );

	test( 'initial irrelevant elements are hidden', 1, function() {
		strictEqual( $( '.relevance', '#test' ).filter( ':visible' ).length, 0, 'no `.relevance` instructions visible' );
	});

	test( 'custom sections are ignored', 1, function() {
		strictEqual( $( '.relevancy', '#test-custom' ).filter( ':visible' ).length, 5, '5 `.relevancy` instructions visible' );
	});

	test( 'initial relevant elements are shown', 10, function() {
		
		// test radio buttons
		strictEqual( $( '#job-title' ).filter( ':hidden' ).length, 1, '#job-title is hidden' );
		strictEqual( $( '#job-title' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#job-title section is hidden' );
		strictEqual( $( '#retirement-date' ).filter( ':hidden' ).length, 1, '#retirement-date is hidden' );
		strictEqual( $( '#retirement-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#retirement-date question is hidden' );
		
		// test select
		strictEqual( $( '#permit-expiry-date' ).filter( ':hidden' ).length, 1, '#permit-expiry-date is hidden' );
		strictEqual( $( '#permit-expiry-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#permit-expiry-date question is hidden' );

		// test checkbox
		strictEqual( $( '#postal-address' ).filter( ':hidden' ).length, 1, '#postal-address is hidden' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).filter( ':hidden' ).length, 1, '#postal-address group is hidden' );

		// test dependence
		strictEqual( $( '#bar' ).filter( ':hidden' ).length, 1, '#bar is hidden' );
		// baz cannot be relevant because bar is not relevant
		strictEqual( $( '#baz' ).filter( ':hidden' ).length, 1, '#baz is hidden' );
	});

	test( 'question relevance can be toggled by radio buttons', 6, function() {

		// initially hidden
		strictEqual( $( '#retirement-date' ).filter( ':hidden' ).length, 1, '#retirement-date is hidden' );
		strictEqual( $( '#retirement-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#retirement-date question is hidden' );

		// toggle relevance by clicking radio button
		$( '#have-you-received-an-early-retirement-yes' )[ 0 ].click();

		// should now be visible
		strictEqual( $( '#retirement-date' ).filter( ':visible' ).length, 1, '#retirement-date is visible' );
		strictEqual( $( '#retirement-date' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#retirement-date question is visible' );

		// toggle relevance by clicking radio button
		$( '#have-you-received-an-early-retirement-no' )[ 0 ].click();

		// should be hidden again
		strictEqual( $( '#retirement-date' ).filter( ':hidden' ).length, 1, '#retirement-date is hidden' );
		strictEqual( $( '#retirement-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#retirement-date question is hidden' );

	});

	test( 'question relevance can be toggled by select list', 6, function() {

		// initially hidden
		strictEqual( $( '#permit-expiry-date' ).filter( ':hidden' ).length, 1, '#permit-expiry-date is hidden' );
		strictEqual( $( '#permit-expiry-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#permit-expiry-date question is hidden' );

		// toggle relevance by changing selection
		$( '#work-status' ).each(function() { this.selectedIndex = 5; }).trigger( 'change' );

		// should now be visible
		strictEqual( $( '#permit-expiry-date' ).filter( ':visible' ).length, 1, '#permit-expiry-date is visible' );
		strictEqual( $( '#permit-expiry-date' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#permit-expiry-date question is visible' );

		// toggle relevance by changing selection
		$( '#work-status' ).each(function() { this.selectedIndex = 1; }).trigger( 'change' );

		// should be hidden again
		strictEqual( $( '#permit-expiry-date' ).filter( ':hidden' ).length, 1, '#permit-expiry-date is hidden' );
		strictEqual( $( '#permit-expiry-date' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#permit-expiry-date question is hidden' );

	});

	test( 'group relevance can be toggled by radio buttons', 6, function() {

		// initially hidden
		strictEqual( $( '#job-title' ).filter( ':hidden' ).length, 1, '#job-title is hidden' );
		strictEqual( $( '#job-title' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#job-title section is hidden' );

		// toggle relevance by clicking radio button
		$( '#are-you-currently-employed-by-the-queensland-government-yes' )[ 0 ].click();

		// should now be visible
		strictEqual( $( '#job-title' ).filter( ':visible' ).length, 1, '#job-title is visible' );
		strictEqual( $( '#job-title' ).closest( '.section' ).filter( ':visible' ).length, 1, '#job-title section is visible' );

		// toggle relevance by clicking radio button
		$( '#are-you-currently-employed-by-the-queensland-government-no' )[ 0 ].click();

		// should be hidden again
		strictEqual( $( '#job-title' ).filter( ':hidden' ).length, 1, '#job-title is hidden' );
		strictEqual( $( '#job-title' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#job-title section is hidden' );

	});

	test( 'group relevance can be toggled by checkbox', 8, function() {

		// initially hidden
		strictEqual( $( '#postal-address' ).filter( ':hidden' ).length, 1, '#postal-address is hidden' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).filter( ':hidden' ).length, 1, '#postal-address group is hidden' );

		// toggle relevance by clicking checkbox
		$( '#use-my-residential-address-as-my-postal-address' )[ 0 ].click();
		strictEqual( $( '#use-my-residential-address-as-my-postal-address' )[ 0 ].checked, false, 'checkbox is not checked' );

		// should now be visible
		strictEqual( $( '#postal-address' ).filter( ':visible' ).length, 1, '#postal-address is visible' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).filter( ':visible' ).length, 1, '#postal-address group is visible' );

		// toggle relevance by clicking checkbox
		$( '#use-my-residential-address-as-my-postal-address' )[ 0 ].click();
		strictEqual( $( '#use-my-residential-address-as-my-postal-address' )[ 0 ].checked, true, 'checkbox is checked' );

		// should be hidden again
		strictEqual( $( '#postal-address' ).filter( ':hidden' ).length, 1, '#postal-address is hidden' );
		strictEqual( $( '#postal-address' ).closest( '.atomic' ).filter( ':hidden' ).length, 1, '#postal-address group is hidden' );

	});


	test( 'multiple checkboxes can control multiple elements', 15, function() {

		$( '#pet-owner-yes' )[ 0 ].click();

		// initial state
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#dog-owners section is hidden' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#bird-owners section is hidden' );

		// tick dogs
		$( '#pets-dog' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#dog-owners section is visible' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#bird-owners section is hidden' );

		// tick birds
		$( '#pets-bird' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#dog-owners section is visible' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#bird-owners section is visible' );

	});


	test( 'punctuation characters are supported in values', 2, function() {

		strictEqual( $( '#donation-name' ).filter( ':hidden' ).length, 1, '#donation-name is initially hidden' );

		$( '#donation-1000' )[ 0 ].click();
		strictEqual( $( '#donation-name' ).filter( ':visible' ).length, 1, '#donation-name is visible' );
	});


	module( 'nested relevance', relevanceLifecycle );

	test( 'sequential relevance', 15, function() {

		// initially hidden
		strictEqual( $( '#pets' ).filter( ':hidden' ).length, 1, '#pets is hidden' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#pets question is hidden' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#dog-owners section is hidden' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#bird-owners section is hidden' );

		// toggle relevance by clicking radio button
		$( '#pet-owner-yes' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#dog-owners section is hidden' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#bird-owners section is hidden' );

		// toggle nested relevance by clicking checkboxes
		$( '#pets-cat' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#cat-owners section is visible' );
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#dog-owners section is hidden' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#bird-owners section is hidden' );
	});

	test( 'hiding a gating question hides the dependencies', 14, function() {

		$( '#pet-owner-yes' )[ 0 ].click();
		$( '#pets-bird' )[ 0 ].click();
		$( '#pets-dog' )[ 0 ].click();

		// toggle nested relevance by clicking checkboxes
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		strictEqual( $( '#dog-owners, #bird-owners' ).closest( '.section' ).filter( ':visible' ).length, 2, '#dog-owners, #bird-owners sections are visible' );

		// toggle pet ownership, should also hide dog and bird questions
		$( '#pet-owner-no' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':hidden' ).length, 1, '#pets is hidden' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':hidden' ).length, 1, '#pets question is hidden' );
		strictEqual( $( '#cat-owners, #dog-owners, #bird-owners' ).closest( '.section' ).filter( ':hidden' ).length, 3, '#cat-owners, #dog-owners, #bird-owners sections are hidden' );

		// toggle pet ownership, should also show dog and bird question
		$( '#pet-owner-yes' )[ 0 ].click();
		strictEqual( $( '#pets' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets' ).closest( '.questions > li' ).filter( ':visible' ).length, 1, '#pets question is visible' );
		strictEqual( $( '#pets-dog' )[ 0 ].checked, true, 'remembers pets-dog is checked' );
		strictEqual( $( '#pets-bird' )[ 0 ].checked, true, 'remembers pets-bird is checked' );
		strictEqual( $( '#cat-owners' ).closest( '.section' ).filter( ':hidden' ).length, 1, '#cat-owners section is hidden' );
		// remember that dogs and birds are checked
		strictEqual( $( '#dog-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#dog-owners section is visible' );
		strictEqual( $( '#bird-owners' ).closest( '.section' ).filter( ':visible' ).length, 1, '#bird-owners section is visible' );

	});

	test( 'dependencies are recalculated when a field becomes relevant', 6, function() {

		// bar and baz is hidden
		strictEqual( $( '#bar, #baz' ).filter( ':hidden' ).length, 2, '#bar and #baz are not relevant' );
		// baz would be relevant if bar was relevant
		strictEqual( $( '#bar' ).val(), 'Baz', '#bar == Baz' );

		// make bar relevant by changing selection on foo
		$( '#foo' ).each(function() { this.selectedIndex = 1; }).trigger( 'change' );
		strictEqual( $( '#foo' ).val(), 'Bar', '#foo == Bar' );
		strictEqual( $( '#bar' ).filter( ':visible' ).length, 1, '#bar is relevant' );

		// baz should be relevant
		strictEqual( $( '#bar' ).val(), 'Baz', '#bar == Baz' );
		strictEqual( $( '#baz' ).filter( ':visible' ).length, 1, '#baz is relevant' );

	});

	test( 'last question in previous section becomes the gate', 1, function() {

		// second gate is hidden
		// after gates is hidden
		strictEqual( $( '#after-gates, #second-gate' ).filter( ':visible' ).length, 0, 'sections after gating questions are hidden' );

	});


	module( 'custom instructions', customRelevanceLifecycle );

	test( 'irrelevant elements are hidden', 1, function() {
		strictEqual( $( '.relevancy', '#test-custom' ).filter( ':visible' ).length, 0, 'no `.relevancy` instructions visible' );
	});

	test( 'relevance can be toggled', 14, function() {

		$( '#pet-owner2-yes' )[ 0 ].click();
		$( '#pets2-bird' )[ 0 ].click();
		$( '#pets2-dog' )[ 0 ].click();

		// toggle nested relevance by clicking checkboxes
		strictEqual( $( '#pets2' ).filter( ':visible' ).length, 1, '#pets2 is visible' );
		strictEqual( $( '#cat-owners2' ).filter( ':hidden' ).length, 1, '#cat-owners2 section is hidden' );
		strictEqual( $( '#dog-owners2, #bird-owners2' ).filter( ':visible' ).length, 2, '#dog-owners2, #bird-owners2 sections are visible' );
		strictEqual( $( '#pets2-no' ).filter( ':hidden' ).length, 1, '#pets2-no is hidden' );

		// toggle pet ownership, should also hide cat question
		$( '#pet-owner2-no' )[ 0 ].click();
		strictEqual( $( '#pets2' ).filter( ':hidden' ).length, 1, '#pets2 is hidden' );
		strictEqual( $( '#cat-owners2, #dog-owners2, #bird-owners2' ).filter( ':hidden' ).length, 3, '#cat-owners2, #dog-owners2, #bird-owners2 sections are hidden' );
		strictEqual( $( '#pets2-no' ).filter( ':visible' ).length, 1, '#pets2-no is visible' );

		// toggle pet ownership, should also show cat question
		$( '#pet-owner2-yes' )[ 0 ].click();
		strictEqual( $( '#pets2' ).filter( ':visible' ).length, 1, '#pets is visible' );
		strictEqual( $( '#pets2-dog' )[ 0 ].checked, true, 'remembers pets2-dog is checked' );
		strictEqual( $( '#pets2-bird' )[ 0 ].checked, true, 'remembers pets2-bird is checked' );
		strictEqual( $( '#cat-owners2' ).filter( ':hidden' ).length, 1, '#cat-owners2 section is hidden' );
		strictEqual( $( '#pets2-no' ).filter( ':hidden' ).length, 1, '#pets2-no is hidden' );
		// remember that dogs and birds are checked
		strictEqual( $( '#dog-owners2' ).filter( ':visible' ).length, 1, '#dog-owners2 section is visible' );
		strictEqual( $( '#bird-owners2' ).filter( ':visible' ).length, 1, '#bird-owners2 section is visible' );

	});


}( jQuery ));
