const mongoose = require('mongoose');

let MoviesSchema = new mongoose.Schema({
    _id : Number,
    Name : String,
    Genres : [String],
    Image : String,
    Premiered : Date
})

module.exports = mongoose.model('movies', MoviesSchema);