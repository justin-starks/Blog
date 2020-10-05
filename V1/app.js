var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
		{name: "Lawrenceville Campground", image: "http://www.gwinnettforum.com/wp-content/uploads/2017/07/17.0707.CM-3.jpg" },
		{name: "Shady Grove Campgrounds", image: "https://www.reserveamerica.com/webphotos/originals/PRCG/pid1070700/%7Bpht%7DMain%20page%20-%20Entrance%7Bpht%7D1534392963623.jpg" },
		{name: "Stone Mountain Park", image: "https://www.stonemountainpark.com/-/media/Images/HFE/SMP_COM/Hero/Mobile-Hero/mobile-hero-tentcamp.jpg"},
	{name: "Lawrenceville Campground", image: "http://www.gwinnettforum.com/wp-content/uploads/2017/07/17.0707.CM-3.jpg" },
		{name: "Shady Grove Campgrounds", image: "https://www.reserveamerica.com/webphotos/originals/PRCG/pid1070700/%7Bpht%7DMain%20page%20-%20Entrance%7Bpht%7D1534392963623.jpg" },
		{name: "Stone Mountain Park", image: "https://www.stonemountainpark.com/-/media/Images/HFE/SMP_COM/Hero/Mobile-Hero/mobile-hero-tentcamp.jpg"},
	{name: "Lawrenceville Campground", image: "http://www.gwinnettforum.com/wp-content/uploads/2017/07/17.0707.CM-3.jpg" },
		{name: "Shady Grove Campgrounds", image: "https://www.reserveamerica.com/webphotos/originals/PRCG/pid1070700/%7Bpht%7DMain%20page%20-%20Entrance%7Bpht%7D1534392963623.jpg" },
		{name: "Stone Mountain Park", image: "https://www.stonemountainpark.com/-/media/Images/HFE/SMP_COM/Hero/Mobile-Hero/mobile-hero-tentcamp.jpg"},
	];


// Actual code
app.get("/", (req, res)=> {
	res.render("landing");
})

app.get("/campgrounds", (req, res) => {
	res.render("campgrounds", {campgrounds: campgrounds});
	
});

app.post("/campgrounds", (req, res) => {
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var newCampground = {name: name, image: image};
	campgrounds.push(newCampground);
	//redirect to campgrounds page
	res.redirect("/campgrounds");
})

app.get("/campgrounds/new", (req, res) => {
	res.render("new");
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("Your YelpCamp server has started");
});
