// Using Express Router -> refactoring. router is a standard name to use.
var express = require("express");
var router  = express.Router();

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware"); //and not middleware/index.js(not compulsory, but its easier to type anyway)


// ==============
// Comment Routes
// ==============

//Comments New
router.get("/campgrounds/:id/comments/new",middleware.isLoggedIn, function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {campground: campground});
        }
    })
});
// Comments Create
router.post("/campgrounds/:id/comments",middleware.isLoggedIn, function(req, res){
   //lookup campground using ID
   Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        Comment.create(req.body.comment, function(err, comment){	   //create new comment
           if(err){
			   req.flash("error", "Something went wrong");
               console.log(err);
           } else {
			   // add username and id to comment
			   // As per datastructure of models/comment.js
			   comment.author.id = req.user._id;
			   comment.author.username = req.user.username; //see campgrounds.js for alternate way 
			   // save comment
			   comment.save();
               campground.comments.push(comment);	   //connect new comment to campground
               campground.save();
			   req.flash("success", "Successfully added comment");
               res.redirect('/campgrounds/' + campground._id);	   //redirect campground show page
           }
        });
       }
   });
});

// Comment EDIT Route
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err || !foundCampground){
			req.flash("error", "Comment not found");
			return res.redirect("back");
		}
		
			Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.redirect("back");
			} else {
				res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
			}
		});

	});
	
});

// Comment UPDATE Route
router.put("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated successfully");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// Comment DESTROY Route 
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
		   req.flash("error", "Something went wrong");
           res.redirect("back");
       } else {
		   req.flash("success", "Comment removed successfully");
           res.redirect("/campgrounds/" + req.params.id); //same as "back" from above-> both go to show page again after comment deleted.
       }
    });
});



module.exports = router;