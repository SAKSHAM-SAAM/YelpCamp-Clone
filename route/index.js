var express  = require("express");
var router   = express.Router();
var passport = require("passport");
var User     = require("../models/user");

router.get("/register", function(req, res){
    res.render("Auth/register");
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser , req.body.password , function(err, user){
        if(err){
            req.flash("error", err.message );
            return res.redirect("/register");
        } 
        //redirecting auth:_checked
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "WELCOME TO YELPCAMP " + req.body.username)
                res.redirect("/campground");
            });
    });
});

router.get("/login", function(req, res){
    res.render("Auth/login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect:"/campground",
    failureRedirect:"/login"
}) ,function(req, res){
    req.flash("success", "LOGGED IN");
});

router.get("/logout", function(req, res){
    req.flash("success" , "logged out");
    req.logOut();
    res.redirect("/campground");
});

module.exports = router ;