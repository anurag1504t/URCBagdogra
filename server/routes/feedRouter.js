const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Feeds = require('../models/feed');

const FeedsRouter = express.Router();
FeedsRouter.use(bodyParser.json());


FeedsRouter.route('/')
.get((req,res,next) => {
    Feeds.find({})
    .then((feed) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feeds.create(req.body)
    .then((feed) => {
        console.log('Feeds Created ', feed);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feeds');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /feeds');    
});