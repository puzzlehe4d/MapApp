// Setup dependences
var express = require('express');
var router = express.Router();
var path = require('path');
var twitterApiController = require('../controllers/twitterApiController.js');
var UserController = require('../controllers/userController.js');
var passport = require('passport');
// var Auth = require('../auth/auth.js');

//Auth.checkAuth(req,res,next);
/* GET Request for index page. */
router.get('/', function(req, res, next) {
    res.sendFile(path.join(__dirname, '../../client/views/index.html'));
});

// Login Route for O-Auth
router.get('/login',function (req, res, next){
  console.log('Wow');
  passport.authenticate('twitter');
});

// Login Callback From Twitters O-Auth
router.get('/login/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// Handle GET request to Twitter API
router.get('/api/tweets/:category', function(req, res) {
  console.log('Received GET request from client:', req.params);
  // Using req.query, provide the query by client and the number of tweets to get
  twitterApiController.getTweets(req.params.category, 10, function(err, data) {
    // ** Reject data that doesn't have a location ** !!! Need to do this
    if (err) {
      console.log('Error getting data from Twttier API');
      throw new Error(err);

    } else {
      res.json(data);
    }
  });

});

// Handle PUT request to /api/users (to change favorites)
router.put('/api/users/:username', function(req, res) {
  console.log('Recevied PUT request from client', req.body);
  var favorites = req.body.favorites;
  UserController.addFavorite(req.params.username, favorites, function(response) {
    console.log('Successfully updated favorites');
    res.sendStatus(200);
  });

});

router.post('/user/signup', function(req, res) {
});

module.exports = router;
