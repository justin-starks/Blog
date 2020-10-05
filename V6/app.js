var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	Campground = require("./models/campground"),
	seedDB= require("./seeds"),
	Comment = require("./models/comment"),
	User = require("./models/user");

	var passport = require("passport"),
		passportLocal = require("passport-local"),
		passportLocalMongoose = require("passport-local-mongoose");


seedDB();
mongoose.connect("mongodb://localhost/yelp_camp", { 
     useNewUrlParser: true,
     useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is my secret",
	resave: false,
	saveUnitialized: false
}));



app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
})

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
app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res)=> {
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

//AUTHORIZATION ROUTES

app.get("/register", (req, res) => {
	res.render("register");
})

// Handle sign up logic

app.post("/register", (req, res) => {
	User.register(new User({ username: req.body.username}), req.body.password, function(err, user) {
			if(err) {
				console.log(err);
				return res.render("register");
			} else {
				passport.authenticate("local")(req,res, function(){
					res.redirect("/campgrounds");
				})
			}
		})
	})

// Show login form
app.get("/login", (req, res) => {
	res.render("login");
})

// Handle login logic
app.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {
	
});

// Handle logout logic
app.get("/logout", (req, res) => {
	req.logout();
	res.redirect("/campgrounds");
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
