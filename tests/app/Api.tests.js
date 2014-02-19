( function( define ) {

	define( ['qunit', 'jquery', 'Api', 'Author'], function( QUnit, $, Api, Author ) {

		QUnit.module( 'Api' );

		var testCases = {
			'LRO_Tycho_Central_Peak.jpg': {
				// Author without link:
				authors: [new Author( $( document.createTextNode( 'NASA / GSFC / Arizona State Univ. / Lunar Reconnaissance Orbiter' ) ) )],
				licenceId: 'PD'
			},
			'Helene Fischer 2010.jpg': {
				// Author with internal wiki link:
				authors: [new Author( $( '<a href="http://commons.wikimedia.org/wiki/User:Fleyx24">Fleyx24</a>' ) )],
				licenceId: 'cc-by-sa-3.0'
			},
			'JapaneseToiletControlPanel.jpg': {
				authors: [new Author( $( '<a href="http://commons.wikimedia.org/wiki/User:Chris_73">Chris 73</a>' ) )],
				licenceId: 'cc-by-sa-3.0'
			},
			'13-09-29-nordfriesisches-wattenmeer-RalfR-15.jpg': {
				// Complex author attribution:
				authors: [new Author( $( '<div/>' ).html( '©&nbsp;<a href="http://commons.wikimedia.org/wiki/User:Ralf_Roletschek">Ralf Roletschek</a> - <a rel="nofollow" href="http://www.roletschek.de">Fahrradtechnik und Fotografie</a>' ).contents() )],
				// Multi-licence-template:
				licenceId: 'cc-by-sa-3.0'
			},
			'Statue Andrrea Palladio Vicenza.jpg': {
				// No detectable author:
				authors: [],
				licenceId: 'cc-zero'
			},
			'Inisheer Gardens 2002 dry-stone walls.jpg': {
				authors: [new Author( $( '<a href="http://commons.wikimedia.org/wiki/User:Arcimboldo">Eckhard Pecher</a>' ) )],
				// Features additional newer CC-BY-SA licence, preferring non-SA licence:
				licenceId: 'cc-by-2.0-de'
			},
			'Wien Karlsplatz3.jpg': {
				// Strip "(talk)" link:
				authors: [new Author( $( '<a href="http://commons.wikimedia.org/wiki/User:Ikar.us">Ikar.us</a>' ) )],
				licenceId: ['cc-by-2.0-de']
			},
			'Brandenburg gate sunset quadriga.jpg': {
				authors: [],
				licenceId: 'cc-by-sa-3.0'
			}
		};

		var api = new Api( '//commons.wikimedia.org/w/api.php?callback=?' );

		QUnit.test( 'Check scraped asset', function( assert ) {

			$.each( testCases, function( filename, testCase ) {

				QUnit.stop();

				api.getAsset( filename )
				.done( function( asset ) {

					$.each( asset.getAuthors(), function( i, author ) {

						assert.equal(
							author.getText(),
							testCases[filename].authors[i].getText(),
							'"' + filename + '": Author text "' + author.getText() + '" matches.'
						);

						var authorHtml = $( '<div/>' ).append( author.getHtml() ).html();

						assert.equal(
							$( '<div/>' ).append( author.getHtml() ).html(),
							$( '<div/>' ).append( testCases[filename].authors[i].getHtml() ).html(),
							'"' + filename + '": Author html "' + authorHtml + '" matches.'
						);

					} );

					assert.equal(
						asset.getLicence().getId(),
						testCases[filename].licenceId,
						'Licence "' + asset.getLicence().getId() + '" matches.'
					);

				} )
				.fail( function() {
					assert.ok(
						false,
						'API call failed.'
					);
				} )
				.always( function() {
					QUnit.start()
				} );

			} );

		} );
	} );

}( define ) );
