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

// Requiring routes
var commentRoutes = require("./routes/comments");
var	campgroundRoutes = require("./routes/campgrounds");
var	indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost/yelp_camp", { 
     useNewUrlParser: true,
     useUnifiedTopology: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

//PASSPORT CONFIGURATION

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


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
