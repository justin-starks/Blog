var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middlewareObj = {};

// Middleware
middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/login");
	}
}

middlewareObj.authenticate = function(req, res, next) {
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

middlewareObj.authorize = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect("back")
		} else {
			// is user the owner of comment
			if(foundComment.author.id.equals(req.user._id)){
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

module.exports = middlewareObj;