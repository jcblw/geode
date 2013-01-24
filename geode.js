/* Geode
 * ==========================
 * Wrapper for http://www.geonames.org/ api in NodeJS Module form
 */

var request = require('request');

var Geode  = function(username, local){
	var that = this;
	that.username = (username) ? username : null;
	that.countryCode = (local.countryCode) ? local.countryCode : 'US';
	that.language = (local.language) ? local.language : 'en';
	that.endpoint = 'http://api.geonames.org/';
	if(that.username) that.ready = true
	else console.log('Username is required');

	that.localize = {
		username : that.username,
		country : that.countryCode,
		language : that.language
	};

	that.error = function(err, callback){
		if(process.env.NODE_ENV !== 'production') 
			console.log(err);
		callback(err, {});
	};

	that.merge = function(){
		if(typeof arguments[0] === 'object' && !arguments[0].length){
			var base = arguments[0]
			for(var i = 1; i < arguments.length; i += 1){
				for(var key in arguments[i]){
					base[key] = arguments[i][key];
				}
			}
		}
		return base;
	};

	that.request = function(collection, data, callback){
		var url = that.endpoint + collection + 'JSON';
		var payload = that.merge({},that.localize,data);
		console.log(url);
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

	that.methods = [
		'search',
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

	for(var i = 0; i < that.methods.length; i += 1){
		if(!that[that.methods[i]]){
			(function(n){
				that[that.methods[n]] = function(data, callback){
					that.request(that.methods[n], data, callback);
				};
			}(i));
		}
	};

};

module.exports = Geode;


