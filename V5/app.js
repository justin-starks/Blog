var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB= require("./seeds"),
	Comment = require("./models/comment");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { 
     useNewUrlParser: true,
     useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));



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
			res.render("campgrounds/index", {campgrounds: campgrounds});
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
	res.render("campgrounds/new");
})

// SHOW
app.get("/campgrounds/:id", (req, res) => {
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

//=========================================
//COMMENTS ROUTES
//=======================================
app.get("/campgrounds/:id/comments/new", (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

app.post("/campgrounds/:id/comments", (req, res)=> {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err)
				} else {
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
})



app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
