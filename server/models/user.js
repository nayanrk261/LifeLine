const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : {
        type: String, 
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email : {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 255  
    },
    passwordHash : {
        type: String,
        required: true,
    }
},{timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;