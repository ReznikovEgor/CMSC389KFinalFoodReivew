# CMSC389KFinalFoodReivew
Egor Reznikov, Sean Chapman, Deep Patel

---

Names: Egor Reznikov, Sean Chapman, Deep Patel

Date: May 10th, 2019

Project Topic: Local Restaurant Reviews

URL: [Link to website] (http://terpfoodreview.herokuapp.com)

URL: [Link to github] (https://github.com/ReznikovEgor/CMSC389KFinalFoodReivew)


 ---

### 1. Data Format and Storage

Data Stored using MongoDB

Schemas: 
```javascript
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
```

```javascript
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
```
```javascript
var restaurantSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    avgRating: {
        type: Number,
    },
    description: descriptionSchema,
    reviews: [reviewSchema]
});
````

### 2. Add New Data

HTML form route: `/addRestaurant`

POST endpoint route: `/createRestaurant`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var rest = { 
    method: 'POST',
    url: 'http://localhost:3000/createRestaurant',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: 'Maryland Dairy', 
        avgRating: 0,
        description: {
        	description: {'Ice Cream'},
        	cuisine: {'American'},
        	priceRange: {1},
        	reviews: {
        		restaurantName: "Maryland Dairy",
        		rating: "10.0",
        		review: "Amazing Ice Cream!",
        		author: "Bob Shmob"
        	}
    } 
};

request(rest, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

### 3. NPM Packages
1. 'express'
2. 'body-parser'
3. 'morgan'
4. 'mongoose'
5. 'express-handlebars'
6. 'dotenv'
7. 'underscore'
8. 'node-emoji' (NEW)
9. 'buzzphrase' (NEW)


### 4. Search Data

Search Field: `restaurantName`

### 5. Endpoints

Navigation Filters
1. Home -> `/`
2. Sorted by Cheapest -> `/cheapest`
3. Sorted by rating -> `/topRestaurants`
4. About -> `/about`
5. Create Review(POST) -> `'/restaurant/:name/createReview'`
6. Delete Review -> `'/restaurant/:name/:id/removeReview'`
7. Delete Restaurant -> `'/restaurant/:name/removeRestaurant'`
8. Create Restaurant(POST) -> `/createRestaurant'
9. Get Retaurant -> `'/restaurant/:name'`
10. Add Restaurant -> `/addRestaurant`


### 6. Sockets

1. Restaurants
2. Reviews
