var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var UserRequest = require('../models/userRequest');
var passport = require('passport');
var authenticate = require('../authenticate');
const userRequest = require('../models/userRequest');
const cart = require('../models/cart');
const userRouter = express.Router();
userRouter.use(bodyParser.json());

const {pagesize}=require('../config')

userRouter.route('/search')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    const p=new RegExp(query,"i")
    User.find({$or:[{name:{$regex:p}},{username:{$regex:p}},{email:{$regex:p}},{mobileNUmber:{$regex:p}}]})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(users=>{
        User.countDocuments({$or:[{name:{$regex:p}},{username:{$regex:p}},{email:{$regex:p}},{mobileNUmber:{$regex:p}}]})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({users:users,pages:pages})
        })
    }).catch(err=>res.json({err}))
})
userRouter.route('/allusers')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    User.find({})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(users=>{
        User.countDocuments({})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({users:users,pages:pages})
        })
    }).catch(err=>res.json({err}))
})

userRouter.route('/getuserdetails')
.get(authenticate.verifyUser, function(req, res, next) {
    User.findById(req.user._id)
    .then((user) => {
        console.log(user);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(user);
    })
    .catch((err) => res.json({err}));
})

userRouter.route('/')
.get(authenticate.verifyUser, function(req, res, next) {
    User.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    })
    .catch((err) => res.json({err}));
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
                     return res.json({err: err});
                }
                else {
                    if (tempUser.name)
                        user.name = tempUser.name;
                    user.admin = false;
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
                            return res.json({err: err});
                        }
                            userRequest.findByIdAndRemove(req.params.userId)
                            .then((resp) => {

                                let c=cart({buyer:user._id,items:[]})
                                c.save()
                                .then(r=>{
                                    res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                return res.json({success: true, status: 'Registration Successful!', userInfo:user});
                                })

                                
                            })
                            .catch((err) => console.log(err));
                        
                        
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

userRouter.post("/changepwd", authenticate.verifyUser, (req, res, next) => {
    User.findById(req.user._id)
    .then((user) => {
        console.log(user);
        if (user){
            user.changePassword(req.body.pass, req.body.newpass, function(err, user){
                if (err) {
                    console.log(err);
                    next(err);
                } 
                else {
                    res.json('password changed successfully !');
                }
            });
        } else {
            res.status(404).json({message: 'This user does not exist'});
        }
    },function(err){
        console.error(err);
    })
});

userRouter.post("/resetpwd", (req, res, next) => {
    const{pass,username}=req.body
    User.findOne({username:username})
    .then((user) => {
        if (user){
            user.setPassword(pass, function(){
                user.save()
                .then((user) => console.log(user))
                .catch((err) => next(err));
                res.status(200).json('Password reset successful');                
            });
        } else {
            res.status(404).json({message: 'This user does not exist'});
        }
    },function(err){
        console.error(err);
    })
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
                user.mobileNumber = req.body.mobileNumber;
                user.email = req.body.email;
                user.name = req.body.name;
                user.livingIn = req.body.livingIn;
                user.shopping = req.body.shopping;
                user.slotbooking = req.body.slotbooking;
            user.save()
            .then((user) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);              
            }, (err) => res.json({err}));
        }
        else {
            err = new Error('User: ' + req.params.username + ' not found');
            err.status = 404;
            return next(err);
        }
    })
    .catch((err) => res.json({err}));
})
.delete(authenticate.verifyUser, (req, res, next) => {
    console.log(req.params.username)
    User.findOneAndRemove({username: req.params.username})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => res.json({err}));
});

module.exports = userRouter;