const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const windowOrders = require('../models/windoworder');
var authenticate = require('../authenticate');

const windoworderRouter = express.Router();
windoworderRouter.use(bodyParser.json());

var pickupslot=require('../models/pickupslot');
var windowslot=require('../models/windowslot');

const Carts = require('../models/cart');


windoworderRouter.route('/placeorder')
.post(authenticate.verifyUser,(req, res, next) => {
    let timeid=req.body.timeslotid

    windowslot.findOne({_id:timeid})
    .then(timeslot=>{
        if(timeslot.orders==timeslot.maxorders){
            res.json({err:"error"})
        }
    }).catch(err=>res.json({err:"error"}))

        windowslot.findOneAndUpdate({_id:timeid},{
            $inc: { orders: 1 }
        },{
            new:true
        }).exec((err,result)=>{
            if(err) return res.json({err:"error"})
            let s=windowOrders({buyer:req.user._id,timeSlot:timeid})
            s.save()
            .then((order) => {
                console.log("order saved")
                res.json({msg:"success",id:order._id})
            })
            .catch((err) => res.json({err:"error"}));
        })

})


windoworderRouter.route('/getorderdetails')
.post(authenticate.verifyUser,(req, res, next) => {
    
    const orderid=req.body.orderid
    console.log(orderid)
    windowOrders.findById(orderid)
    .populate("buyer")
    .populate("timeSlot")
    .then(order=>{
        console.log(order)
        if(req.user._id.equals(order.buyer._id)){
            return res.json({timeslot:order.timeSlot})
        }else{
            return res.json({err:"error"})
        }
    }).catch(err=>res.json({err:"error"}))
    
})

windoworderRouter.route('/getuserorders')
.get(authenticate.verifyUser,(req, res, next) => {
    windowOrders.find({buyer:req.user._id})
    .populate("buyer")
    .populate("timeSlot")
    .then(orders=>{
            return res.json({orders:orders})
    }).catch(err=>res.json({err:"error"}))
    
})

windoworderRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    windowOrders.find(req.body.query)
    .populate('buyer')
    .populate('timeSlot')
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }, (err) => next(err))
    .catch((err) => res.json({err}));
})


windoworderRouter.route('/:orderId')
.get((req,res,next) => {
    windowOrders.findById(req.params.orderId)
    .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    windowOrders.findByIdAndRemove(req.params.orderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => res.json({err}));
});

module.exports = windoworderRouter;