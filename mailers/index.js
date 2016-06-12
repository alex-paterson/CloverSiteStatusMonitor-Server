var nodemailer = require('nodemailer');
var Haml = require('haml');
var fs = require('fs');

var api_urls = require('../helpers/api_urls');

var transporter = nodemailer.createTransport(`smtps://${process.env.EMAIL_USERNAME}:${process.env.EMAIL_PASSWORD}@smtp.gmail.com`);


var sendEmail = (mailOptions) => {
  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      return err;
    } else {
      return null;
    };
  });
};

var passwordResetOptions = (email, locals) => {
  var text = fs.readFileSync('mailers/password_reset.txt.haml', 'utf8');
  var html = fs.readFileSync('mailers/password_reset.html.haml', 'utf8');
  return {
    from: `"Clover" <${process.env.EMAIL_USERNAME}>`,
    to: email,
    subject: 'Clover | Reset Password',
    text: Haml.render(text, {locals}),
    html: Haml.render(html, {locals})
  };
};

exports.sendPasswordResetEmail = (email, user_id, name, password_reset_token) => {
  var locals = {name: name, password_reset_url: api_urls.passwordResetURL(password_reset_token, user_id)};
  return sendEmail(passwordResetOptions(email, locals));
};
