var express = require("express"),
	app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	methodOverride = require("method-override"),
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

mongoose.connect(process.env.DATABASEURL || "mongodb://localhost/yelp_camp");






app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seedDB();

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
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})


app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);





app.listen(process.env.PORT || 2800, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
