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

module.exports = router;
