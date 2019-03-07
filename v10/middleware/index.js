const Campground       = require("../models/campground"),
      Comment          = require("../models/comment"),
      middleWareObject = {};

middleWareObject.isUserLoggedIn = function(req, res, next){

    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");

}

middleWareObject.isCampgroundOwnerLoggedIn = function (req, res, next){

    if(req.isAuthenticated()){
        let campId = req.params.id;
        Campground.findById(campId, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                /*
                    1) foundCampground.author.id -- It's an mongoose obect
                    2) req.user.id -- It's a string
                    3) 'equals' mongoose provides this
                */
                if(foundCampground.author.id.equals(req.user.id)){
                    next();
                } else {
                    res.redirect("back");    
                }
            }
        })
    } else {
        res.redirect("back");
    }

}

middleWareObject.checkCommentOwnerShip = function (req, res, next){

    if(req.isAuthenticated()){
        let commentId = req.params.comment_id;
        Comment.findById(commentId, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                } else {
                    res.redirect("back");    
                }
            }
        })
    } else {
        res.redirect("back");
    }

}

module.exports = middleWareObject;