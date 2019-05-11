var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var exphbs = require('express-handlebars');
var Restaurant = require('./models/restaurant');
var dotenv = require('dotenv');
var _ = require('underscore');
var emoji = require('node-emoji');
var buzzphrase = require('buzzphrase');
var functions = require("./function");
var roundNums = require("./roundNum");
// var http = require('http').Server(app);
// var io = require('socket.io')(http);



var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function(socket) {
    console.log('NEW connection.');
    socket.on('disconnect', function(){
        console.log('Oops. A user disconnected.');
  });
});


// Connect to MongoDB
const uri = "mongodb://reznikov:GyX3kVtAYT2nphp5@cluster0-shard-00-00-w6rkg.mongodb.net:27017,cluster0-shard-00-01-w6rkg.mongodb.net:27017,cluster0-shard-00-02-w6rkg.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"
mongoose.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
});

var _DATA;
Restaurant.find({}, function(err, restaurants) {
    if (err) return console.error(err);
    _DATA = restaurants;
});

//Home page
app.get('/', function(req, res) {
    Restaurant.find({}, function(err, restaurants) {
        if (err) return console.error(err);
        _DATA = restaurants;
    });
    res.render('home', {
        title: "All Local Restaurants " + emoji.get(':fork_and_knife:'),
        buzz: buzzphrase.get(),
        data: _DATA
    });
})

app.get('/restaurant/:name', function(req, res) {
    var _name = req.params.name;
    Restaurant.findOne({name: _name}, function(err, restaurant) {
        if(err) throw err
        if(!restaurant) return res.send("No restaurant of name exists")

        res.render('restaurant', {
            data: restaurant,
            revData: restaurant.reviews
        });
    });
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
        description: description,
        reviews: []
    })
    restaurant.save(function(err) {
        if(err) throw err
        io.emit('new restaurant', restaurant);
    })
    res.redirect('/restaurant/' + restaurant.name);
})

app.get('/restaurant/:name/addReview', function(req, res){
    var _name = req.params.name;
    Restaurant.findOne({name: _name}, function(err, restaurant) {
        if(err) throw err
        if(!restaurant) return res.send("No restaurant of name exists")
        res.render('reviewform', {
            data: restaurant
        });
    });
})

app.delete('/restaurant/:name/removeRestaurant', function(req, res) {
    var urlName = req.params.name;
    var resName = decodeURI(urlName);
    Restaurant.findOneAndDelete({name:resName}, function(err, restaurant){
        if(!restaurant) return res.send("Not Deleted");
        res.redirect(303, '/');
    })
});

app.delete('/restaurant/:name/:id/removeReview', function(req, res) {
    var urlName = req.params.name;
    var resName = decodeURI(urlName);
    var revid = req.params.id;
    Restaurant.findOne({name:resName}, function(err, restaurant){
        for(var i = 0; i < restaurant.reviews.length; i++){
            if (restaurant.reviews[i].id == revid){
                var oldSum = (restaurant.avgRating)*(restaurant.reviews.length);
                var valToRemove = restaurant.reviews[i].rating;
                restaurant.reviews.splice(i,1);
                if(restaurant.reviews.length != 0){
                var length = restaurant.reviews.length;
                var avg = functions.removeReviewAvg(valToRemove, oldSum, length);
                restaurant.avgRating = roundNums.roundNum(avg);
                } else{
                    restaurant.avgRating = 0;
                }
                restaurant.save(function(err){
                    if(err) throw err
                })
                res.redirect(303, '/restaurant/'+restaurant.name)
            }
        }
    })
});

app.post('/restaurant/:name/createReview', function(req, res){
    var urlName = req.params.name;
    var resName = decodeURI(urlName);
    Restaurant.findOne({name:resName}, function(err, restaurant){
        if (err) return console.error(err);
    var review = {
        restaurantName: resName,
        rating: req.body.rating,
        review: req.body.review,
        author: req.body.author
    }
    restaurant.reviews = restaurant.reviews.concat([review]);
    var addedAvg = parseInt(review.rating);
    var currAvg = restaurant.avgRating;
    var length = restaurant.reviews.length;
    var avg = functions.addReviewAvg(addedAvg,currAvg,length);
    restaurant.avgRating = roundNums.roundNum(avg);
    restaurant.save(function(err) {
        if(err) throw err
        io.emit('new review', review);
    });
});
var returnURL = '/restaurant/'+urlName;
    res.redirect(returnURL);
})

app.get('/topRestaurants', function(req,res) {
    Restaurant.find({}, function(err, restaurants) {
        if (err) return console.error(err);
        _DATA = restaurants;
        var map = new Map();
        _.each(_DATA, function(i) {
            map.set(i.name, i.avgRating);
       })
       map[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
       }
       var data_sorted = [];
       for (let [key, value] of map) {     // get data sorted
           var restaurant = _.findWhere(_DATA, {name: key});
           data_sorted.push(restaurant);
       }
       data_sorted.reverse();
       res.render('home', {
           title: "Top Rated " + emoji.get(':fire:'),
           buzz: buzzphrase.get(),
           data: data_sorted
       })
    })
});

app.get('/cheapest', function(req,res) {
    Restaurant.find({}, function(err,restaurants) {
        if (err) return console.error(err);
        _DATA = restaurants;
        var map = new Map();
        _.each(_DATA, function(i) {
            map.set(i.name, i.description.priceRange)
        })

        map[Symbol.iterator] = function* () {
            yield* [...this.entries()].sort((a, b) => a[1] - b[1]);
       }
       var data_sorted = [];
       for (let [key, value] of map) {     // get data sorted
           var restaurant = _.findWhere(_DATA, {name: key});
           data_sorted.push(restaurant);
       }
       res.render('home', {
           title: "Cheapest " + emoji.get(':money_with_wings:'),
           buzz: buzzphrase.get(),
           data: data_sorted 
       })
    })
})

app.get('/about', function(req, res) {
    res.render('about');
})

http.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
