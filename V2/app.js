var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp", { 
     useNewUrlParser: true,
     useUnifiedTopology: true});

// Schema setup
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

var Campground = mongoose.model("Campground", campgroundSchema);


// Create a campground

// Campground.create({
// 	name: "Lawrenceville Campground",
// 	image: "http://www.gwinnettforum.com/wp-content/uploads/2017/07/17.0707.CM-3.jpg"
// }, function(err, campground){
// 	if(err) {
// 		console.log("Error!");
// 		console.log(err);
// 	} else {
// 		console.log("Campground added!")
// 		console.log(campground);
// 	}
// });


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



// Actual code
app.get("/", (req, res)=> {
	res.render("landing");
})

// INDEX
app.get("/campgrounds", (req, res) => {
	// Get all the campgrounds
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("index", {campgrounds: campgrounds});
		}
	})
	
	
});

// CREATE
app.post("/campgrounds", (req, res) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = {name: name, image: image, description: desc};

	Campground.create(newCampground, (err, newlyCreated) => {
		if(err) {
			console.log(err);
		}else {
			//redirect to campgrounds page
	res.redirect("/campgrounds");
		}
	})
});

// NEW
app.get("/campgrounds/new", (req, res) => {
	res.render("new");
})

// SHOW
app.get("/campgrounds/:id", (req, res) => {
	// find the campground with the provided ID
	Campground.findById(req.params.id, (err, newCampground) => {
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
		res.render("show", {campground: newCampground});
		}
	});
	
	
})


app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
