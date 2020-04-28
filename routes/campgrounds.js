// Using Express Router
var express = require("express");
var router  = express.Router();

var Campground = require("../models/campground");
// Back out from routes dir(../)->reached YelpCamp dir->middleware/index.js
//By naming middleware module as index.js, we only call middleware as the default main file in ANY directory is always index.js
var Comment = require("../models/comment");
var Review = require("../models/review");
var middleware = require("../middleware"); //and not middleware/index.js

// Google Maps
// var NodeGeocoder = require('node-geocoder');
 
// var options = {
//   provider: 'google',
//   httpAdapter: 'https',
//   apiKey: process.env.GEOCODER_API_KEY,
//   formatter: null
// };
 
// var geocoder = NodeGeocoder(options);

//INDEX - show all campgrounds -> req.user has info on id and name of the current user
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
	// console.log(req.user)
	if(req.query.search){ // implementing FUZZY search
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
			 Campground.find({name: regex}, function(err, allCampgrounds){
		   if(err){
			   console.log(err);
		   } else {
			  if(allCampgrounds.length < 1){
				req.flash("error", "Hotel not found");
				res.redirect("/campgrounds");
			  } else {
				res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
			  }
		   }
		});
	} else{
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds: allCampgrounds, page: 'campgrounds'});
       }
    });
	}
});


// CREATE - add new campground to DB 
router.post("/campgrounds",middleware.isLoggedIn, function(req, res){
 // get data from form and add to campgrounds array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, price: price, image: image, description: desc, author:author}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//NEW - show form to create new campground
router.get("/campgrounds/new",middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
     Campground.findById(req.params.id).populate("comments likes").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

// Campground Like Route
router.post("/campgrounds/:id/like", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        // check if req.user._id exists in foundCampground.likes
        var foundUserLike = foundCampground.likes.some(function (like) {
            return like.equals(req.user._id);
        });

        if (foundUserLike) {
            // user already liked, removing like
            foundCampground.likes.pull(req.user._id);
        } else {
            // adding the new user like
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(function (err) {
            if (err) {
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});


// EDIT Campground Route - create form //touch views/campgrounds/edit.ejs
router.get("/campgrounds/:id/edit",middleware.checkCampgroundOwnership, function(req, res){
		Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
   	       });
});

// UPDATE CAMPGROUND ROUTE - Submit form	 

router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    delete req.body.campground.rating;
    // find and update the correct campground
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            campground.name = req.body.campground.name;
            campground.description = req.body.campground.description;
            campground.image = req.body.campground.image;
            campground.save(function (err) {
                if (err) {
                    console.log(err);
                    res.redirect("/campgrounds");
                } else {
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res, next){
   Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            // deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function (err) {
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                // deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function (err) {
                    if (err) {
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                    //  delete the campground
                    campground.remove();
                    req.flash("success", "Hotel deleted successfully!");
                    res.redirect("/campgrounds");
                });
            });
        }
    });
});


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;
