'use strict';

var $ = require( 'jquery' ),
	doneTemplate = require( '../templates/Done.handlebars' ),
	dosAndDontsTemplate = require( '../templates/DosAndDonts.handlebars' ),
	attributionTemplate = require( '../templates/Attribution.handlebars' ),
	Clipboard = require( 'clipboard' );

/**
 * @param {DialogueEvaluation} evaluation
 * @constructor
 */
var DialogueEvaluationView = function( evaluation ) {
	this._evaluation = evaluation;
};

$.extend( DialogueEvaluationView.prototype, {
	/**
	 * @type {DialogueEvaluation}
	 */
	_evaluation: null,

	_showDont: function( e ) {
		$( this ).parent().siblings( '.dont-text' ).slideToggle();

		e.preventDefault();
	},

	_showAttribution: function( e ) {
		$( '.final-attribution .attribution-box div' ).hide();
		$( $( this ).data( 'target' ) ).show();
		$( '.final-attribution .show-attribution' ).toggleClass( 'active' );

		e.preventDefault();
	},

	_copyAttribution: function( trigger ) {
		$( trigger ).addClass( 'flash' );
		window.setTimeout( function() {
			$( trigger ).removeClass( 'flash' );
		}, 800 );
		return $( '.attribution-box > div:visible' ).text();
	},

	render: function() {
		var $html = $( doneTemplate() ),
			dosAndDonts = this._evaluation.getDosAndDonts();

		$html.append( attributionTemplate( {
			attribution: this._evaluation.getAttribution(),
			isPrint: this._evaluation.isPrint()
		} ) );
		$html.append( dosAndDontsTemplate( {
			dos: dosAndDonts.dos.map( function( d ) {
				return 'evaluation.do-' + d + '-text';
			} ),
			donts: dosAndDonts.donts.map( function( dont ) {
				return {
					headline: 'evaluation.dont-' + dont + '-headline',
					text: 'evaluation.dont-' + dont + '-text'
				};
			} )
		} ) );

		$html.find( '.show-attribution' ).click( this._showAttribution );
		$html.find( '.show-dont' ).click( this._showDont );
		new Clipboard( '#copy-attribution', { text: this._copyAttribution } ); // jshint ignore:line

		return $html;
	}
} );

module.exports = DialogueEvaluationView;