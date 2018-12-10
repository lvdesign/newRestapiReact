var express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/

router.get('/',(req, res, next) => {
  User.find({})
      .then( (users) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
      })
        .catch((err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        });
});

// POST creation du new user:  /users/signup
router.post('/signup', (req, res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err,user) => {
    if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.jason({err:err});
    }
    else {
      passport.authenticate('local')(req,res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful OK !', user: user});
      });
    }    
  });
});

//// POST login user : /users/login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, status: 'You are Successful LOGIN OK !'});
});

// GET LOGOUT :  /users/logout
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
