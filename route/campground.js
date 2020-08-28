var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comments");
var middleware  = require("../middleware/index");
//------------------------------------
router.get("/campground", function(req, res){
    Campground.find({}, function(err, allCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campground/home", {data: allCampground});
        }
    });
});

router.get("/campground/new",middleware.isLoggedIn, function(req, res){
    res.render("campground/new");
});

router.get("/campground/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec( function(err, foundGround){
        if(err){
            res.send(err);
        } else {
              //page with the particular template
            res.render("campground/show", { campground: foundGround});
        }
    }) 
});

router.post("/campground",middleware.isLoggedIn, function(req, res){
    //pushing data in the array
    var name = req.body.name;
    var price= req.body.price;
    var image= req.body.image;
    var desc = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username 
    };
    var newCampground = {name: name , price:price , image: image , description: desc , author: author}; 
   Campground.create(newCampground, function(err, newSite){
       if(err){
           req.flash("error", err);
           console.log(err);
       } else {
            console.log(newSite);
            req.flash("success", "CAMPGROUND CREATED SUCCESSFULLY");
            res.redirect("/campground");
       }
   })
    //redirect to campgrounds  
});
//--------Edit
router.get("/campground/:id/edit",middleware.checkOwnership ,function(req, res){
    Campground.findById(req.params.id, function(err , foundGround){
        res.render("campground/edit", {campground: foundGround});  
    })
});
//---------Edit post
router.put("/campground/:id",middleware.checkOwnership , function(req ,res){
    Campground.findByIdAndUpdate(req.params.id , req.body.campground ,function(err, update){
        if(err){
            res.redirect("/campground");
        } else {
            req.flash("success","UPDATED POST");
            res.redirect("/campground/"+req.params.id);
        }
    });
});

router.delete("/campground/:id",middleware.checkOwnership , function(req ,res){
    Campground.findByIdAndRemove(req.params.id ,function(err){
        if(err){
            console.log("error in deleting DATA");
        } else {
            req.flash("success","CAMPGROUND DELETED SUCCESSFULLY");
            res.redirect("/campground");
        }
    });
});


module.exports = router ;