var express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');

var authenticate = require('../authenticate');
const cors = require('./cors');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. 
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
*/
router.options('*', cors.corsWithOptions, (req, res) => { res.sendStatus(200); } )

router.get('/', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
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

// post, put, delete pour admin
router.get('/:dishId', cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
  User.findById(req.params.dishId)
      .then( (user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
      })
        .catch((err) => {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
        });
});






// POST creation du new user:  /users/signup
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err,user) => {
    if(err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.jason({err:err});
    }
    else {
      if(req.body.firstname)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save( (err, user) => {
        if (err){
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.jason({err:err});
            return;
        }
        passport.authenticate('local')(req,res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registration Successful OK !', user: user});
        });

      });      
    }    
  });
});

//// POST login user : /users/login
router.post('/login', cors.corsWithOptions, (req, res, next) => {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: false, status: 'PAS USER--Login Unsuccessful!', err: info});
    }
    req.logIn(user, (err) => {
      if (err) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'USER--Login Unsuccessful!', err: 'Could not log in user!'});          
      }

      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({success: true, status: 'OK-- Login Successful!', token: token});
    }); 
  }) (req, res, next);
});

// GET LOGOUT :  /users/logout
router.get('/logout', cors.corsWithOptions, (req, res, next) => {
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

router.get('/checkJWTtoken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if (err)
      return next(err);
    
    if (!user) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info});
    }
    else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});

    }
  }) (req, res);
});


module.exports = router;
