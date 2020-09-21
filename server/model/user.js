const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name : String,
    room : String,
    id : String,
    score : Number,
    actor : String,
    actress : String,
    movie : String,
    song : String,
    actorans : {
        type : Boolean,
        default : false
    },
    actressans : {
        type : Boolean,
        default : false
    },
    movieans : {
        type : Boolean,
        default : false
    },
    songans : {
        type : Boolean,
        default : false
    }

});

module.exports = mongoose.model('User', userSchema);