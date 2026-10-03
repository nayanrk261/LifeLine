const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
    applicationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
        required: true
    },
    status : {
        type : String,
        enum : ["active", "resolved"],
        required : true,
    },
    startedAt : {
        type : Date,
        required : true
    },
    resolvedAt : {
        type : Date,
        default : null
    },
    reason : {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})

const Incident = mongoose.model("Incident", IncidentSchema);
module.exports = Incident;