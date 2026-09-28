const mongoose = require("mongoose");

const checkResultSchema = new mongoose.Schema({
    applicationId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Application",
        required : true
    },
    timestamp : {
        type : Date,
        required : true,
    },
    success : {
        type : Boolean,
        required : true
    },
    responseTime : {
        type : Number,
        required : true
    },
    checkType : {
        type : String,
        default : "http"
    },
    error : {
        type : String
    },
    statusCode : {
        type : Number
    }
});

const CheckResult = mongoose.model("CheckResult", checkResultSchema);

module.exports = CheckResult;