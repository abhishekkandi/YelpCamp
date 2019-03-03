const express    = require("express"),
      Campground = require("../models/campground"),
      router     = express.Router({ mergeParams: true });

router.get("/", function(req,res){
    //REST CONVENTION - 1 - For fetching campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds })
        }
    })
})

router.post("/", isUserLoggedIn, function(req, res){
    //REST CONVENTION - 2 - For adding a new campground
    let campName = req.body.name;
    let campImageUrl = req.body.imageurl;
    let campDescription = req.body.description;
    let author = {
        id      : req.user._id,
        username: req.user.username
    }
    let newCampObj = {
        name        : campName,
        image       : campImageUrl,
        description : campDescription,
        author      : author
    };
    Campground.create(newCampObj,function(err,newlyAddedCampground){
        if(err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    })
})

router.get("/new", isUserLoggedIn, function(req, res){
    //REST CONVENTION - 3 - Route to page where we collect data for new campground
    res.render("campgrounds/new");
})

router.get("/:id",function(req, res){
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

function isUserLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;
