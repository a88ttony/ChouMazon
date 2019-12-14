var shopsdata = require("../models/shops");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkShopOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        shopsdata.findById(req.params.id, function (err, foundshopsdata) {
            if (err || !foundshopsdata) {
                req.flash("error", "Shop not found");
                res.redirect("back");
            } else {
                if (foundshopsdata.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "Permission Denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "Permission Denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

module.exports = middlewareObj;