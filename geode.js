/* Geode
 * ==========================
 * Wrapper for http://www.geonames.org/ api in NodeJS Module form
 */

var request = require('request');

/* @Constructor
 * @Param username :String - username to geonames.org
 * @Param local :Object - local information (OPTIONAL)
 * 		@local countryCode :String - eg. "US", "CA"
 *		@local language :String - eg. "en", "sp"
 */

var Geode  = function(username, local) {
	var that = this;
	that.username = (username) ? username : null;
	that.endpoint = 'http://api.geonames.org/';

	/* only attempt to set countryCode and language
	    if local object passed */
	if(local) {
	    that.countryCode = (local.countryCode ? local.countryCode : 'US');
	    that.language = (local.language ? local.language : 'en');
	}

	if(that.username) {
	    that.ready = true;
	}
	else {
	    throw new Error('username is required');
	}

	that.localize = {
		username : that.username,
		country : that.countryCode,
		language : that.language
	};

	/* @Method error :Function - handle errors
	 * @Param err :Object - Error object returned from request
	 * @Param callback :Function - Function to pass error data back to
	 */

	that.error = function(err, callback){
		if(process.env.NODE_ENV !== 'production')
			console.log(err);
		callback(err, {});
	};

	/* @Method merge :Function - *utility* merging objects
	 * @Params * :Objects - passed in via arguments array, objects to merge
	 */

	that.merge = function(){
		if(typeof arguments[0] === 'object' && !arguments[0].length){
			var base = arguments[0];
			for(var i = 1; i < arguments.length; i += 1){
				for(var key in arguments[i]){
					base[key] = arguments[i][key];
				}
			}
		}
		return base;
	};

	/* @Method request :Function - sends out request to geonames server
	 * @Param collection :String - corresponds to url endpoints in api
	 * @Param data :Object - Payload to send in query string
	 * @Param callback :Function - Function to pass error data back to
	 */

	that.request = function(collection, data, callback){
		var url = that.endpoint + collection + 'JSON';
		var payload = that.merge({},that.localize,data);
		request.get({
			url : url,
			qs : payload
		}, function(err, res, body){
			if(err) that.error(err, callback);
			else{
				callback(null, JSON.parse(body));
			}
		});
	};

	/* All method requirement can be found here
	 * http://www.geonames.org/export/web-services.html
	 */

	that.methods = [
		'search',
		'get',
		'postalCode',
		'postalCodeLookup',
		'findNearbyPostalCodes',
		'postalCodeCountryInfo',
		'findNearbyPlaceName',
		'findNearby',
		'extendedFindNearby',
		'children',
		'hierarchy',
		'neighbours',
		'siblings',
		'findNearbyWikipedia',
		'wikipediaSearch',
		'wikipediaBoundingBox',
		'cities',
		'earthquakes',
		'weather',
		'weatherIcaoJSON',
		'findNearByWeather',
		'countryInfo',
		'countryCode',
		'countrySubdivision',
		'ocean',
		'neighbourhood',
		'srtm3',
		'astergdem',
		'gtopo30',
		'timezone'
	];

	// Compile methods

	for(var i = 0; i < that.methods.length; i += 1){
		if(!that[that.methods[i]]){
			(function(n){
				that[that.methods[n]] = function(data, callback){
					that.request(that.methods[n], data, callback);
				};
			}(i));
		}
	}

	/* Eg.
	 * that.search = function(data, callback){
	 *    that.request('search', data, callback);
	 * };
	 */

};

module.exports = Geode;
