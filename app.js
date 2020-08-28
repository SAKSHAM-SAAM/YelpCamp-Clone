var express       = require("express");
var app           = express();
var bodyParser    = require("body-parser");
var mongoose      = require("mongoose");
var passport      = require("passport");
var LocalStrategy = require("passport-local");
var User          = require("./models/user");
var Campground    = require("./models/campground");
var Comment       = require("./models/comments");
var methodOverride= require("method-override");
var seedDB        = require("./seed");
var session       = require("express-session");
var flash         = require("connect-flash");

var commentRoute   = require("./route/comment");
var authRoute      = require("./route/index");
var campgroundRoute= require("./route/campground");

//mongoose.connect("mongodb://localhost:27017/yelp_camp_2", {useNewUrlParser: true});
mongoose.connect("mongodb://saksham:simple@ds131737.mlab.com:31737/heroku_3bxfwfkj");
//mongodb+srv://saksham:simple@cluster0-gment.mongodb.net/test?retryWrites=true&w=majority

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(express.static("images"));
app.use(bodyParser.urlencoded({extended: true}) );
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();

//Passport configuration

app.use(session({
    secret:"SAAM Corporation",
    resave: true,
    saveUninitialized: true
}));
app.use(express.static("public"));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user ;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use(authRoute);
app.use(campgroundRoute);
app.use(commentRoute);

//ROUTES
app.get("/",function(req, res){ 
    res.render("landing");
});

//server lister

app.listen(3000, function(){
    console.log("YELPCAMP SERVER ONLINE:");
})