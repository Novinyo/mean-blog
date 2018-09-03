const mongoose = require('mongoose');
const va
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: {type:String, required: true}
});

module.exports = mongoose.model('Auth', userSchema);