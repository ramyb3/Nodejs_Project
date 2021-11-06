const mongoose = require('mongoose');

let UsersSchema = new mongoose.Schema({
    _id : Number,
    UserName : String,
    Password : String
})

module.exports = mongoose.model('users', UsersSchema);