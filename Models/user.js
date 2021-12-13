const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
 firstName: { type: String, required: true, minlength: 2, maxlength: 50 },
 lastName: { type: String, required: true, minlength: 2, maxlength: 50 },
 email: { type: String, required: true },
 password : { type: String, required: true, minlength: 2, maxlength: 1024 },
 location: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const schema = Joi.object({
      firstName: Joi.string().min(2).max(50).required(),
      lastName: Joi.string().min(2).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required(),
      locations: Joi.string().required(),
    });
    return schema.validate(user);
  }

  userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ 
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.aboutMe,
      password: this.email,
      locations: this.password,
       }, config.get('jwtSecret'));
   };
  
  const validateLogin = (req) => {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(1024).required(),
    });
    return schema.validate(req);
  };


module.exports = User;
module.exports = validateUser;
module.exports = validateLogin;
