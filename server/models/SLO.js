const mongoose = require("mongoose");

const SLOschema = new mongoose.Schema({
    applicationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Application",
        required : true
    },
    metric : {
        type: String,
        required: true  
    },
    target : {
        type : Number,
        required : true
    },
    window : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
});

const SLO = mongoose.model("SLO", SLOschema);
module.exports = SLO;