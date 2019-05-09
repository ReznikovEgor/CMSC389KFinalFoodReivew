var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var restaurant = require('./models/restaurant');
var dotenv = require('dotenv');
var url = process.env.MONGOLAB_URI;

var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


// Connect to MongoDB
console.log(process.env.MONGODB);
mongoose.connect('mongodb://localhost/cluster0');
// mongoose.connect(process.env.MONGODB,{ useNewUrlParser: true }, function(err, db) {
//     if (err) {
//         throw err;
//     } else {
//         console.log("successfully connected to the database");
//     }
//     db.close();
// });
//mongoose.connect(process.env.MONGODB);

mongoose.connection.on('error', function() {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

app.get('/', function(req, res) {
    res.render('home');
})

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});

