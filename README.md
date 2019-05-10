# CMSC389KFinalFoodReivew
Egor Reznikov, Sean Chapman, Deep Patel

---

Names: Egor Reznikov, Sean Chapman, Deep Patel

Date: May 10th, 2019

Project Topic: Local Restaurant Reviews

URL: 
 ---

### 1. Data Format and Storage

Data point fields:
- `Field 1`: Name               `Type: String`
- `Field 2`: Breed              `Type: String`
- `Field 3`: Weight             `Type: Number`
- `Field 4`: Age                `Type: Number`
- `Field 5`: Characteristics    `Type: [String]`

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

### 3. View Data
 
GET endpoint route: `/api/...`

### 4. Search Data

Search Field: `name`

### 5. Navigation Pages

Navigation Filters
1. Home -> `/`
2. Sorted by Cheapest -> `/cheapest`
3. Sorted by rating -> `/topRestaurants`
4. about -> `/about`
5. Alphabetical Dogs -> `/alphabetical`