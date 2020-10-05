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

// EDIT
router.get("/:id/edit", authenticate, (req, res) => {
	// is user logged in
		Campground.findById(req.params.id, (err, foundCampground) => {
			res.render("campgrounds/edit", {campground: foundCampground});
	});
});

// UPDATE

router.put("/:id", authenticate, (req, res) => {
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})


// Destroy campground routes
router.delete("/:id", authenticate, (req, res) => {
	Campground.findByIdAndRemove(req.params.id, (err) => {
		if(err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds")
		}
	})
})



// Middleware
function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

function authenticate(req, res, next) {
	if(req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCampground) => {
		if(err) {
			res.redirect("back")
		} else {
			// is user the owner of campground
			if(foundCampground.author.id.equals(req.user._id)){
				next();

			} else {
				res.redirect("back");
			}
		}
	});
	} else {
		res.redirect("back");
	}
}

module.exports = router;