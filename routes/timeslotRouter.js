var express = require('express');
const bodyParser = require('body-parser');
var UserRequest = require('../models/userRequest');
const Orders = require('../models/order');
var User = require('../models/user');
var pickupslot=require('../models/pickupslot')
var windowslot=require('../models/windowslot')
const SystemInfo = require('../models/system');
var authenticate = require('../authenticate');
const windowOrders = require('../models/windoworder');

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

timeslotRouter.route('/deletetimeslots')
.post(async (req,res,next) => {
    var ps=0,ws=0;
    let dt=new Date()
    dt.setDate(dt.getDate()-1)
    dt=dt.toDateString()
    dt=Date.parse(dt)

    await pickupslot.find({})
    .then(async timeslots=>{
        for(let i in timeslots){
            if(timeslots[i].date!=0){
                let td=Date.parse(timeslots[i].date)
                if(td<dt){
                    await pickupslot.findById(timeslots[i]._id)
                    .then(async pkslot=>{
                        pkslot.date=1
                        await pkslot.save()
                        .then(async t=>{
                            await Orders.deleteMany({timeSlot:pkslot._id})
                            .then(o=>{})
                            .catch(err=>{console.log(err)})
                        }).catch(err=>console.log(err))
                    })
                }
            }
        }
    }).catch(err=>console.log(err))

    await pickupslot.deleteMany({date:"1"})
    .then(del=>{
        ps=1;
    }).catch(err=>console.log(err))

    await windowslot.find({})
    .then(async timeslots=>{
        for(let i in timeslots){
            if(timeslots[i].date!=0){
                let td=Date.parse(timeslots[i].date)
                if(td<dt){
                    await windowslot.findById(timeslots[i]._id)
                    .then(async pkslot=>{
                        pkslot.date=1
                        await pkslot.save()
                        .then(t=>{

                        }).catch(err=>console.log(err))
                    })
                }
            }
        }
    }).catch(err=>console.log(err))

    await windowslot.deleteMany({date:"1"})
    .then(del=>{
        ws=1;
    }).catch(err=>console.log(err))

    if(ps&&ws) res.json({msg:"success"})
    else res.json({err:"error"})
})

timeslotRouter.route('/getwindowslot')
.post((req,res,next) => {
    windowslot.find({date:req.body.date})
    .sort("start")
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
    var r=[]
    for(var i=8.5;i<6;i++) l[i]=0;
    var arr=req.body.arr
    var a=arr;
    console.log(a);
    windowslot.find({date:req.body.date})
    .then((timeslot) => {
        for(i in timeslot){
            l[timeslot[i].start]={orders:timeslot[i].orders,id:timeslot[i]._id}
            if(a.indexOf(timeslot[i].start)!=-1) {
                a[a.indexOf(timeslot[i].start)]=a[a.length-1];a.pop();console.log(a)
                }
            else{r.push(timeslot[i]._id);console.log("r"+timeslot[i].start);}
        }
        a.sort()
        console.log(a)
        console.log(r)
    })
    .catch((err) => console.log(err));
    console.log("aaaa");
    windowslot.findOne({start:0})
    .then(tm=>{
    
        windowOrders.deleteMany({timeSlot:{$in:r}})
        .exec((err,result)=>{
        console.log(result)
        windowslot.deleteMany({_id:{$in:r}})
        .exec((errr,resultss)=>{
            console.log(resultss)
            for(i in a){
                var s=windowslot({date:req.body.date,start:a[i],end:a[i]+0.5,orders:0})
                s.save()
                .then(item=>{
        
                }).catch(errrr=>res.json({err:"error saving"}))
            }
            return res.json({msg:"success"})
        })
    })
        
})
})


timeslotRouter.route('/getwindowslotuser')
.post((req,res,next) => {
    windowslot.find({date:req.body.date})
    .sort("start")
    .then((timeslot) => {
        timeslot=timeslot.filter(item=>item.orders!=item.maxOrders)
        return res.json({timeslot:timeslot})
    })
    .catch((err) => res.json({err}));
})



timeslotRouter.route('/getpickupslot')
.post((req,res,next) => {
    pickupslot.find({date:req.body.date})
    .sort("start")
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
    var r=[]
    for(var i=8.5;i<6;i++) l[i]=0;
    var arr=req.body.arr
    var a=arr;
    console.log(a);
    pickupslot.find({date:req.body.date})
    .then((timeslot) => {
        for(i in timeslot){
            l[timeslot[i].start]={orders:timeslot[i].orders,id:timeslot[i]._id}
            if(a.indexOf(timeslot[i].start)!=-1) {
                a[a.indexOf(timeslot[i].start)]=a[a.length-1];a.pop();console.log(a)
                }
            else{r.push(timeslot[i]._id);console.log("r"+timeslot[i].start);}
        }
        a.sort()
        console.log(a)
        console.log(r)
    })
    .catch((err) => console.log(err));
    console.log("aaaa");
    pickupslot.findOne({start:0})
    .then(tm=>{
    
    Orders.updateMany({timeSlot:{$in:r}},{timeSlot:tm._id},function(err,result){
        console.log(result)
        pickupslot.deleteMany({_id:{$in:r}})
        .exec((err,resultss)=>{
            console.log(resultss)
            for(i in a){
                var s=pickupslot({date:req.body.date,start:a[i],end:a[i]+0.5,orders:0})
                s.save()
                .then(item=>{
        
                }).catch(errr=>res.json({err:"error saving"}))
            }
            return res.json({msg:"success"})
        })
    })
        
})
    
   
})


timeslotRouter.route('/getpickupslotuser')
.post((req,res,next) => {
    pickupslot.find({date:req.body.date})
    .sort("start")
    .then((timeslot) => {
        timeslot=timeslot.filter(item=>item.orders!=item.maxOrders)
        return res.json({timeslot:timeslot})
    })
    .catch((err) => res.json({err}));
})



module.exports = timeslotRouter;