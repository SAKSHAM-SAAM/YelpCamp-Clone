var express = require("express");
var router   = express.Router();
var Campground  = require("../models/campground");
var Comment     = require("../models/comments");
var middleware  = require("../middleware/index");
//routes

router.get("/campground/:id/comment/new",middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comment/new", {campground: campground});
        }
    })
});

router.post("/campground/:id/comments",middleware.isLoggedIn , function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment , function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //adding user name
                    comment.author.id= req.user._id;
                    comment.author.username= req.user.username;
                    // saving user name
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/Campground/" + campground._id);
                }
            })
        }
    })
});

router.get("/campground/:id/comment/:comment_id/edit",middleware.checkCommentOwnership , function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comment/edit", {campground_id: req.params.id, comment: foundComment});
        }
    })    
});

router.put("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership , function(req, res){
    console.log(req.params.comment_id);
    console.log(req.body.comment);
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campground/" + req.params.id );
        }
    });
});

router.delete("/campground/:id/comments/:comment_id",middleware.checkCommentOwnership , function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id ,function(err){
        if(err){
            console.log("error in deleting comment");
        } else {
            req.flash("success", "DELETED COMMENT");
            res.redirect("/campground/" + req.params.id);
        }

    })
});

module.exports = router ;