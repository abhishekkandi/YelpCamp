const express       = require("express"),
      bodyParser    = require("body-parser"),
      mongoose      = require("mongoose"),
      passport      = require("passport"),
      LocalStrategy = require("passport-local"),
      Campground    = require("./models/campground"),
      Comment       = require("./models/comment"),
      User          = require("./models/user"),
      seedDB        = require("./seeds"),
      app           = express(),
      portNumber    = 3000;
      
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "cbhkHKKHJNHFGSUTTY",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

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

app.get("/campgrounds/:id/comments/new", isUserLoggedIn, function(req,res){
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCampground){
        if(err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: foundCampground});
        }
    })
})

app.post("/campgrounds/:id/comments", isUserLoggedIn, function(req,res){
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

// ============================
// AUTH ROUTES
// ============================

//For registering a user
app.get("/register", function(req, res){
    res.render("register");
});

//To create the user
app.post("/register", function(req, res){
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//To Show login form
app.get("/login", function(req, res){
    res.render("login");
});

//To Log in the user
app.post("/login", passport.authenticate("local", { successRedirect: "/campgrounds", failureRedirect: "/login" }), function(req, res){
    
});

//To Log out the user
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isUserLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(portNumber, function(){
    console.log(`YelpCamp Server has started running at port - ${portNumber}`);
});