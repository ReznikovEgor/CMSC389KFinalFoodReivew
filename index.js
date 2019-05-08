var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
    res.render('home');
})

app.listen(3000, function() {
    console.log('Listening on port 3000!');
  });

