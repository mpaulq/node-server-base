const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    permissionLevel: Number
 });

 module.exports = mongoose.model('User', userSchema);