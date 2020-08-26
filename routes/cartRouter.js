const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Carts = require('../models/cart');
var authenticate = require('../authenticate');

const cartRouter = express.Router();
cartRouter.use(bodyParser.json());

// Methods for http://localhost:3000/carts/ API end point
cartRouter.route('/')
.get((req,res,next) => {
    Carts.find(req.query)
    .populate('buyer')
    .populate('items.item')
    .then((carts) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(carts);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Carts.create(req.body)
    .then((cart) => {
        console.log('Cart created ', cart);
        Carts.findById(cart._id)
        .populate('buyer')
        .populate('items.item')
        .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        })
        
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /carts');
})
.delete((req, res, next) => {
    Carts.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/carts/:cartsId API end point
cartRouter.route('/:cartsId')
.get((req,res,next) => {
    Carts.findById(req.params.cartsId)
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cart);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /carts/${req.params.cartsId}`);
})
.put((req, res, next) => {
    Carts.findByIdAndUpdate(req.params.cartsId, {
        $set: req.body
    }, { new: true })
    .then((cart) => {
        Carts.findById(cart._id)
        .populate('buyer')
        .populate('items.item')
        .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Carts.findByIdAndRemove(req.params.cartsId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

// Methods for http://localhost:3000/carts/:cartsId/items API end point
cartRouter.route('/:cartsId/items')
.get((req,res,next) => {
    Carts.findById(req.params.cartsId)
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        if (cart != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart.items);
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Carts.findById(req.params.cartsId)
    .then((cart) => {
        if (cart != null) {
            cart.items.push(req.body);
            cart.save()
            .then((cart) => {
                Carts.findById(cart._id)
                .populate('buyer')
                .populate('items.item')
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /carts/${req.params.cartsId}/items`);
})
.delete((req, res, next) => {
    Carts.findById(req.params.cartsId)
    .then((cart) => {
        if (cart != null) {
            for (var i = (cart.items.length -1); i >= 0; i--) {
                cart.item.id(cart.items[i]._id).remove();
            }
            cart.save()
            .then((cart) => {
                Carts.findById(cart._id)
                .populate('buyer')
                .populate('items.item')
                .then((cart) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(cart);
                })             
            }, (err) => next(err));
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/carts/:cartsId/items/:itemId API end point
cartRouter.route('/:cartsId/item/:itemId')
.get((req,res,next) => {
    Carts.findById(req.params.cartsId)
    .populate('buyer')
    .populate('items.item')
    .then((card) => {
        if(cart != null) {
            if(card.items.id(req.params.itemId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(cart.cartsId.id(req.params.itemId));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /carts/${req.params.cartsId}/items/${req.params.itemId}`);
})
.put((req, res, next) => {
    Carts.findById(req.params.cartsId)
    .then((cart) => {
        if(cart != null) {
            if(card.items.id(req.params.itemId) != null) {
                if (req.body.item) {
                    cart.items.id(req.params.itemId).item = req.body.item;
                }
                if (req.body.quantity) {
                    cart.items.id(req.params.itemId).quantity = req.body.quantity;                
                }
                cart.save()
                .then((cart) => {
                    Carts.findById(cart._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })                                    
                }, (err) => next(err));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Carts.findById(req.params.cartsId)
    .then((card) => {
        if(cart != null) {
            if(card.items.id(req.params.itemId) != null) {
                cart.item.id(req.params.itemId).remove();
                cart.save()
                .then((cart) => {
                    Carts.findById(cart._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((cart) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(cart);
                    })                                    
                }, (err) => next(err));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Cart ${req.params.cartsId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));   
});

module.exports = cartRouter;