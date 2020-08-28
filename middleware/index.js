var Campground   = require("../models/campground");
var Comment      = require("../models/comments");
var middlewareObj={};
// middleware 
middlewareObj.isLoggedIn= function(req, res, next){ // middleware one
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First");
    res.redirect("/login");
};

middlewareObj.checkOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err , foundGround){
           if(err){
                req.flash("error" , "ERROR: CAMPGROUND NOT FOUND");
                res.redirect("/campground");
           } else {
               if(foundGround.author.id.equals(req.user._id)){
                  next();
               } else {
                    req.flash("error" , "THIS IS NOT YOUR POST");
                    res.redirect("back");
               }
           }
       });
   } else {
       req.flash("error", "YOU ARE NOT PERMITTED TO DO THIS ACTION >( ");
       res.redirect("back");
   } 
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err , foundComment){
           if(err){
                req.flash("error" ,"COMMENT NOT FOUND");
                res.redirect("/campground");
           } else {
               if(foundComment.author.id.equals(req.user._id)){
                  next();
               } else {
                    req.flash("error" ,"SOMETHING ISN'T RIGHT");
                    res.redirect("back");
               }
           }
       });
   } else {
       req.flash("error" ,"YOU ARE NOT PERMITED TO DO THIS ACTION");
       res.redirect("back");
   } 
}


module.exports = middlewareObj ;