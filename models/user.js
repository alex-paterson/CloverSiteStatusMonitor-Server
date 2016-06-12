var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');

var siteSchema = require('./site').schema;
var mailers = require('../mailers');


var validateEmail = email => (/\S+@\S+\.\S+/).test(email);

var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please enter a valid email address'],
  },
  password: { type: String },
  password_reset_token: { type: String, default: uuid.v4() },
  sites: [siteSchema]
});


// On save hook, encrypt password
userSchema.pre('save', function(next) {
  // get access to the user model. context is user model
  var user = this;
  if (user.isNew || user.isModified('password')) {
    // generate a salt then run callback
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {return next(err);};
      // hash (encrpyt) password using salt then run callback
      bcrypt.hash(user.password, salt, null, function(err, hash) {
        if (err) {return next(err);};
        // overwrite plaintext password with encrypted
        user.password = hash;
        next();
      });
    });
  }
});

userSchema.methods.comparePassword = function(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }
    callback(null, isMatch);
  })
};

userSchema.methods.sendPasswordResetEmail = function(callback) {
  var err = mailers.sendPasswordResetEmail(this.email, this._id, this.name, this.password_reset_token);
  if (err) {
    callback(err);
  } else {
    callback(null, "Email successfully sent.");
  }
};


exports.User = mongoose.model('user', userSchema);
