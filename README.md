# Geode

locations api in node from www.geonames.org

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

## Demo

Heres a simple Express App throwing up an api 

####[Demo](http://geode-demo.herokuapp.com/search.json?q=riverside&maxRows=2)

The express code is just

```javascript
var api = new Geode('username', {country: "US", language: 'en'});

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

