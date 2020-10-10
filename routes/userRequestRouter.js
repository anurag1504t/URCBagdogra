var express = require('express');
const bodyParser = require('body-parser');
var UserRequest = require('../models/userRequest');
var User = require('../models/user');
var authenticate = require('../authenticate');
const {pagesize}=require('../config')

const userRequestRouter = express.Router();
userRequestRouter.use(bodyParser.json());


userRequestRouter.route('/allreq')
.post(authenticate.verifyUser, function(req, res, next) {
    const query=req.body.query
    const pgnum=req.body.pgnum
    UserRequest.find({})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .then(usersreq=>{
        UserRequest.countDocuments({})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({usersreq:usersreq,pages:pages})
        })
    }).catch(err=>res.json({err}))
})

userRequestRouter.route('/req')
.post((req, res, next) => {
    User.findOne({username: req.body.username})
    .then(user => {
        if(user) {
            err = new Error(`Username ${req.body.username} not available`);
            err.status = 404;
            return next(err);
        }
        else {
            s=UserRequest(req.body);
            s.save()
            .then(user => {
                console.log('User Added to Request List ', user);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(user);
            })
            .catch((err) => res.json({err:"error"}));
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

userRequestRouter.route('/:userId')
.delete(authenticate.verifyUser, (req, res, next) => {
    UserRequest.findByIdAndRemove(req.params.userId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    })
    .catch((err) => res.json({err}));
});

module.exports = userRequestRouter;