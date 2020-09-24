var express = require('express');
const bodyParser = require('body-parser');
var sysModel = require('../models/system');
var User = require('../models/user');
var authenticate = require('../authenticate');

const sysRouter = express.Router();
sysRouter.use(bodyParser.json());



sysRouter.route('/')
.get((req,res,next) => {
    sysModel.findOne({id:1})
    .then((data) => {
        return res.json({data:data})
    })
    .catch((err) => res.json({err}));
})
.put((req,res,next) => {
    sysModel.findOne({id:1})
    .then((data) => {
        data.shop=req.body.shop;
        data.slot=req.body.slot;
        data.save()
        .then(d=>{
            return res.json({msg:"success"})
        }).catch(err=>res.json({err}))
    })
    .catch((err) => res.json({err}));
})
.post((req,res,next) => {
    let data=sysModel({id:1,shop:req.body.shop,slot:req.body.slot})

        data.save()
        .then(d=>{
            return res.json({msg:"success"})
        }).catch(err=>res.json({err}))
    
    .catch((err) => res.json({err}));
})

sysRouter.route('/getuserinfo')
.get(authenticate.verifyUser, (req,res,next) => {
    sysModel.findOne({id:1})
    .then((data) => {
        User.findById(req.user._id)
        .then(userdata=>{
            let d={
                slot:data.slot,shop:data.shop,
                usershop:userdata.shopping,
                userslot:userdata.slotbooking
            }
            return res.json({data:d});
        }).catch(err=>res.json({err}))
    })
    .catch((err) => res.json({err}));
})


module.exports = sysRouter;