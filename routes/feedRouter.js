const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const Feeds = require('../models/feed');

const feedRouter = express.Router();
feedRouter.use(bodyParser.json());

// Aditya's Code
// FeedsRouter.route('/')
// .get((req,res,next) => {
//     Feeds.find({})
//     .then((feed) => {
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(feed);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     Feeds.create(req.body)
//     .then((feed) => {
//         console.log('Feeds Created ', feed);
//         res.statusCode = 200;
//         res.setHeader('Content-Type', 'application/json');
//         res.json(feed);
//     }, (err) => next(err))
//     .catch((err) => next(err));
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /feeds');
// })
// .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /feeds');    
// });

// Methods for http://localhost:3000/feeds/ API end point
feedRouter.route('/')
.get((req,res,next) => {
    Feeds.find(req.query)
    .then((feeds) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feeds);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feeds.create(req.body)
    .then((feed) => {
        console.log('Feed Created ', feed);
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
    Feeds.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/feeds/:feedId API end point
feedRouter.route('/:feedId')
.get((req,res,next) => {
    Feeds.findById(req.params.feedId)
    .then((feed) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /feeds/${req.params.feedId}`);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feeds.findByIdAndUpdate(req.params.feedId, {
        $set: req.body
    }, { new: true })
    .then((feed) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(feed);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Feeds.findByIdAndRemove(req.params.feedId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = feedRouter;