const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        default : 2440440,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    team:{
        type:String,
        default : "",
    },
    gender: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    domain: {
        type: String,
        required: true,
    },
    available: {
        type: String,
        required: true,
    },

}, {
    timestamps: true,
})

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;