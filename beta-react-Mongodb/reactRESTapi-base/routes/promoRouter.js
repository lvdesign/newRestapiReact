const express = require('express'), 
bodyParser = require('body-parser');

const promoRouter = express.Router();
const mongoose = require('mongoose');
const Promotions =  require('../models/promotions');
const authenticate = require('../authenticate');


promoRouter.use(bodyParser.json());


promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find(req.query)
        .then( (promotions) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotions);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post( authenticate.verifyUser, (req,res,next) => {    
    Promotions.create(req.body)
        .then((promotion) => {
            console.log('promotion created : ', promotion)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
             .catch((err) => next(err));
})
.put((req,res,next) => {  
    res.statusCode=403;  
    res.end(' PUT not suported ' + promotion);
})
.delete((req,res,next) => {
    Promotions.remove()
    .then((resp) =>{
        res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// promotionID
promoRouter.route('/:promotionId')
.get((req,res,next) => {
    Promotions.findById(req.params.promotionId)
        .then( (promotion) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {  
    res.statusCode=403;  
    res.end('POST not suporteed for promotionId : ' +req.params.promotionId);
})
.put((req,res,next) => {  
    Promotions.findByIdAndUpdate(req.params.promotionId, {$set: req.body}, {new:true})
        .then( (promotion) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(promotion);
        }, (err) => next(err))
            .catch((err) => next(err));
})

.delete( (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promotionId)
        .then((resp) =>{
            res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

// Router link
module.exports = promoRouter;