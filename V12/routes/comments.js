var express = require("express");
var	router = express.Router({mergeParams: true});
var	Campground = require("../models/campground");
var	Comment = require("../models/comment");
var middleware = require("../middleware")

// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground})
		}
	})
})

// Comments create
router.post("/", middleware.isLoggedIn, (req, res)=> {
	Campground.findById(req.params.id, (err, campground) => {
		if(err){
			req.flash("success", "Something Went Wrong");

			res.redirect("/campgrounds")
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err)
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save()
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Comment Sucessfully Posted");

					res.redirect("/campgrounds/" + campground._id);
				}
			})
		}
	})
})

// EDIT ROUTE FOR COMMENTS
router.get("/:comment_id/edit", middleware.authorize, (req, res) => {
	Comment.findById(req.params.comment_id, (err, foundComment) => {
		if(err) {
			res.redirect("back")
		} else {
			req.flash("success", "Comment Sucessfully Edited");

			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});

		}
	})
})

// COMMENT UPDATE ROUTE
router.put("/:comment_id", middleware.authorize, (req, res) => {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
		if(err) {
			res.redirect("back")
		} else {
			req.flash("success", "Comment Sucessfully Updated");
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})

// DESTROY ROUTE
router.delete("/:comment_id", middleware.authorize, (req, res) => {
	Comment.findByIdAndRemove(req.params.comment_id, (err) => {
		if(err) {
			res.redirect("back")
		} else {
			req.flash("error", "Comment Sucessfully Deleted");
			res.redirect("/campgrounds/" + req.params.id)
		}
	})
})




module.exports = router;
