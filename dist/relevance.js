/*! relevance - v2.1.0 - 2015-03-04
* https://github.com/bboyle/relevance
* Copyright (c) 2015 Ben Boyle; Licensed MIT */
if ( jQuery !== 'undefined' ) {
	(function( $ ) {
		'use strict';

		var relevantEvent = 'relevant',
			irrelevantEvent = 'irrelevant',
			elementsToDisable = 'button, input, select, textarea',
			polyfillHidden = (function() {
				var hidden = $( '<div hidden></div>' );
				var hiddenSupported = hidden.appendTo( 'body' ).is( ':hidden' );
				hidden.remove();
				return ! hiddenSupported;
			}()),

			formElementsByName = function( form, name ) {
				// filter out the @id matching of HTMLFormElement.elements[]
				return $( form.elements[ name ] ).filter( '[name="' + name +'"]' );
			},

			filterRelevant = function() {
				return $( this ).closest( '[hidden]' ).length === 0;
			},

			filterIrrelevant = function() {
				return $( this ).closest( '[hidden]' ).length > 0;
			},

			valueMap = function( element ) {
				return element.value;
			},

			valueInArray = function( possibleValues, actualValues ) {
				var i;
				if ( typeof possibleValues !== 'object' ) {
					possibleValues = [ possibleValues ];
				}

				for ( i = 0; i < actualValues.length; i++ ) {
					if ( $.inArray( actualValues[ i ], possibleValues ) !== -1 ) {
						return true;
					}
				}

				return false;
			},

			// when changing a control that alters relevance of other elements…
			recalculateRelevance = function() {
				// assume dependency map exists
				var map = $( this.form ).data( 'relevance' ).dependencyMap[ this.name ],
					values = $.map( formElementsByName( this.form, this.name ).filter( 'select,:checked' ).filter( ':visible' ), valueMap )
				;

				$.each( map, function( index, config ) {
					config.items.relevance( 'relevant', valueInArray( config.values, values ) !== config.negate );
				});
			},

			// when an element changes relevance, check descendent controls that alter relevance in turn…
			recalculateDependents = function( isRelevant ) {
				var form, dependencyMap, targets;

				// any change to relevant toggles?
				form = this.closest( 'form' );
				if ( form.length ) {
					dependencyMap = form.data( 'relevance' );
					if ( typeof dependencyMap === 'object' ) {
						dependencyMap = dependencyMap.dependencyMap;
						if ( typeof dependencyMap === 'object' ) {
							// get descendent-or-self select, radio and checkbox
							targets = this.add( this.find( 'select,input' )).filter( 'select,:radio,:checkbox' );
							// get unique @name for select, radio and checkbox
							targets = $.unique( $.map( targets, function( elementOfArray ) {
								return elementOfArray.name;
							}));
							$.each( targets, function( index, name ) {
								var map = dependencyMap[ name ],
									values;

								if ( typeof map === 'object' ) {
									$.each( map, function( index, config ) {
										if ( isRelevant === false ) {
											config.items.relevance( 'relevant', false );

										} else {
											values = $.map( formElementsByName( form[ 0 ], name ).filter( 'select,:checked' ).filter( ':visible' ), valueMap );
											config.items.relevance( 'relevant', valueInArray( config.values, values ) !== config.negate );
										}
									});
								}
							});
						}
					}
				}
			},


		methods = {

			// $( x ).relevance( 'relevant', true )
			// if the element is hidden, fire a 'relevant' event
			// $( x ).relevance( 'relevant', false )
			// if the element is visible, fire an "irrelevant" event
			relevant: function( makeRelevant ) {
				var targets;
				if ( makeRelevant ) {
					targets = this.filter( filterIrrelevant ).trigger( relevantEvent );
				} else {
					targets = this.filter( filterRelevant ).trigger( irrelevantEvent );
				}
				if ( targets.length ) {
					recalculateDependents.call( targets, makeRelevant );
				}
				return this;
			},

			// $( x ).relevance( 'show' )
			// shows the element (does not check if element is already visible)
			// triggers 'relevant-done' after showing is complete
			show: function() {

				// enable elements before they are shown
				this.add( this.find( elementsToDisable ))
				// but not any controls that will remain irrelevant
				.not( this.find( '[hidden]' ).find( elementsToDisable ))
				.each(function() {
					this.removeAttribute( 'disabled' );
				});

				// stop animation, remove @hidden and @aria-hidden, start showing
				if ( polyfillHidden ) {
					this.stop( true, true ).slideDown();
				}
				return this.removeAttr( 'hidden' ).removeAttr( 'aria-hidden' );
			},

			// $( x ).relevance( 'hide' )
			// hides the element (does not check if element is already hidden)
			hide: function() {

				this.attr({
					hidden: 'hidden',
					'aria-hidden': 'true'
				});

				if ( polyfillHidden ) {
					this.stop( true, true ).hide( 0, function() {
						var $this = $( this );
						// disable elements (including self if appropriate)
						$this.filter( elementsToDisable ).add( $this.find( elementsToDisable )).each(function() {
							this.setAttribute( 'disabled', 'disabled' );
						});
					});
				} else {
					this.filter( elementsToDisable ).add( this.find( elementsToDisable )).each(function() {
						this.setAttribute( 'disabled', 'disabled' );
					});
				}

				return this;
			},

			// $( x ).relevance( 'relevantWhen', { name: radio/checkbox/select, value: requiredValue, negate: false | true })
			// sets up dependent relevance
			// example: $( '#red' ).relevance( 'relevantWhen', { name: 'rgb', value: 'red' })
			// example: $( '#red' ).relevance( 'relevantWhen', { id: 'rgb-red', value: 'red' })
			// #red will be shown/hidden when '@name=rgb' value changes.
			relevantWhen: function( config ) {
				var form, data, name, values;

				values = config.values || [ config.value ];

				if ( config.name ) {
					name = config.name;
				} else if ( config.id ) {
					name = document.getElementById( config.id ).name;
				} else if ( config.container ) {
					name = $( config.container ).find( 'select,:radio,:checkbox' ).attr( 'name' );
				}
				config.negate = config.negate === true;

				// find the form that has this control
				form = this.closest( 'form' );
				// get dependency map (create it if needed)
				data = form.data( 'relevance' );
				if ( typeof data !== 'object' ) {
					data = {};
					form.data( 'relevance', data );
				}
				if ( typeof data.dependencyMap !== 'object' ) {
					data.dependencyMap = {};
				}
				if ( typeof data.dependencyMap[ name ] !== 'object' ) {
					data.dependencyMap[ name ] = [];
					// setup event handlers for name
					formElementsByName( form[ 0 ], name )
						.filter( ':radio,:checkbox' )
							.bind( 'click', recalculateRelevance )
						.end()
						.filter( 'select' )
							.bind( 'change', recalculateRelevance )
					;
				}
				// add or update relevance rule
				data.dependencyMap[ name ].push({
					items: this,
					values: values,
					negate: config.negate
				});

				// initial relevance
				this.relevance( 'relevant', valueInArray( values, $.map( formElementsByName( form[ 0 ], name ).filter( 'select,:checked' ).filter( ':visible' ), valueMap )) !== config.negate );

				return this;
			},

			// $( x ).relevance( 'instructions', options )
			// sets up relevance handling based on text instructions
			// options ::= { instructions: '.relevance', questions: '.questions > li' }
			instructions: function( options ) {
				options = $.extend( {
					instructionSelector: '.relevance',
					questionSelector: '.questions > li'
				}, options );

				this.find( options.instructionSelector ).each(function() {
					var $this = $( this ),
						value = $this.text(),
						question = $this.closest( options.questionSelector ),
						toggle = question.prevAll( options.questionSelector ),
						i, answers, nestedToggles,
						match = false,
						negate = false
					;

					// pattern: (If different to <PREVIOUS QUESTION>)
					if ( /If different to/.test( value )) {
						// assume previous 'li' is the toggle
						match = true;
						toggle = toggle.eq( 0 );
						value = toggle.find( ':checkbox' ).val();
						negate = true;
					} else {
						value = value.replace( /^.*chose\s+\S([^'"’]+)\S\s+above.*$/, '$1' );
						// which of the previous questions is the toggle?
						i = 0;
						while ( i < toggle.length ) {
							// does this item have the answer we need?
							answers = $.map( toggle.eq( i ).find( 'option,:radio,:checkbox' ), valueMap );
							if ( valueInArray( value, answers )) {
								nestedToggles = toggle.eq( i ).find( options.questionSelector );
								if ( nestedToggles.length ) {
									toggle = $( nestedToggles.get().reverse() );
									i = 0;
								} else {
									match = true;
									toggle = toggle.eq( i ); // toggle.length becomes 1, loop will exit
									i = 1; // exit loop
								}
							} else {
								i++;
							}
						}
					}
					if ( match ) {
						toggle = toggle.add( toggle.find( 'select,input' )).filter( 'select,:radio,:checkbox' );
						question.relevance( 'relevantWhen', { name: toggle.attr( 'name' ), value: value, negate: negate });
					}
				});

				return this;
			}

		};


		// fallback (default) event handling
		$( document ).bind( 'relevant irrelevant', function( event ) {
			var target = $( event.target );
			if ( event.type === 'relevant' ) {
				target.relevance( 'show' );
			} else {
				target.relevance( 'hide' );
			}
		});


		$.fn.relevance = function( method ) {

			// Method calling logic
			// http://docs.jquery.com/Plugins/Authoring#Plugin_Methods
			if ( methods[method] ) {
				return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				// return methods.init.apply( this, arguments );
				return this;
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.relevance' );
			}

		};


	}( jQuery ));
}
