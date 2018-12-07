var express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var User = require('../models/user');

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
  User.findOne({username: req.body.username})
  .then((user) => { // existe ou pas ?
    if(user != null) {
      var err = new Error('-- User ' + req.body.username + ' already exists!');
      err.status = 403;
      next(err);
    }
    else {
      return User.create({
        username: req.body.username,
        password: req.body.password});
    }
  })
  .then((user) => { // et alors connection s'effectue
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

//// POST login user : /users/login
router.post('/login', (req, res, next) => {

  if(!req.session.user) { // si aucune session
    var authHeader = req.headers.authorization;
    
    if (!authHeader) {
      var err = new Error('You are not authenticated!');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
var username = auth[0];
var password = auth[1];

// receherche existe
User.findOne({username: username})
.then((user) => { // toto.find({}).then((){ // }).catch((err) => next(err));
  if (user === null) {
    var err = new Error('User ' + username + ' does not exist!');
    err.status = 403;
    return next(err);
  }
  else if (user.password !== password) {
    var err = new Error('Your password : ' +password+ ' is incorrect!' +user.password+ ' toto.');
    err.status = 403;
    return next(err);
  }
  else if (user.username === username && user.password === password) {
    req.session.user = 'authenticated';
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are authenticated!')
  }
})
.catch((err) => next(err));
}
else {
res.statusCode = 200;
res.setHeader('Content-Type', 'text/plain');
res.end('You are already authenticated!');
}
})

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
