var mongoose = require("mongoose");
var shopsschema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    isbn: String,
    writer: String,
    publisher: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
// return value
module.exports = mongoose.model("shopsdata",shopsschema);


