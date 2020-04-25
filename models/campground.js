var mongoose = require("mongoose");
// var Comment = require("./comment");
// var Review = require("./review");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
   name: String,
   cost: Number,
   image: String,
   description: String,
   createdAt: {type: Date, default: Date.now},
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"  //name of the comment.js created model
      }
   ],
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    rating: {
        type: Number,
        default: 0
    },
	likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]
});


// var Campground = mongoose.model("Campground", campgroundSchema);
module.exports = mongoose.model("Campground", campgroundSchema);