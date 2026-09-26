const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 100
    },
    url: {
    type: String,
    required: true
    },
    repositoryUrl: {
    type: String
    },
    ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
    },
    status: {
        
    type: String,
    enum: ["active", "inactive"],
    default: "active"
    },
    checkInterval: {
    type: Number,
    required: true,
    default: 5
    }
}, {
    timestamps: true
});

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;