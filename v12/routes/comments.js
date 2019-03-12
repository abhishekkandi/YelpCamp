const express    = require("express"),
      Campground = require("../models/campground"),
      Comment    = require("../models/comment"),
      middleWare = require("../middleware"),
      router     = express.Router({ mergeParams: true });

//Create comment form
router.get("/new", middleWare.isUserLoggedIn, function(req,res){
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    })
})

//Creating comment
router.post("/", middleWare.isUserLoggedIn, function(req,res){
    let campId = req.params.id;
    let comment = req.body.comment;
    Campground.findById(campId, function(err, foundCampground){
        if(err) {
            console.log(err);
            res.render("/campgrounds");
        } else {
            Comment.create(comment, function(err, addedComment){
                if(err) {
                    req.flash("error","Something went wrong");
                    console.log(err);
                } else {
                    //Add username and id to comment
                    addedComment.author.id = req.user._id;
                    addedComment.author.username = req.user.username;
                    //save comment
                    addedComment.save();
                    foundCampground.comments.push(addedComment);
                    foundCampground.save();
                    req.flash("success","Successfully added comment");
                    res.redirect("/campgrounds/" + campId)
                }
            })
        }
    })
})

//EDIT COMMENT FORM
router.get("/:comment_id/edit", middleWare.checkCommentOwnerShip, function(req, res){
    let campId = req.params.id;
    let commentId = req.params.comment_id;
    Comment.findById(commentId, function(err, foundComment){
        if(err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", { campground_id: campId, comment: foundComment });
        }
    })
})

//UPDATE COMMENT
router.put("/:comment_id", middleWare.checkCommentOwnerShip, function(req, res){
    let campId = req.params.id;
    let commentId = req.params.comment_id;
    let comment = req.body.comment;
    Comment.findByIdAndUpdate(commentId, comment, function(err, updatedComment){
        if(err) {
            res.redirect("back");
        } else {
            res.redirect(`/campgrounds/${campId}`)
        }
    })
})

//REMOVING THE COMMENT
router.delete("/:comment_id", middleWare.checkCommentOwnerShip, function(req,res){
    let campId = req.params.id;
    let commentId = req.params.comment_id;
    Comment.findByIdAndRemove(commentId, function(err){
        if(err) {
            res.redirect("back");
        } else {
            req.flash("success","Comment deleted.");
            res.redirect(`/campgrounds/${campId}`);
        }
    })
})

module.exports = router;