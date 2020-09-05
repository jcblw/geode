# Geode

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/geode.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/jcblw/geode.svg?branch=master)](https://travis-ci.org/jcblw/geode)[![Coverage Status](https://coveralls.io/repos/github/jcblw/geode/badge.svg?branch=master)](https://coveralls.io/github/jcblw/geode?branch=master)

Locations API in node from www.geonames.org

## Install

```shell
npm install geode
```

## Use

You will need an account ~ *its free* ([signup](http://www.geonames.org/login)).

```javascript
//include
var geo = new geode('username', {language: 'en', countryCode : 'US'})

geo.search({name :'Riverside'}, function(err, results){
	console.log([err, results])
})
```

## Demo

Here is a simple Express App throwing up an API. (see [demo](http://geode-demo.herokuapp.com/search.json?q=riverside&maxRows=2)).

The express code is just

```javascript
var api = new Geode('username', {countryCode: "US", language: 'en'});

app.get('/:collection.:format', function(req, res){
  if(req.params.collection && req.params.format){
    api[req.params.collection](req.query, function(err, collection){
      res[req.params.format]({status : 200, results : collection});
    });
  }else{
    res.send('404');
  }
})
```

## Testing

Make sure to install the development dependecies `npm install --dev` and then run.

```
USER=yourusername npm test
```
