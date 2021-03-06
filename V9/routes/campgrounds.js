var express = require("express");
var	router = express.Router();
var	Campground = require("../models/campground");

// INDEX
router.get("/", (req, res) => {
	// Get all the campgrounds
	Campground.find({}, (err, campgrounds) => {
		if(err) {
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: campgrounds});
		}
	})
	
	
});

// CREATE
router.post("/", isLoggedIn, (req, res) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, image: image, description: desc, author: author};
	

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
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");
})

// SHOW
router.get("/:id", (req, res) => {
	// find the campground with the provided ID
	Campground.findById(req.params.id).populate("comments").exec((err, newCampground) => {
		if(err){
			console.log(err);
		} else {
			// render show template with that campground
		res.render("campgrounds/show", {campground: newCampground});
		}
	});
	
	
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;