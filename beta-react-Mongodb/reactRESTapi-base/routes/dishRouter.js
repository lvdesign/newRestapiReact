const express = require('express'), 
bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Dishes =  require('../models/dishes');
const dishRouter = express.Router();
dishRouter.use(bodyParser.json());

// /dishes
dishRouter.route('/')
.get((req,res,next) => {
    Dishes.find({})
        .then( (dishes) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            console.log('List of Dishes :', dishes );
            res.json(dishes);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {    
    Dishes.create(req.body)
        .then((dish) => {
            //console.log('Dish created by : ', req.body)
            console.log('Dish created : ', dish)
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish);
        }, (err) => next(err))
             .catch((err) => next(err));
})
.put((req,res,next) => {  
    res.statusCode=403;  
    res.end(' PUT not suported ' + dish);
})
.delete((req,res,next) => {
    Dishes.remove()
    .then((resp) =>{
        res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});


// /dishes/1
dishRouter.route('/:dishId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            console.log(' dish : ', dish );
            res.json(dish);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {  
    res.statusCode=403;  
    res.end('POST not suporteed for dishId : ' +req.params.dishId);
})
.put((req,res,next) => { 
    //console.log(' dish : ', req.body ); 
   Dishes.findByIdAndUpdate(req.params.dishId, {$set: req.body}, {new:true})
        .then( (dish) => {
            res.statusCode =200;
            res.setHeader('Content-Type', 'application/json');
            console.log(' dish update : ', dish );
            res.json(dish);
        }, (err) => next(err))
            .catch((err) => next(err));
})
.delete( (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
        .then((resp) =>{
            res.statusCode =200;
                res.setHeader('Content-Type', 'application/json');
                console.log(' dish delete : ', resp );
                res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});



//     dishes/1/comments  -> Action sur Comments d'un dishID
dishRouter.route('/:dishId/comments')
.get((req,res,next) => { // voir les comments du dishId
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            if(dish != null){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments);
            }
            else{
                err = new Error('Dish '+ req.params.dishid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {    
    Dishes.findById(req.params.dishId)
        .then((dish) => { // ecrire un nouveau comment dsle dishId
            if(dish != null){   
                dish.comments.push(req.body);
                dish.save()
                    .then((dish)=> {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }, (err) => next(err));             
            }
            else{
                err = new Error('Dish '+ req.params.dishid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
             .catch((err) => next(err));
})
.put((req,res,next) => {  
    res.statusCode=403;  
    res.end(' PUT not suported ' +req.params.dishId+ '/comments');
})
.delete((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) =>{
        if(dish != null){ 
            for (var i =(dish.comments.length -1); i >= 0; i--) {
                dish.comments.id(dish.comments[i]._id).remove();
            } 
            dish.save()
                    .then((dish)=> {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    }, (err) => next(err));       
        }
        else{
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            res.statusCode = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


// dishes/1/comments/1  -> Action sur CommentId  du Comments
dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then( (dish) => {
            if(dish != null && dish.comments.id(req.params.commentId) != null){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish.comments.id(req.params.commentId));

            }
            else if (dish == null) {
                err = new Error('Dish '+ req.params.dishid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
            else{
                err = new Error('Comment '+ req.params.commentid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
            
        }, (err) => next(err))
            .catch((err) => next(err));
})
.post((req,res,next) => {  
    res.statusCode=403;  
    res.end('POST not suporteed for dishId/ ' +req.params.dishId+ ' /Comments/' + req.params.commentId);
})
.put((req,res,next) => {  
    Dishes.findById(req.params.dishId)
    .then( (dish) => { // updating sub documment
        if(dish != null && dish.comments.id(req.params.commentId) != null){            
           if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating;
           }
           if(req.body.comment){
                dish.comments.id(req.params.commentId).comment =req.body.comment;
           }
            dish.save()
                .then((dish)=> {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                }, (err) => next(err));    

        }
        else if (dish == null) {
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            res.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment '+ req.params.commentid+ ' not found');
            res.statusCode = 404;
            return next(err);
        }
        
    }, (err) => next(err))
        .catch((err) => next(err));
})

.delete( (req,res,next) => {
    Dishes.findById(req.params.dishId)
        .then((dish) =>{
            if(dish != null && dish.comments.id(req.params.commentId) != null){
                    dish.comments.id(req.params.commentId).remove();            
                dish.save()
                        .then((dish)=> {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));       
            }
            else if (dish == null) {
                err = new Error('Dish '+ req.params.dishid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
            else{
                err = new Error('Comment '+ req.params.commentid+ ' not found');
                res.statusCode = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});


// Router link
module.exports = dishRouter;