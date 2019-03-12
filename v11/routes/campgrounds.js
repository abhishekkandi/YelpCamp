const express    = require("express"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleWare = require("../middleware"),
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

router.post("/", middleWare.isUserLoggedIn, function(req, res){
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

router.get("/new", middleWare.isUserLoggedIn, function(req, res){
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

//EDIT CAMPGROUND
router.get("/:id/edit", middleWare.isCampgroundOwnerLoggedIn, function(req, res){
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCampground){
        res.render("campgrounds/edit",{ campground: foundCampground });      
    })
})

//UPDATE CAMPGROUND
router.put("/:id", middleWare.isCampgroundOwnerLoggedIn, function(req, res){
    let campId = req.params.id;
    let campground = req.body.campground;
    //find and update the correct campground
    Campground.findByIdAndUpdate(campId, campground, function(err, updatedCampground){
        if(err) {
            res.redirect("/campgrounds");
        } else {
            //redirect show page
            res.redirect(`/campgrounds/${campId}`)
        }
    })
})

//Removing Campground Route
router.delete("/:id", middleWare.isCampgroundOwnerLoggedIn, function(req, res){
    let campId = req.params.id;
    Campground.findByIdAndRemove(campId, function(err, removedCampground){
        if(err){
            res.redirect("/campgrounds")
        } else {
            Comment.deleteMany({ _id: { $in: removedCampground.comments} }, function(err){
                if(err){
                    console.log(err);
                }
                res.redirect("/campgrounds");
            })
            
        }
    })
})

module.exports = router;
