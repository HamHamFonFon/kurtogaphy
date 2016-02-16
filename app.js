//http://makerlog.org/posts/leaflet-basics/
/**
 * Appel des modules
 * @type {*|exports|module.exports}
 */
// Express
var express = require('express');
var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res) {
    res.render('map', {
        title: 'Where is my Kat ? - A kuzzle coding challenge'
    });
});

app.post('/add-a-cat', function(req, res) {
    //console.log('body: ' + JSON.stringify(req.body));
    //res.send(req.body);
});


// Choix du port 9966 pour avoir le même que pour browserfy
app.listen(9966);
