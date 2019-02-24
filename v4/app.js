const express    = require("express"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      app        = express(),
      portNumber = 3000,
      Campground = require("./models/campground"),
      Comment    = require("./models/comment"),
      seedDB     = require("./seeds");
      
seedDB();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    //REST CONVENTION - 1 - For fetching campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
        }
    })
})

app.post("/campgrounds", function(req, res){
    //REST CONVENTION - 2 - For adding a new campground
    let campName = req.body.name;
    let campImageUrl = req.body.imageurl;
    let campDescription = req.body.description;
    let newCampObj = {
        name        : campName,
        image       : campImageUrl,
        description : campDescription
    };
    Campground.create(newCampObj,function(err,newlyAddedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

app.get("/campgrounds/new",function(req, res){
    //REST CONVENTION - 3 - Route to page where we collect data for new campground
    res.render("campgrounds/new");
})

app.get("/campgrounds/:id",function(req, res){
    //REST CONVENTION - 4 - Route to specific campground details
    let campId = req.params.id;
    Campground.findById(campId).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    })
})

// ====================================
// COMMENTS ROUTES
// ====================================

app.get("/campgrounds/:id/comments/new", function(req,res){
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    })
})

app.post("/campgrounds/:id/comments", function(req,res){
    let campId = req.params.id;
    let comment = req.body.comment;
    Campground.findById(campId, function(err, foundCampground){
        if(err) {
            console.log(err);
            res.render("/campgrounds");
        } else {
            Comment.create(comment, function(err, addedComment){
                if(err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(addedComment);
                    foundCampground.save();
                    res.redirect("/campgrounds/" + campId)
                }
            })
        }
    })
})

app.listen(portNumber, function(){
    console.log(`YelpCamp Server has started running at port - ${portNumber}`);
})