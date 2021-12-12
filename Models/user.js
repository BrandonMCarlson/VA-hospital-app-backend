const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
 firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
 lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
 email: { type: String, required: true },
 location: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);


module.exports = User;
