const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const portNumber = 3000;
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({ extended:true }))

const campgroundsData = [
    { name: `Salmon Creek`, image: `https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg` },
    { name: `Granite Hill`, image: `https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg` },
    { name: `Mountain Goat's Rest` , image: `https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg` },
    { name: `Salmon Creek`, image: `https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg` },
    { name: `Granite Hill`, image: `https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg` },
    { name: `Mountain Goat's Rest` , image: `https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg` },
    { name: `Salmon Creek`, image: `https://farm9.staticflickr.com/8457/7930235502_df747573ca.jpg` },
    { name: `Granite Hill`, image: `https://farm2.staticflickr.com/1363/1342367857_2fd12531e7.jpg` },
    { name: `Mountain Goat's Rest` , image: `https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg` }
];

app.get("/",function(req,res){
    res.render("landing");
})

app.get("/campgrounds", function(req,res){
    //REST CONVENTION - 1 - For fetching campgrounds
    res.render("campgrounds", { campgrounds: campgroundsData })
})

app.post("/campgrounds", function(req, res){
    //REST CONVENTION - 2 - For adding a new campground
    let campName = req.body.name;
    let campImageUrl = req.body.imageurl;
    let newCampObj = {
        name: campName,
        image: campImageUrl
    };
    campgroundsData.push(newCampObj);
    res.redirect("/campgrounds");
})

app.get("/campgrounds/new",function(req, res){
    //REST CONVENTION - 3 - Route to page where we collect data for new campground
    res.render("new");
})

app.listen(portNumber, function(){
    console.log(`YelpCamp Server has started running at port - ${portNumber}`);
})