var express = require('express');
const bodyParser = require('body-parser');
var UserRequest = require('../models/userRequest');
var User = require('../models/user');
var authenticate = require('../authenticate');

const userRequestRouter = express.Router();
userRequestRouter.use(bodyParser.json());

userRequestRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    UserRequest.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    User.find({username: req.body.username})
    .then((user) => {
        if(user != null) {
            err = new Error(`Username ${req.body.username} not available`);
            err.status = 404;
            return next(err);
        }
        else {
            UserRequest.create(req.body)
            .then((user) => {
                console.log('User Added to Request List ', user);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

userRequestRouter.route('/:userId')
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    UserRequest.findByIdAndRemove(req.params.userId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = userRequestRouter;