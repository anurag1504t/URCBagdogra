var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var UserRequest = require('../models/userRequest');
var passport = require('passport');
var authenticate = require('../authenticate');

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

userRouter.post('/signup/:userId', (req, res, next) => {
    UserRequest.findById(req.params.userId)
    .then((tempUser) => {
        if(tempUser != null) {
            User.register(new User({username: tempUser.username}), tempUser.password, (err, user) => {
                if(err) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({err: err});
                }
                else {
                    if (tempUser.name)
                        user.name = tempUser.name;
                    if (tempUser.admin)
                        user.admin = tempUser.admin;
                    if (tempUser.mobileNumber)
                        user.mobileNumber = tempUser.mobileNumber;
                    if (tempUser.email)
                        user.email = tempUser.email;
                    if (tempUser.livingIn)
                        user.livingIn = tempUser.livingIn;
                    user.save((err, user) => {
                        if (err) {
                            res.statusCode = 500;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({err: err});
                            return ;
                        }
                        passport.authenticate('local')(req, res, () => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: true, status: 'Registration Successful!', userInfo:user});
                        });
                    });
                }
            });
        }
        else {
            err = new Error(`User with ID ${req.params.userId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));      
});

userRouter.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Login Unsuccessful!', err: info});
        }
        req.logIn(user, (err) => {
            if (err) {
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Login Unsuccessful!', err: 'Could not log in user!'});          
            }
          
            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Login Successful!', token: token, user: user});
        }); 
    }) (req, res, next);
});

userRouter.get('/checkJWTtoken', (req, res) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err)
            return next(err);
        
        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT invalid!', success: false, err: info});
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({status: 'JWT valid!', success: true, user: user});            
        }
    }) (req, res);
});

userRouter.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

userRouter.route('/:username')
.get(authenticate.verifyUser, function(req, res, next) {
    User.findOne({username: req.params.username})
        .then((user) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(user);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.put((req, res, next) => {
    User.findOne({username: req.params.username})
    .then((user) => {
        if(user != null) {
            if(req.body.mobileNumber) {
                user.mobileNumber = req.body.mobileNumber;
            }
            if(req.body.email) {
                user.email = req.body.email;
            }
            if(req.body.livingIn) {
                user.livingIn = req.body.livingIn;
            }

            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);              
            }, (err) => next(err));
        }
        else {
            err = new Error('User: ' + req.params.username + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    User.findOneAndRemove({username: req.params.username})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = userRouter;