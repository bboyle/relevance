(function( $ ) {
	'use strict';
	

	module( 'environment' );

	test( 'test elements are in test form', 20, function() {

		strictEqual( $( 'form#test' ).length, 1, 'form#test exists' );
		// rgb radio buttons exist
		strictEqual( $( ':radio', 'form#test .rgb-radio-buttons' ).length, 3, '3 radio buttons in form#test exists' );
		strictEqual( $( ':radio', 'form#test .rgb-radio-buttons' ).eq( 0 ).val(), 'red', 'red radio button in form#test exists' );
		strictEqual( $( ':radio', 'form#test .rgb-radio-buttons' ).eq( 1 ).val(), 'green', 'green radio button in form#test exists' );
		strictEqual( $( ':radio', 'form#test .rgb-radio-buttons' ).eq( 2 ).val(), 'blue', 'blue radio button in form#test exists' );
		// red, green, blue items exist
		strictEqual( $( '#red', 'form#test' ).length, 1, '#red exists in form#test' );
		strictEqual( $( '#green', 'form#test' ).length, 1, '#green exists in form#test' );
		strictEqual( $( '#blue', 'form#test' ).length, 1, '#blue exists in form#test' );
		// cymk checkboxes exist
		strictEqual( $( ':checkbox', 'form#test' ).length, 4, '4 checkboxes in form#test exists' );
		strictEqual( $( ':checkbox', 'form#test' ).eq( 0 ).val(), 'cyan', 'cyan checkbox in form#test exists' );
		strictEqual( $( ':checkbox', 'form#test' ).eq( 1 ).val(), 'magenta', 'magenta checkbox in form#test exists' );
		strictEqual( $( ':checkbox', 'form#test' ).eq( 2 ).val(), 'yellow', 'yellow checkbox in form#test exists' );
		strictEqual( $( ':checkbox', 'form#test' ).eq( 3 ).val(), 'black', 'black checkbox in form#test exists' );
		// colour space question exists
		strictEqual( $( 'select#colour-space', 'form#test' ).length, 1, 'select#colour-space exists' );
		strictEqual( $( 'option', '#colour-space' ).eq( 0 ).val(), 'RGB', 'select#colour-space option 1 is RGB' );
		strictEqual( $( 'option', '#colour-space' ).eq( 1 ).val(), 'CMYK', 'select#colour-space option 2 is CMYK' );
		// cyan, magenta, yellow items exist
		strictEqual( $( '#cyan', 'form#test' ).length, 1, '#cyan exists in form#test' );
		strictEqual( $( '#magenta', 'form#test' ).length, 1, '#magenta exists in form#test' );
		strictEqual( $( '#yellow', 'form#test' ).length, 1, '#yellow exists in form#test' );
		strictEqual( $( '#black', 'form#test' ).length, 1, '#black exists in form#test' );

	});

	test( 'test elements are after form', 4, function() {

		// cymk sections are after form
		strictEqual( $( 'form#test' ).nextAll( '#cyan-after' ).length, 1, '#cyan is after form#test' );
		strictEqual( $( 'form#test' ).nextAll( '#magenta-after' ).length, 1, '#magenta is after form#test' );
		strictEqual( $( 'form#test' ).nextAll( '#yellow-after' ).length, 1, '#yellow is after form#test' );
		strictEqual( $( 'form#test' ).nextAll( '#black-after' ).length, 1, '#black is after form#test' );

	});

	test( 'nested section elements', 5, function() {

		// hidden section items exist
		strictEqual( $( ':checkbox', 'form#test2' ).length, 4, '4 checkboxes in form#test2 exists' );
		strictEqual( $( 'section#hidden', 'form#test2' ).length, 1, 'hidden section in form#test2 exists' );
		strictEqual( $( ':radio', 'section#hidden' ).length, 2, '2 radio buttons in section#hidden' );
		strictEqual( $( 'section#icecream', 'section#hidden' ).length, 1, 'subsection within hidden section' );
		strictEqual( $( ':checkbox', 'section#icecream' ).length, 3, '3 checkboxes within hidden subsection' );

	});

	test( 'elements are initially visible', 6, function() {

		strictEqual( $( ':radio', '#test' ).filter( ':visible' ).length, 3, 'RGB radio buttons are visible' );
		strictEqual( $( '#red, #green, #blue' ).filter( ':visible' ).length, 3, 'RGB elements are visible' );
		strictEqual( $( ':checkbox', '#test' ).filter( ':visible' ).length, 4, 'CMYK checkboxes are visible' );
		strictEqual( $( '#cyan, #magenta, #yellow, #black' ).filter( ':visible' ).length, 4, 'CMYK elements are visible' );
		strictEqual( $( ':checkbox', '#test2' ).filter( ':visible' ).length, 4, 'form#test2 checkboxes are visible' );
		strictEqual( $( ':radio', '#test2' ).filter( ':visible' ).length, 2, 'form#test2 radio buttons are visible' );

	});


	module( 'relevantWhen within form' );

	test( 'can setup relevance using @name', 10, function() {

		strictEqual( $( '#red, #green, #blue' ).filter( ':visible' ).length, 3, '#red, #green, #blue are visible' );

		// setup relevance
		$( '#red' ).relevance( 'relevantWhen', { name: 'rgb', value: 'red' });
		$( '#green' ).relevance( 'relevantWhen', { name: 'rgb', value: 'green' });
		$( '#blue' ).relevance( 'relevantWhen', { name: 'rgb', value: 'blue' });
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after relevantWhen setup' );
		strictEqual( $( '#green' ).filter( ':visible' ).length, 1, '#green is visible after relevantWhen setup' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after relevantWhen setup' );

		// click 'red' radio button
		$( ':radio[value="red"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':visible' ).length, 1, '#red is visible after choosing "red" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "red" value' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after choosing "red" value' );

		// click 'blue' radio button
		$( ':radio[value="blue"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after choosing "blue" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "blue" value' );
		strictEqual( $( '#blue' ).filter( ':visible' ).length, 1, '#blue is visible after choosing "blue" value' );

	});

	test( 'can setup relevance using @id', 10, function() {

		strictEqual( $( '#red, #green, #blue' ).filter( ':visible' ).length, 3, '#red, #green, #blue are visible' );

		// setup relevance
		$( '#red' ).relevance( 'relevantWhen', { id: 'rgb-red', value: 'red' });
		$( '#green' ).relevance( 'relevantWhen', { id: 'rgb-green', value: 'green' });
		$( '#blue' ).relevance( 'relevantWhen', { id: 'rgb-blue', value: 'blue' });
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after relevantWhen setup' );
		strictEqual( $( '#green' ).filter( ':visible' ).length, 1, '#green is visible after relevantWhen setup' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after relevantWhen setup' );

		// click 'red' radio button
		$( ':radio[value="red"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':visible' ).length, 1, '#red is visible after choosing "red" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "red" value' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after choosing "red" value' );

		// click 'blue' radio button
		$( ':radio[value="blue"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after choosing "blue" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "blue" value' );
		strictEqual( $( '#blue' ).filter( ':visible' ).length, 1, '#blue is visible after choosing "blue" value' );

	});

	test( 'can setup relevance using container selector', 10, function() {

		strictEqual( $( '#red, #green, #blue' ).filter( ':visible' ).length, 3, '#red, #green, #blue are visible' );

		// setup relevance
		$( '#red' ).relevance( 'relevantWhen', { container: '.rgb-radio-buttons', value: 'red' });
		$( '#green' ).relevance( 'relevantWhen', { container: '.rgb-radio-buttons', value: 'green' });
		$( '#blue' ).relevance( 'relevantWhen', { container: '.rgb-radio-buttons', value: 'blue' });
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after relevantWhen setup' );
		strictEqual( $( '#green' ).filter( ':visible' ).length, 1, '#green is visible after relevantWhen setup' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after relevantWhen setup' );

		// click 'red' radio button
		$( ':radio[value="red"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':visible' ).length, 1, '#red is visible after choosing "red" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "red" value' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after choosing "red" value' );

		// click 'blue' radio button
		$( ':radio[value="blue"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after choosing "blue" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "blue" value' );
		strictEqual( $( '#blue' ).filter( ':visible' ).length, 1, '#blue is visible after choosing "blue" value' );

	});

	test( 'can setup relevance using @values', 10, function() {

		strictEqual( $( '#red, #green, #blue' ).filter( ':visible' ).length, 3, '#red, #green, #blue are visible' );

		// setup relevance
		$( '#red' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'red' ] });
		$( '#green' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'green' ] });
		$( '#blue' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'blue' ] });
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after relevantWhen setup' );
		strictEqual( $( '#green' ).filter( ':visible' ).length, 1, '#green is visible after relevantWhen setup' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after relevantWhen setup' );

		// click 'red' radio button
		$( ':radio[value="red"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':visible' ).length, 1, '#red is visible after choosing "red" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "red" value' );
		strictEqual( $( '#blue' ).filter( ':hidden' ).length, 1, '#blue is hidden after choosing "red" value' );

		// click 'blue' radio button
		$( ':radio[value="blue"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#red' ).filter( ':hidden' ).length, 1, '#red is hidden after choosing "blue" value' );
		strictEqual( $( '#green' ).filter( ':hidden' ).length, 1, '#green is hidden after choosing "blue" value' );
		strictEqual( $( '#blue' ).filter( ':visible' ).length, 1, '#blue is visible after choosing "blue" value' );

	});

	module( 'dependencies' );

	test( 'dependencies are managed', 14, function() {

		// colour space relevance
		$( '.rgb-radio-buttons' ).relevance( 'relevantWhen', { name: 'colourSpace', value: 'RGB' });
		$( ':checkbox[name="cmyk"]' ).relevance( 'relevantWhen', { id: 'colour-space', value: 'CMYK' });

		// rgb question relevance
		$( '#red' ).relevance( 'relevantWhen', { id: 'rgb-red', value: 'red' });
		$( '#green' ).relevance( 'relevantWhen', { id: 'rgb-green', value: 'green' });
		$( '#blue' ).relevance( 'relevantWhen', { id: 'rgb-blue', value: 'blue' });

		// cmyk question relevance
		// $( '#cyan' ).relevance( 'relevantWhen', { name: 'cmyk', value: 'cyan' });
		// $( '#magenta' ).relevance( 'relevantWhen', { name: 'cmyk', value: 'magenta' });
		// $( '#yellow' ).relevance( 'relevantWhen', { name: 'cmyk', value: 'yellow' });
		// $( '#black' ).relevance( 'relevantWhen', { name: 'cmyk', value: 'black' });

		// check initial state
		strictEqual( $( '#colour-space' ).val(), 'RGB', 'RGB is the colour space' );
		strictEqual( $( ':radio[value="red"]' ).is( ':checked' ), false, 'red is not checked' );
		strictEqual( $( '#red:hidden' ).length, 1, '#red is hidden' );
		strictEqual( $( ':radio[value="green"]' ).is( ':checked' ), true, 'green is checked' );
		strictEqual( $( '#green:visible' ).length, 1, '#green is visible' );
		strictEqual( $( ':radio[value="blue"]' ).is( ':checked' ), false, 'blue is not checked' );
		strictEqual( $( '#blue:hidden' ).length, 1, '#blue is hidden' );

		// toggle relevance by changing selection
		$( '#colour-space' ).each(function() { this.selectedIndex = 1; }).trigger( 'change' );

		// check state after relevance change
		strictEqual( $( '#colour-space' ).val(), 'CMYK', 'CMYK is the colour space' );
		strictEqual( $( ':radio[value="red"]' ).is( ':disabled' ), true, 'red is disabled' );
		strictEqual( $( '#red:hidden' ).length, 1, '#red is hidden' );
		strictEqual( $( ':radio[value="green"]' ).is( ':disabled' ), true, 'green is disabled' );
		strictEqual( $( '#green:hidden' ).length, 1, '#green is hidden' );
		strictEqual( $( ':radio[value="blue"]' ).is( ':disabled' ), true, 'blue is disabled' );
		strictEqual( $( '#blue:hidden' ).length, 1, '#blue is hidden' );

	});



	// TODO test chaining, e.g. both #red and #green toggled when relevant = blue
	// TODO nested dependencies
	// TODO test initial relevance using checkboxes (e.g. cyan and yellow both checked, is yellow visible?)
	// TODO update relevantWhen rule. e.g. relevantWhen rgb = red, then relevantWhen rgb = green


	// set of values e.g. magenta: relevantWhen rgb = red or blue
	module( 'set of values' );

	test( 'value in set', 10, function() {

		strictEqual( $( '#cyan, #magenta, #yellow' ).filter( ':visible' ).length, 3, '#cyan, #magenta, #yellow are visible' );

		// setup relevance
		$( '#cyan' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'red', 'green' ] });
		$( '#magenta' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'red', 'blue' ] });
		$( '#yellow' ).relevance( 'relevantWhen', { name: 'rgb', values: [ 'green', 'blue' ] });
		strictEqual( $( '#cyan' ).filter( ':visible' ).length, 1, '#cyan is visible after relevantWhen setup' );
		strictEqual( $( '#magenta' ).filter( ':hidden' ).length, 1, '#magenta is hidden after relevantWhen setup' );
		strictEqual( $( '#yellow' ).filter( ':visible' ).length, 1, '#yellow is visible after relevantWhen setup' );

		// click 'red' radio button
		$( ':radio[value="red"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#cyan' ).filter( ':visible' ).length, 1, '#cyan is visible after choosing "red" value' );
		strictEqual( $( '#magenta' ).filter( ':visible' ).length, 1, '#magenta is visible after choosing "red" value' );
		strictEqual( $( '#yellow' ).filter( ':hidden' ).length, 1, '#yellow is hidden after choosing "red" value' );

		// click 'blue' radio button
		$( ':radio[value="blue"]', 'form#test' )[ 0 ].click();
		strictEqual( $( '#cyan' ).filter( ':hidden' ).length, 1, '#cyan is hidden after choosing "blue" value' );
		strictEqual( $( '#magenta' ).filter( ':visible' ).length, 1, '#magenta is visible after choosing "blue" value' );
		strictEqual( $( '#yellow' ).filter( ':visible' ).length, 1, '#yellow is visible after choosing "blue" value' );

	});


	module( 'nested relevance' );

	test( 'nested controls remain disabled until relevant', 6, function() {
		// TODO if #hidden is already @hidden, then #icecream won't be changed as it is already 'irrelevant' (hidden)
		$( '#icecream' ).relevance( 'relevantWhen', {
			name: 'icecream',
			value: 'yes'
		});
		// TODO does it matter what order this is done in?
		$( '#hidden' ).relevance( 'relevantWhen', {
			id: 'hidden-section',
			value: 'show'
		});

		strictEqual( $( '#hidden' ).filter( ':hidden' ).length, 1, 'section is hidden' );
		strictEqual( $( '#icecream' ).filter( ':hidden' ).length, 1, 'subsection is hidden' );
		strictEqual( $( 'input', '#hidden' ).filter( '[disabled]' ).length, 5, '5 controls in section are disabled' );

		// make section relevant
		$( '#hidden-section' )[ 0 ].click();
		strictEqual( $( '#hidden' ).filter( ':visible' ).length, 1, 'section is visible' );
		strictEqual( $( '#icecream' ).filter( ':hidden' ).length, 1, 'subsection is hidden' );
		strictEqual( $( 'input', '#hidden' ).filter( '[disabled]' ).length, 3, '3 controls in section are disabled' );

	});


}( jQuery ));
