/**
 * @licence GNU GPL v3
 * @author Addshore
 */
'use strict';

var $ = require( 'jquery' ),
	cookie = require( 'cookie' ),
	config = require( './config.json' ),
	piwik = require( 'piwik' ).setup( config.piwikUrl );

/**
 * Tracking Handler.
 * @constructor
 */
var Tracking = function() {
	this._cookieName = 'filereuseuser';
	// 3 months
	this._cookieExpiryDays = 60 * 24 * 90;
	this._piwikSiteId = config.piwikSiteId;
};

$.extend( Tracking.prototype, {

	/**
	 * @type {string}
	 */
	_cookieName: null,

	/**
	 * @type {int}
	 */
	_cookieExpiryDays: null,

	/**
	 * @type {int}
	 */
	_piwikSiteId: null,

	/**
	 * @param category
	 * @param action
	 * @param name
	 * @param value
	 */
	trackEvent: function( category, action, name, value ) {
		piwik.track(
			{
				idsite: this._piwikSiteId,
				rec: 1,
				url: window.location.href,
				_id: this._getUserId(),
				// jscs:disable
				e_c: category,
				e_a: action,
				e_n: name,
				e_v: value
				// jscs:enable
			},
			function( err, data ) {
				if( err ) {
					console.log( err );
				}
			}
		);
	},

	/**
	 * @param pageName
	 */
	trackPageLoad: function( pageName ) {
		piwik.track(
			{
				idsite: this._piwikSiteId,
				rec: 1,
				url: window.location.href,
				// jscs:disable
				action_name: pageName,
				// jscs:enable
				_id: this._getUserId()
			},
			function( err, data ) {
				if( err ) {
					console.log( err );
				}
			}
		);
	},

	/**
	 * @returns {Date}
	 * @private
	 */
	_getCookieExpiryDate: function() {
		var now = new Date();
		var time = now.getTime();
		// 3 months
		var expireTime = time + ( this._cookieExpiryDays * 60000 );
		now.setTime( expireTime );
		return now;
	},

	/**
	 * @returns {*}
	 * @private
	 */
	_getUserIdCookie: function() {
		var value = '; ' + document.cookie;
		var parts = value.split( '; ' + this._cookieName + '=' );
		if( parts.length === 2 ) {
			return parts.pop().split( ';' ).shift();
		}
		return null;
	},

	/**
	 * @private
	 */
	_setUserIdCookie: function( userId ) {
		document.cookie = cookie.serialize(
			this._cookieName,
			userId,
			{ 'expires': this._getCookieExpiryDate() }
		);
	},

	/**
	 * @returns {string}
	 * @private
	 */
	_getUserId: function() {
		var userId = this._getUserIdCookie();
		if( userId !== null ) {
			return userId;
		} else {
			userId = this._getFreshUserId();
			this._setUserIdCookie( userId );
			return userId;
		}
	},

	/**
	 * @returns {string}
	 * @private
	 */
	_getFreshUserId: function() {
		return Math.round( Math.pow( 36, 16 + 1 ) - Math.random() * Math.pow( 36, 16 ) ).toString( 36 ).slice( 1 );
	}

} );

module.exports = Tracking;