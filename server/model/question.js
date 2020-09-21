const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    actor : String,
    actress : String,
    movie : String,
    song : String,
});

module.exports = mongoose.model('Question', questionSchema);