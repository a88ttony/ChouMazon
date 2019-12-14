var express = require("express");
var router = express.Router({mergeParams: true});
var shopsdata = require("../models/shops");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// new comment
router.get("/new", middleware.isLoggedIn, function (req, res) {
    shopsdata.findById(req.params.id, function (err, shops) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { shops: shops })
        }
    })
})

// create comments
router.post("/", middleware.isLoggedIn, function (req, res) {
    shopsdata.findById(req.params.id, function (err, shops) {
        if (err) {
            req.flash("error", "Somethong went wrong");
            console.log(err);
            res.redirect("/shops")
        } else {
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //save the comment
                    shops.comments.push(comment);
                    shops.save();
                    req.flash("success", "Successfully Added");
                    res.redirect('/shops/' + shops._id);
                }
            })
        }
    })
})

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function (req, res) {
    shopsdata.findById(req.params.id, function(err, foundShop){
        if(err || !foundShop){
            req.flash("error", "Cannot find the shop");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                req.flash("error", "Comment NOT Found");
                res.redirect("back");
            } else {
                res.render("comments/edit", { shop_id: req.params.id, comment: foundComment });
            }
        });
    });

});

router.put("/:comment_id", middleware.checkCommentOwnership, function (req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/shops/"+ req.params.id);
        }
    })
})

// delete comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function (err) {
        if(err){
            res.redirect("back");
        } else {
            req.flash("successs", "Question Deleted");
            res.redirect("/shops/"+req.params.id);
        }
    })
})





module.exports = router;