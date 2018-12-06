var express = require('express');

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


module.exports = router;
