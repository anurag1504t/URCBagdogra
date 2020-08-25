const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Products = require('../models/product');
var authenticate = require('../authenticate');

const productRouter = express.Router();
productRouter.use(bodyParser.json());

// Methods for http://localhost:3000/products/ API end point
productRouter.route('/')
.get((req,res,next) => {
    Products.find({})
    .then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Products.create(req.body)
    .then((product) => {
        console.log('Product Created ', product);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /products');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Products.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/products/:productId API end point
productRouter.route('/:productId')
.get((req,res,next) => {
    Products.findById(req.params.productId)
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /products/'+ req.params.productId);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Products.findByIdAndUpdate(req.params.productId, {
        $set: req.body
    }, { new: true })
    .then((product) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(product);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Products.findByIdAndRemove(req.params.productId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = productRouter;