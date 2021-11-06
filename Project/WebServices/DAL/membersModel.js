const mongoose = require('mongoose');

let MembersSchema = new mongoose.Schema({
    _id : Number,
    Name : String,
    Email : String,
    City: String
})

module.exports = mongoose.model('members', MembersSchema);