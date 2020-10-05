var express = require("express");
var	router = express.Router();
var	passport = require("passport");
var	User = require("../models/user");


// Root route
router.get("/", (req, res)=> {
	res.render("landing");
})


//AUTHORIZATION ROUTES

// Register form route
router.get("/register", (req, res) => {
	res.render("register");
})

// Handle sign up logic
router.post("/register", (req, res) => {
	User.register(new User({ username: req.body.username}), req.body.password, function(err, user) {
			if(err) {
				req.flash("error", err.message);
				res.redirect("/register");
			} else {
				passport.authenticate("local")(req,res, function(){
					req.flash("success", "Welcome to YelpCamp " + user.username);

					res.redirect("/campgrounds");
				})
			}
		})
	})

// Show login form
router.get("/login", (req, res) => {
	res.render("login");
})

// Handle login logic
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}), (req, res) => {
	
});

// Handle logout logic
router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "Sucessfully logged out");
	res.redirect("/campgrounds");
})




module.exports = router;