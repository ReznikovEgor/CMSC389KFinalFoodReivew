var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var Restaurant = require('./models/restaurant');
var dotenv = require('dotenv');

var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


// Connect to MongoDB
const uri = "mongodb://reznikov:GyX3kVtAYT2nphp5@cluster0-shard-00-00-w6rkg.mongodb.net:27017,cluster0-shard-00-01-w6rkg.mongodb.net:27017,cluster0-shard-00-02-w6rkg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
});

app.get('/', function(req, res) {
    res.render('home');
})

app.get('/restaurant/:restaurantname', function(req, res) {
    //To be implemented
})

//Called when a user presses the 'Add a restaurant' button
app.get('/addRestaurant', function(req, res) {
    res.render('restaurantform')
})

//Called when a user presses the 'Submit' button
app.post('/createRestaurant', function(req, res) {
    var description = {
        description: req.body.description,
        cuisine: req.body.cuisine,
        priceRange: req.body.pricerange
    }
    var restaurant = new Restaurant({
        name: req.body.restaurantname,
        avgRating: 0,
        description: [description],
        reviews: []
    })
    restaurant.save(function(err) {
        if(err) throw err
        return res.send("Restaurant added successfully!")
    })
})

app.listen(3000, function() {
    console.log('Listening on port 3000!');
});

