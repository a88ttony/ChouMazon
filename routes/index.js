var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// root route
router.get("/", function (req, res) {
    res.render("landing");
})

// register form
router.get("/register", function (req, res) {
    res.render("register");
});

// sign up logic
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("success", "Welcome to Choumazon" + user.username);
            res.redirect("/shops");
        })
    })
});

// login form
router.get("/login", function (req, res) {
    res.render("login");
});
// login logic 
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/shops",
        failureRedirect: "/login"
    }), function (req, res) {
    });
// logout
router.get("/logout", function (req, res) {
    req.logout();
    req.flash("success", "See you next time");
    res.redirect("/shops");
});




// complete the CART !!!!!
// router.put("/billing/cart", middleware.isLoggedIn, function (req, res) {
//     User.findByIdAndUpdate(req.user._id, req.body.comment, function (err, updatedComment) {
//         if (err) {
//             res.redirect("back");
//         } else {
//             res.redirect("/shops/" + req.params.id);
//         }
//     })
// })

module.exports = router;