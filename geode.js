/* Geode
 * ==========================
 * Wrapper for http://www.geonames.org/ api in NodeJS Module form
 */

var request = require('request');

/* @Constructor
 * @Param username :String - username to geonames.org
 * @Param local :Object - local information (OPTIONAL)
 * 		@local countryCode :String - eg. "US", "CA"
 *		@local language :String - eg. "en", "sp", "local"
 */

var Geode  = function(username, local) {
	this.username = (username) ? username : null;
	this.endpoint = 'http://api.geonames.org/';

	/* only attempt to set countryCode and language
	    if local object passed */
	if(local) {
			this.countryCode = local.countryCode
			this.language = local.language
	}

	if(this.username) {
		  this.ready = true;
	}
	else {
	    throw new Error('username is required');
	}

	this.localize = {
		username : this.username,
		country : this.countryCode,
		lang : this.language
	};

};

/* @Method error :Function - handle errors
 * @Param err :Object - Error object returned from request
 * @Param callback :Function - Function to pass error data back to
 */

Geode.prototype.error = function(err, callback){
	if(process.env.NODE_ENV !== 'production')
		console.log(err);
	callback(err, {});
};

/* @Method merge :Function - *utility* merging objects
 * @Params * :Objects - passed in via arguments array, objects to merge
 */

Geode.prototype.merge = function(){
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

Geode.prototype.request = function(collection, data, callback){
	var url = this.endpoint + collection + 'JSON';
	var payload = this.merge({},this.localize,data);
	request.get({
		url : url,
		qs : payload
	}, function(err, res, body){
		if(err) this.error(err, callback);
		else{
			callback(null, JSON.parse(body));
		}
	});
};

/* All method requirement can be found here
 * http://www.geonames.org/export/web-services.html
 */

Geode.METHODS = [
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

for(var i = 0; i < Geode.METHODS.length; i += 1){
	var methodName = Geode.METHODS[i];
	if(!Geode.prototype[methodName]){
		(function(n){
			Geode.prototype[n] = function(data, callback){
				this.request(n, data, callback);
			};
		}(methodName));
	}
}

/* Eg.
 * Geode.prototype.search = function(data, callback){
 *    this.request('search', data, callback);
 * };
 */


module.exports = Geode;
