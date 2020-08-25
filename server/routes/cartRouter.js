const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Carts = require('../models/cart');

const CartsRouter = express.Router();
CartsRouter.use(bodyParser.json());


CartsRouter.route('/')
.get((req,res,next) => {
    Feeds.create(req.body)
    .then((cart) => {
        console.log('Carts created ', cart);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(cart);
    }, (err) => next(err))
    .catch((err) => next(err));
    
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('post operation not supported on /cart'); 
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /cart');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('delete operation not supported on /cart');    
});