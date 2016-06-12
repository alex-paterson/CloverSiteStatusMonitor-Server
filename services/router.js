var passport = require('passport');
var express = require('express');

var AuthenticationController = require('../controllers/authentication_controller');
var UsersController = require('../controllers/users_controller');
var SitesController = require('../controllers/sites_controller');

var passportService = require('./passport'); // Registers our strategies
var requireAuth = passport.authenticate('jwt', {session: false});
var requireSignIn = passport.authenticate('local', {session: false});

var router = express.Router();

// Auth Routes
// ----------------------------------------------------
router.route('/signin')
  .post([requireSignIn, AuthenticationController.signin])

router.route('/signup')
  .post(AuthenticationController.signup)


// User Routes
// ----------------------------------------------------

router.route('/users/:user_id')
  .get([requireAuth, UsersController.requireCorrectUser, UsersController.getUserPayload])

router.route('/reset_password')
  .post(UsersController.resetPassword)

router.route('/users/:user_id/reset_password')
  .post(UsersController.resetPasswordComplete)


// Site Routes
// ----------------------------------------------------

router.route('/users/:user_id/sites')
  .post([requireAuth, UsersController.requireCorrectUser, SitesController.create])

router.route('/users/:user_id/sites/:site_id')
  .patch([requireAuth, UsersController.requireCorrectUser, SitesController.update])
  .delete([requireAuth, UsersController.requireCorrectUser, SitesController.destroy])


router.route('/users/:user_id/sites/:site_id/tests')
  .post([requireAuth, UsersController.requireCorrectUser, SitesController.createTest])

router.route('/users/:user_id/sites/:site_id/tests/:test_id')
  .delete([requireAuth, UsersController.requireCorrectUser, SitesController.deleteTest])



// Method Routes
// ----------------------------------------------------
router.route('/query')
  .get([requireAuth, SitesController.getURLContent])



module.exports = router;
