const express    = require("express"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      app        = express(),
      portNumber = 3000;
      

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});

const campgroundSchema = new mongoose.Schema({
    name         : String,
    image        : String,
    description  : String
});
const Campground = mongoose.model("Campground",campgroundSchema);


app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    //REST CONVENTION - 1 - For fetching campgrounds
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("index", { campgrounds: allCampgrounds })
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
    res.render("new");
})

app.get("/campgrounds/:id",function(req, res){
    //REST CONVENTION - 4 - Route to specific campground details
    let campId = req.params.id;
    Campground.findById(campId, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("show", { campground: foundCampground });
        }
    })
})

app.listen(portNumber, function(){
    console.log(`YelpCamp Server has started running at port - ${portNumber}`);
})