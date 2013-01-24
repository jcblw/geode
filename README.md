# Geode

locations api in node from www.geoname.org

## Install

```shell
npm install geode
```

## Use

you will need an account ~ *its free*
#####[Signup](http://www.geonames.org/login)

```javascript
//include
var geo = new geode('username', {language: 'en', country : 'US'})

geo.search({name :'Riverside'}, function(err, results){
	console.log([err, results])
})
```

