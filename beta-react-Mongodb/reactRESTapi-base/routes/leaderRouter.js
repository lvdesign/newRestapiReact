const express = require('express'), 
bodyParser = require('body-parser');

const leaderRouter = express.Router();
const mongoose = require('mongoose');
const Leaders =  require('../models/leaders');
const authenticate = require('../authenticate');


leaderRouter.use(bodyParser.json());


leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find(req.query)
        .then( (leaders) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leaders);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post( authenticate.verifyUser, (req,res,next) => {    
    Leaders.create(req.body)
        .then((leader) => {
            console.log('Dish created : ', leader)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
             .catch((err) => next(err));
})
.put((req,res,next) => {  
    res.statusCode=403;  
    res.end(' PUT not suported ' + leader);
})
.delete((req,res,next) => {
    Leaders.remove()
    .then((resp) =>{
        res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// leaderID
leaderRouter.route('/:leaderId')
.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
        .then( (leader) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {  
    res.statusCode=403;  
    res.end('POST not suporteed for dishId : ' +req.params.leaderId);
})
.put((req,res,next) => {  
    Leaders.findByIdAndUpdate(req.params.leaderId, {$set: req.body}, {new:true})
        .then( (leader) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
            .catch((err) => next(err));
})

.delete( (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
        .then((resp) =>{
            res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

// Router link
module.exports = leaderRouter;