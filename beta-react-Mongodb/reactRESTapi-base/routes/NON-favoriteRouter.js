const express = require('express'), 
bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');

const cors = require('./cors');

const Favorites = require('../models/favorites');
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());


// favorites/
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user:req.user._id})
        .populate('user')
        .populate('dishes')
    .then((favorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorites);
        }, (err)=> next(err))
        .catch((err)=> next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id }, (err,favorite) );
            if(err) return next(err);
        
            if (!favorite) { // si rien
                Favorites.create({user: req.user._id})
                .then( (favorite) =>{
                    for (i=0; i < req.body.length; i++)
                    if(favorite.dishes.indexOf(req.body[i]._id))
                    favorite.dishes.push(req.body[i]);
                    favorite.save()
                    .then((favorite) => {
                        Favorites.findById(favorite._id)
                        .populate('user')
                        .populate('dishes')
                        .then((favorite) =>{
                            console.log('Favorite Created');
                            res.statusCode =200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                    })
                    .catch((err)=>{
                        return next(err);
                    });
                })
                .catch((err)=>{
                    return next(err);
                })                   
           
            }
            else{ // si deja favorite
                for (i=0; i< req.body.length; i++)
                if(favorite.dishes.indexOf(req.body[i]._id))
                favorite.dishes.push(req.body[i]);
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) =>{
                    console.log('Favorite Created Ajouté cet dishID' + req.body)
                    res.statusCode =200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch((err) => {
                return next(err);
            });
        }

        // manque qqchose
    })    

.put(cors.corsWithOptions,  (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})

.delete(cors.corsWithOptions, (req, res, next) => {
    Favorites.remove({user:req.user._id})
        .then((resp) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, (err) => next(err))
        .catch((err) => next(err));
});

// DISHID
favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })

.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }

    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id }, (err,favorite) );
    if(err) return next(err);
    if(!favorite){
        Favorites.create({user: req.user._id})
        .then((favorite) =>{
            favorite.dishes.push({ "_id": req.params.dishId });
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
                .catch((err) => {
             return next(err);
            });
        })
        .catch((err) => {
            return next(err);
           });
    }
        else {
           
        if (favorite.dishes.indexOf(req.params.dishId) < 0) {                
            favorite.dishes.push(req.body);
            favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
            .catch((err) => {
                return next(err);
            })
        }


})


.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {





    favorite.save()
            .then((favorite) => {
                Favorites.findById(favorite._id)
                .populate('user')
                .populate('dishes')
                .then((favorite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                })
            })
});

module.exports = favoriteRouter;