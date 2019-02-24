const mongoose   = require("mongoose"),
      Campground = require("./models/campground"),
      Comment    = require("./models/comment");

const data = [
    {
        "name" : "Salmon Creek",
        "image" : "https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg",
        "description" : "It has many beautiful spots to hike."
    },
    {
        "name" : "Granite Hill",
        "image" : "https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg",
        "description" : "It is one of the peaceful place."
    },
    {
        "name" : "Mountain Goat's Rest",
        "image" : "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        "description" : "This is a go to place, if you're planning to go out with your family/friends."
    },
    {
        "name" : "Ananthagiri Hills",
        "image" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIUW1Ie0abvgJwcP6qxz2e0NlpBJ6n_1Rvs6q_LpJ2c9GWjJvGWA",
        "description" : "one of best trekking spots near by hyderabad"
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            Comment.deleteMany({}, function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("removed comments");
                    //Add a few campgrounds
                    data.forEach(function(seed){
                        Campground.create(seed, function(err, addedCampground){
                            if(err){ 
                                console.log(err);
                            } else {
                                console.log("Added a campground!");
                                //Create a comment
                                let sampleComment = {
                                    text   : "Beautiful place to vist atleast once in lifetime.",
                                    author : "Abhishek Kandi"
                                }
                                Comment.create(sampleComment, function(err, addedComment){
                                    if(err) {
                                        console.log(err);
                                    } else {
                                        addedCampground.comments.push(addedComment);
                                        addedCampground.save();
                                        console.log("Created new comment");
                                    }
                                });
                            }
                        });
                    });
                }
            })
            
        }
    });
}

module.exports = seedDB;