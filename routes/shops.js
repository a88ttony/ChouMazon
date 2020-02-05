var express = require("express");
var router = express.Router();
var shopsdata = require("../models/shops");
var middleware = require("../middleware"); //no need the file name if its name is "index" 
//INDEX - show all shops
router.get("/", function (req, res) {
    // get all data from db
    shopsdata.find({}, function (err, allshopsdata) {
        if (err) {
            console.log(err);
        } else {
            res.render("shops/Index", { shops: allshopsdata });
        }
    });
});

//CREATE - ADD NEW BOOKS
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price; 
    var image = req.body.image;
    var desc = req.body.description;
    var isbn = req.body.isbn;
    var writer = req.body.writer;
    var publisher = req.body.publisher;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newshops = { name: name, price: price, image: image, description: desc, author: author, isbn: isbn, writer: writer, publisher: publisher}
    // post new products to database
    shopsdata.create(newshops, function (err, newlycreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/shops")
        }
    })
});
//NEW - show form
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("shops/new");
})

router.get("/:id", function (req, res) {
    //find books with provided id
    shopsdata.findById(req.params.id).populate("comments").exec(function (err, foundshopsdata) {
        if (err || !foundshopsdata) {
            req.flash("error", "Shop NOT Found");
            res.redirect("back");
        } else {
            res.render("shops/show", { shops: foundshopsdata });
        }
    })
});

// edit
router.get("/:id/edit", middleware.checkShopOwnership, function(req, res){
    shopsdata.findById(req.params.id, function (err, foundshopsdata){
        if(err){
            res.redirect("/shops");
        } else {
            res.render("shops/edit", {shop: foundshopsdata});
        }
    });
});
// update the editted shop
router.put("/:id", middleware.checkShopOwnership, function(req, res){
    shopsdata.findByIdAndUpdate(req.params.id, req.body.shop, function(err, updatedShop){
        if(err){
            res.redirect("/shops");
        } else {
            res.redirect("/shops/"+req.params.id);
        }
    });
});

// Remove shops
router.delete("/:id", middleware.checkShopOwnership, function (req, res) {
    shopsdata.findByIdAndRemove(req.params.id, function (err) {
        if(err) {
            res.redirect("/shops");
        } else{
            res.redirect("/shops");
        }
    });
});                                                    

router.get("/:id/billing", middleware.isLoggedIn, function (req, res) {
    shopsdata.findById(req.params.id, function (err, foundshopsdata) {
        if (err) {
            res.redirect("/shops/" + req.params.id);
        } else {
            res.render("buy/show", { shops: foundshopsdata });
        }  
    });      
});

module.exports = router;