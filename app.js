	var express    = require("express"),
	app            = express(),
	bodyParser     = require("body-parser"),
	Campground     = require("./models/campground"),
	passport       = require("passport"),
	flash          = require("connect-flash"),
	methodOverride = require("method-override"),
	LocalStrategy  = require("passport-local"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds"),
	mongoose       = require("mongoose");

//All dependencies 
var commentRoutes    = require("./routes/comments"),
	campgroundRoutes = require("./routes/campgrounds"),
	reviewRoutes     = require("./routes/reviews"),
	indexRoutes       = require("./routes/index")

// To avoid all mongoose deprecations I used these global statements.
// To see how code looks without modularity and refactoring see YelpCamp Github v2

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/yelp_camp");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");	
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// Seed the database
// seedDB();


// Campground.create( [ALL OF THE COMMENTED CODES ARE REDUNDANT AND BELONG TO v1]
// 	{
// 		name: "Mountain Goat's Rest", 
// 		image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg",
// 		description: "At the peak of a beautiful hilltop, surrounded by pastures and Mountain Goats. Fully Furnished and available."
// 	}, 
// 	function(err,campground){
// 	if(err){
// 		console.log(err);
// 	} else {
// 		console.log("Campground Created!");
// 		console.log(campground);
// 	}
// });
// Below is the hardcoded version using array for storage instead of a DB.
// var campgrounds = [
//      {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
// 		{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
// 		{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
// 		{name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
// 		{name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
// 		{name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
// ];
    
app.locals.moment = require("moment");

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hari will succeed in life by hardwork",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// To add currentUser: req.user to all routes using middleware, so no need to type it into every route (check INDEX route) for eg.
//Somehow code works fine without adding this middleware also.
app.use(function(req,res, next){
	res.locals.currentUser = req.user;
	next();
});

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error =  req.flash("error");	
   res.locals.success =  req.flash("success");	
   next();
});

// All code has been refactored and moduled. See v6 Colt for un-refactored code.
app.use(commentRoutes);
app.use(campgroundRoutes);
app.use(indexRoutes);

// Used routes shortcut only for reviews. Instead of typing routes url again and again in routes/reviews.js, we define the
// Common repeated URL here for simplicity
app.use("/campgrounds/:id/reviews", reviewRoutes);

//To listen to requests (start server)
app.listen(3000, function() { 
  console.log('Server listening on port 3000'); 
});