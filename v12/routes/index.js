const express  = require("express"),
      User     = require("../models/user"),
      passport = require("passport"),
      router   = express.Router({ mergeParams: true });

router.get("/",function(req,res){
    res.render("landing");
});

//For registering a user
router.get("/register", function(req, res){
    res.render("register", { page: 'register' });
});

//To create the user
router.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", { error: err.message });
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//To Show login form
router.get("/login", function(req, res){
    res.render("login", { page: 'login' });
});

//To Log in the user
router.post("/login", passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), function(req, res){
    
});

//To Log out the user
router.get("/logout", function(req,res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;