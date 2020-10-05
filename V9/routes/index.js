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
	res.redirect("/campgrounds");
})


function isLoggedIn(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

module.exports = router;