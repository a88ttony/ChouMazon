var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var shopsdata = require("./models/shops");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var methodOverride = require("method-override");
var flash = require("connect-flash");
require('dotenv').config()

// require route
var commentsRoutes = require("./routes/comments");
var shopsRoutes = require("./routes/shops");
var indexRoutes = require("./routes/index");


mongoose.set('useUnifiedTopology', true);
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useCreateIndex:true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"))
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
    secret: "Pay more money",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/shops/:id/comments", commentsRoutes);
app.use("/shops", shopsRoutes);
app.use("/", indexRoutes);

var port = process.env.PORT;
app.listen(port, function () {
    console.log("Server Has Started!");
});

