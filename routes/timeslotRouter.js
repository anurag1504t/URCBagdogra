var express = require('express');
const bodyParser = require('body-parser');
var UserRequest = require('../models/userRequest');
var User = require('../models/user');
var pickupslot=require('../models/pickupslot')
var windowslot=require('../models/windowslot')
const SystemInfo = require('../models/system');
var authenticate = require('../authenticate');

const timeslotRouter = express.Router();
timeslotRouter.use(bodyParser.json());

timeslotRouter.route('/')
.all((req, res, next) => {
    SystemInfo.find({})
    .then((data) => {
        if(data[0].slot != true) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'application/json');
            res.json('Slot Booking operation is temporarily disabled by admin.');
        }
    })
});

timeslotRouter.route('/getwindowslot')
.post((req,res,next) => {
    windowslot.find({date:req.body.date})
    .then((timeslot) => {
        var t=[]
        for(i in timeslot){
            t.push(timeslot[i].start)
        }
        return res.json({dt:req.body.date,arr:t})
    })
    .catch((err) => res.json({err}));
})
timeslotRouter.route('/setwindowslot')
.post((req,res,next) => {
    var l={}
    for(var i=8.5;i<6;i++) l[i]=0;

    windowslot.find({date:req.body.date})
    .then((timeslot) => {
        for(i in timeslot){
            l[timeslot[i].start]=timeslot[i].orders
        }
    })
    .catch((err) => console.log(err));

    windowslot.deleteMany({date:req.body.date})
    .exec((err,result)=>{})
    
    var arr=req.body.arr
    for(i in arr){
        var s=windowslot({date:req.body.date,start:arr[i],end:arr[i]+0.5,orders:l[arr[i]]})
        s.save()
        .then(item=>{

        }).catch(err=>res.json({err:"error saving"}))
    }
    return res.json({msg:"success"})
})


timeslotRouter.route('/getwindowslotuser')
.post((req,res,next) => {
    windowslot.find({date:req.body.date})
    .then((timeslot) => {
        timeslot=timeslot.filter(item=>item.orders!=item.maxOrders)
        return res.json({timeslot:timeslot})
    })
    .catch((err) => res.json({err}));
})



timeslotRouter.route('/getpickupslot')
.post((req,res,next) => {
    pickupslot.find({date:req.body.date})
    .then((timeslot) => {
        var t=[]
        for(i in timeslot){
            t.push(timeslot[i].start)
        }
        return res.json({dt:req.body.date,arr:t})
    })
    .catch((err) => res.json({err}));
})
timeslotRouter.route('/setpickupslot')
.post((req,res,next) => {
    var l={}
    for(var i=8.5;i<6;i++) l[i]=0;

    pickupslot.find({date:req.body.date})
    .then((timeslot) => {
        for(i in timeslot){
            l[timeslot[i].start]=timeslot[i].orders
        }
    })
    .catch((err) => console.log(err));

    pickupslot.deleteMany({date:req.body.date})
    .exec((err,result)=>{})
    
    var arr=req.body.arr
    for(i in arr){
        var s=pickupslot({date:req.body.date,start:arr[i],end:arr[i]+0.5,orders:l[arr[i]]})
        s.save()
        .then(item=>{

        }).catch(err=>res.json({err:"error saving"}))
    }
    return res.json({msg:"success"})
})


timeslotRouter.route('/getpickupslotuser')
.post((req,res,next) => {
    pickupslot.find({date:req.body.date})
    .then((timeslot) => {
        timeslot=timeslot.filter(item=>item.orders!=item.maxOrders)
        return res.json({timeslot:timeslot})
    })
    .catch((err) => res.json({err}));
})



module.exports = timeslotRouter;