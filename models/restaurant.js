var mongoose = require('mongoose');

var reviewSchema = new mongoose.Schema({
    restaurantName:{
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 0.0,
        max: 10.0,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
});

var descriptionSchema = new mongoose.Schema({
    description:{
        type: String,
        required: true
    }, 
    cuisine: {
        type: String,
        required: true
    },
    priceRange: {
        type: Number,
        min: 1,
        max: 3,
        required: true
    }
});

var restaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    avgRating: {
        type: Number,
        required: true
    },
    description: descriptionSchema,
    reviews: [reviewSchema]
});

var Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;