var uuid = require('uuid');
var ObjectId = require('mongodb').ObjectID;

var User = require('../models/user').User;
var config = require('../config');


exports.getUserPayload = function(req, res) {
  var user = req.user;
  res.json({sites: user.sites});
}

exports.resetPassword = function(req, res) {
  var email = req.body.email;
  User.findOne({email}).exec(function(err, user) {
    if (user) {
      user.sendPasswordResetEmail((err, message) => {
        if (err) {
          res.send(err);
        } else {
          res.json({ success: message });
        }
      });
    } else {
      res.status(404).send("Could not find user with this email.");
    }
  });
}

exports.resetPasswordComplete = function(req, res) {
  var user_id = req.params.user_id;
  var token = req.body.token;
  var password = req.body.password;
  User.findById(user_id).exec(function(err, user) {
    if (user) {
      if (user.password_reset_token === token) {
        user.password = password;
        user.password_reset_token = uuid.v4();
        user.save((err, message) => {
          if (err) {
            res.send(err);
          } else {
            res.json({ success: message });
          }
        });
      } else {
        res.status(403).send("Invalid token.");
      }
    } else {
      res.status(404).send("Couldn't find user.");
    }
  });
}

exports.requireCorrectUser = function(req, res, next) {
  if (req.user._id != req.params.user_id) {
    return res.status(401).send("You are not the correct user.");
  } else {
    if (req.params.site_id) {
      if (req.user.sites.map((site) => site._id).indexOf(req.params.site_id) === -1) {
        return res.status(401).send("You do not own this site.");
      } else {
        next();
      }
    } else {
      next();
    }
  }
}
