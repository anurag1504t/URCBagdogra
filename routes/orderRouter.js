const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Orders = require('../models/order');
var authenticate = require('../authenticate');

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

var pickupslot=require('../models/pickupslot');
const Carts = require('../models/cart');



orderRouter.route('/placeorder')
.post(authenticate.verifyUser,(req, res, next) => {
    let timeid=req.body.timeslotid
    Carts.findOne({buyer:req.user._id})
    .populate('buyer')
    .populate('items.item')
    .then((cart) => {
        let total=0;
        for(i in cart.items){
            total+=cart.items[i].item.price*cart.items[i].quantity;
        }
        pickupslot.findOne({_id:timeid})
        .then(timeslot=>{
            if(timeslot.orders==timeslot.maxorders){
                res.json({err:"error"})
            }
        }).catch(err=>res.json({err:"error"}))

        pickupslot.findOneAndUpdate({_id:timeid},{
            $inc: { orders: 1 }
        },{
            new:true
        }).exec((err,result)=>{
            if(err) return res.json({err:"error"})
            let s=Orders({buyer:req.user._id,timeSlot:timeid,items:cart.items,amount:total})
            s.save()
            .then((order) => {
                console.log("order saved")
                Carts.findOneAndUpdate({buyer:req.user._id},{
                    $set:{items:[]}
                },{
                    new:true
                }).exec((err,result)=>{
                    if(!err)
                    return res.json({msg:"success",id:order._id})
                    else{
                        return res.json({err:"error"})
                    }
                })
                
            })
            .catch((err) => res.json({err:"error"}));
        })
    
})
})


orderRouter.route('/getorderdetails')
.post(authenticate.verifyUser,(req, res, next) => {
    
    const orderid=req.body.orderid
    console.log(orderid)
    Orders.findById(orderid)
    .populate("buyer")
    .populate("timeSlot")
    .then(order=>{
        if(req.user._id.equals(order.buyer._id)){
            return res.json({timeslot:order.timeSlot,status:order.status,amount:order.amount})
        }else{
            return res.json({err:"error"})
        }
    }).catch(err=>res.json({err:"error"}))
    
})

orderRouter.route('/getuserorders')
.get(authenticate.verifyUser,(req, res, next) => {
    Orders.find({buyer:req.user._id})
    .populate("buyer")
    .populate("timeSlot")
    .populate("items.item")
    .then(orders=>{
            return res.json({orders:orders})
    }).catch(err=>res.json({err:"error"}))
    
})



// Methods for http://localhost:3000/orders/ API end point
orderRouter.route('/')
.get(authenticate.verifyUser, (req,res,next) => {
    Orders.find({})
    .populate('buyer')
    .populate('items.item')
    .populate('timeSlot')
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }, (err) => next(err))
    .catch((err) => res.json({err}));
})
.post((req, res, next) => {
    let s=Orders(req.body)
    s.save()
    .then((order) => {
        console.log('Order Placed ', order);
        Orders.findById(order._id)
        .populate('buyer')
        .populate('items.item')
        .then((cart) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(cart);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /orders');
})
.delete((req, res, next) => {
    Orders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/orders/:ordersId API end point
orderRouter.route('/:orderId')
.get((req,res,next) => {
    Orders.findById(req.params.orderId)
    .populate('buyer')
    .populate('items.item')
    .populate('timeSlot')
    .then((order) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /orders/'+ req.params.orderId);
})
.put((req, res, next) => {
    Orders.findByIdAndUpdate(req.params.orderId, {
        $set: req.body
    }, { new: true })
    .then((order) => {
        Orders.findById(order._id)
        .populate('buyer')
        .populate('items.item')
        .then((order) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Orders.findByIdAndRemove(req.params.orderId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => res.json({err}));
});

// Methods for http://localhost:3000/orders/:orderId/items API end point
orderRouter.route('/:orderId/items')
.get((req,res,next) => {
    Orders.findById(req.params.orderId)
    .populate('buyer')
    .populate('items.item')
    .then((order) => {
        if (order != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order.items);
        }
        else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null) {
            order.items.push(req.body);
            order.save()
            .then((order) => {
                Orders.findById(order._id)
                .populate('buyer')
                .populate('items.item')
                .then((order) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(order); 
                })                               
            }, (err) => next(err));
        }
        else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /orders/${req.params.orderId}/items`);
})
.delete((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null) {
            for (var i = (order.items.length -1); i >= 0; i--) {
                order.item.id(order.items[i]._id).remove();
            }
            order.save()
            .then((order) => {
                Orders.findById(order._id)
                .populate('buyer')
                .populate('items.item')
                .then((order) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(order); 
                })               
            }, (err) => next(err));
        }
        else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

// Methods for http://localhost:3000/orders/:orderId/items/:itemId API end point
orderRouter.route('/:orderId/item/:itemId')
.get((req,res,next) => {
    Orders.findById(req.params.orderId)
    .populate('buyer')
    .populate('items.item')
    .then((order) => {
        if (order != null) {
            if(order.items.id(req.params.itemId) != null) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order.orderId.id(req.params.itemId));
            }
            else {
                err = new Error(`Order ${req.params.orderId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /orders/${req.params.orderId}/items/${req.params.itemId}`);
})
.put((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null) {
            if(order.items.id(req.params.itemId) != null) {
                if (req.body.item) {
                    order.items.id(req.params.itemId).item = req.body.item;
                }
                if (req.body.quantity) {
                    order.items.id(req.params.itemId).quantity = req.body.quantity;                
                }
                order.save()
                .then((order) => {
                    Orders.findById(order._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((order) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(order); 
                    })                 
                }, (err) => next(err));
            }
            else {
                err = new Error(`Order ${req.params.orderId} not found`);
                err.status = 404;
                return next(err);
            }
        }
        else {
            err = new Error(`Item ${req.params.itemId} not found`);
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if(order != null) {
            if(order.item.id(req.params.itemId) != null) {
                order.item.id(req.params.itemId).remove();
                order.save()
                .then((order) => {
                    Orders.findById(order._id)
                    .populate('buyer')
                    .populate('items.item')
                    .then((order) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(order); 
                    })                 
                }, (err) => next(err));
            }
            else {
                err = new Error(`Item ${req.params.itemId} not found`);
                err.status = 404;
                return next(err); 
            }
        }
        else {
            err = new Error(`Order ${req.params.orderId} not found`);
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = orderRouter;