// Using Express Router
var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");
var Campground = require("../models/campground");
var nodemailer = require('nodemailer');
var async = require('async');
var crypto = require('crypto');

// Welcome mail using Mailgun
var api_key = 'bc529046db0e651088d6bb6f321a3d5e-f135b0f1-79fd5036';
var domain = 'sandbox6aa8dec610f646dba1ddfa5b755425e4.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 

router.get("/", function(req, res){
    res.render("landing");
});

// ==============
// AUTH Routes
// ==============

// Show register form
router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

// Handle signup logic
router.post("/register", function(req,res){
  	var newUser = new User({
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        avatar: req.body.avatar
      });
	
	if(req.body.adminCode === "acidreign123"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req,res, function(){
			req.flash("success", "Welcome to Booki, " + user.username + "!");
			res.redirect("/campgrounds");
		});
	});
	
	var data = {
	  from: 'HariHaran <haran465@gmail.com>',
	  to:  req.body.email,
	  subject: 'Welcome to Booki',
	  text: 'Hi there! This is a Web Development project done from scratch by B.Hariharan. It is a mini working model of an online Hotel review application. Check the INFO Tab in the application to find out how I made this. Cheerios! Happy Coding :) '
	};

	mailgun.messages().send(data, function (error, body) {
	  if(error){
		  console.log(error);
		  req.flash("error", "Something unexpected occured");
		  res.redirect("/campgrounds");
	  } else {
		  req.flash("success", "Thank you for joining Booki. Please check your email for further instructions || ");
	  }
	
	});
});

// Show login form
router.get("/login", function(req, res){
   res.render("login", {page: 'login'}); 
});

//Handling login logic - app.post("/login", middleware, callback)
router.post("/login", passport.authenticate("local", 
	{
		successRedirect: "/campgrounds", 
		failureRedirect: "/login"
	}), function(req,res){
	
});

// Log out route
router.get("/logout", function(req,res){
	req.logout();
	req.flash("success", "Successfully logged out!");
	res.redirect("/");
});

// User Profile
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Campground.find().where('author.id').equals(foundUser._id).exec(function(err, campgrounds) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("users/show", {user: foundUser, campgrounds: campgrounds});
    })
  });
});

module.exports = router;