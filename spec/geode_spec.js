var geode   = require("../geode"),
    should  = require("should"),
    _       = require("underscore");

describe("#instantiate geode", function() {
    it("without parameters should throw exception", function() {
        (function () {
            new geode();
        }).should.throw(Error);
    });
    
    it("without'local' param shoudl return data", function(done) {
        var geo = new geode("demo");
        
        geo.search({ q: "london", maxRows: 10 }, function(err, results) {
            should.not.exist(err);
            should.exist(results);
            done();
        });        
    });
    
    it("with 'local' param should return 'US' only data", function(done) {
        var username = process.env.USER;
        if ( !username ){
            throw new Error( 'please run test with "USER={username} npm test"' );
        }
        var geo = new geode( username , { language: "en", country : "US" });
        
        geo.search({ q: "london", maxRows: 10 }, function(err, results) {
            should.not.exist(err);
            should.exist(results);
            results.should.have.property("geonames").with.length(10);
            _.first(results.geonames).should.have.property("countryCode", "US");            
            done();
        });        
    });    
});