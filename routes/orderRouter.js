const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Orders = require('../models/order');
var authenticate = require('../authenticate');

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());
const {pagesize}=require('../config')

var pickupslot=require('../models/pickupslot');
const Carts = require('../models/cart');
const Products = require('../models/product');


orderRouter.route('/searchdate')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    console.log(query)
    Orders.find({date:query})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .populate('buyer')
    .populate('items.item')
    .populate('timeSlot')
    .then(orders=>{
        console.log(orders)
        Orders.countDocuments({date:query})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({orders:orders,pages:pages})
        })
    }).catch(err=>res.json({err}))
})
orderRouter.route('/allorders')
.post((req,res,next) => {
    const query=req.body.query
    const pgnum=req.body.pgnum
    Orders.find({})
    .limit(pagesize)
    .skip(pagesize*(pgnum-1))
    .populate('buyer')
    .populate('items.item')
    .populate('timeSlot')
    .then(orders=>{
        Orders.countDocuments({})
        .exec((err,c)=>{
       let pages=Math.ceil(c/pagesize)
        res.json({orders:orders,pages:pages})
        })
    }).catch(err=>res.json({err}))
})


orderRouter.route('/changetimeslot')
.post(authenticate.verifyUser,(req, res, next) =>{
    const orderid=req.body.orderid
    const tid=req.body.timeslotid
    Orders.findById(orderid)
    .then(order=>{
        if(!order.buyer==req.user._id) return res.json({err:"not authorized"})
        pickupslot.findById(order.timeSlot)
        .then(tm=>{
            tm.orders=tm.orders-1;
            tm.save()
            .then(tms=>{

            })
        })
        pickupslot.findById(tid)
        .then(timeslot=>{
            order.timeSlot=timeslot._id
            order.save()
            .then(orders=>{
                return res.json({msg:"success",id:orders._id})
            }).catch(err=>{res.json({err:"error"})})
        })
    }).catch(err=>res.json({err}))
})


orderRouter.route('/placeorder')
.post(authenticate.verifyUser, async function(req, res, next){
    let timeid=req.body.timeslotid
    let orderItems = [];
    await Carts.findOne({buyer:req.user._id})
    .populate('buyer')
    .populate('items.item')
    .then(async function(cart) {
        let prods=[]
        let list={}
        for(let i in cart.items){
            prods.push(cart.items[i].item._id)
            list[cart.items[i].item._id]=cart.items[i].quantity
        }
        console.log(list)
        await Products.find({_id:{$in:prods}})
        .then(async function (products){
            let total=0
            console.log(products)
            for(let i in products){
                list[products[i]._id]=Math.min(list[products[i]._id],products[i].quantity)
                total+=list[products[i]._id]*products[i].price;
            }
            if(total==0) return res.json({err:"cannot place order"})
            total=0;
            console.log(list)
            for(let i in products){
                let d= await Products.findById(products[i]._id)
                .then(async function(prod){
                    let q=Math.min(prod.quantity,list[products[i]._id])
                    list[products[i]._id]=q;
                    prod.quantity=prod.quantity-q;
                   await prod.save()
                    .then(prodt=>{
                    list[products[i]._id]=q;
                    total+=list[products[i]._id]*prodt.price;
                    }).catch(err=>{
                    list[products[i]._id]=0;
                    total+=0;
                    })
                }).catch(err=>console.log(err))
                
            }
            if(total<=0) return res.json({err:"cannot place order"})
            var orderitems=[]
            for(let i in list){
                if(list[i]>0){
                    orderitems.push({
                        item:i,quantity:list[i]
                    })
                }
            }

        await pickupslot.findOne({_id:timeid})
        .then(timeslot=>{
            if(timeslot.orders==timeslot.maxorders){
                res.json({err:"128"})
            }
            else{
                timeslot.orders+=1;
                timeslot.save()
                .then(tm=>{
                    let s=Orders({buyer:req.user._id,timeSlot:timeid,items:orderitems,amount:total,date:tm.date})
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
                                return res.json({err:"146"})
                            }
                        })
                        
                    }).catch(err=>{console.log(err);res.json({err})})

                }).catch(err=>{console.log(err);res.json({err})})
            }
    
        }).catch(err=>{console.log(err);res.json({err})})

        }).catch(err=>{console.log(err);res.json({err})})

    }).catch(err=>{console.log(err);res.json({err})})
})


// Anurag's Code placeorder
// orderRouter.route('/placeorder')
// .post(authenticate.verifyUser,(req, res, next) => {
//     let timeid=req.body.timeslotid
//     let orderItems = [];
//     Carts.findOne({buyer:req.user._id})
//     .populate('buyer')
//     .populate('items.item')
//     .then((cart) => {
//         let total=0;
//         for(i in cart.items){
//             Products.findById(cart.items[i].item)
//             .then((product) => {                
//                 let orderQuantity = Math.min(cart.items[i].quantity, product.quantity);
//                 if(orderQuantity > 0) {                
//                     console.log(`Items in cart: ${cart.items[i].quantity}. Max Product quantity: ${product.quantity}. Minimum: ${orderQuantity}`);
//                     orderItems.push({item:product._id, quantity:orderQuantity});
//                     total +=  orderQuantity*product.price;
//                     product.quantity -=  orderQuantity;
//                     product.save()
//                     .then(console.log("Product Edited Successfully"))
//                     .catch(err => res.json({err:"error"}));
//                 }
//             }, (err) => next(err))
//             .catch((err) => res.json({err}));
//         }
//         pickupslot.findOne({_id:timeid})
//         .then(timeslot=>{
//             if(timeslot.orders==timeslot.maxorders){
//                 res.json({err:"error"})
//             }
//         }).catch(err=>res.json({err:"error"}))

//         pickupslot.findOneAndUpdate({_id:timeid},{
//             $inc: { orders: 1 }
//         },{
//             new:true
//         }).exec((err,result)=>{
//             if(err) return res.json({err:"error"})
//             pickupslot.findById(timeid).then(tm=>{
//             let s=Orders({buyer:req.user._id,timeSlot:timeid,items:orderItems,amount:total,date:tm.date})
//             s.save()
//             .then((order) => {
//                 console.log("order saved")
//                 Carts.findOneAndUpdate({buyer:req.user._id},{
//                     $set:{items:[]}
//                 },{
//                     new:true
//                 }).exec((err,result)=>{
//                     if(!err)
//                     return res.json({msg:"success",id:order._id})
//                     else{
//                         return res.json({err:"error"})
//                     }
//                 })
                
//             })
//             .catch((err) => res.json({err:"error"}));
//         })
//         })
//     })
// }); 

// orderRouter.route('/placeorder')
// .post(authenticate.verifyUser,(req, res, next) => {
//     let timeid=req.body.timeslotid
//     Carts.findOne({buyer:req.user._id})
//     .populate('buyer')
//     .populate('items.item')
//     .then((cart) => {
//         let total=0;
//         for(i in cart.items){
//             total+=cart.items[i].item.price*cart.items[i].quantity;
//         }
//         pickupslot.findOne({_id:timeid})
//         .then(timeslot=>{
//             if(timeslot.orders==timeslot.maxorders){
//                 res.json({err:"error"})
//             }
//         }).catch(err=>res.json({err:"error"}))

//         pickupslot.findOneAndUpdate({_id:timeid},{
//             $inc: { orders: 1 }
//         },{
//             new:true
//         }).exec((err,result)=>{
//             if(err) return res.json({err:"error"})
//             let s=Orders({buyer:req.user._id,timeSlot:timeid,items:cart.items,amount:total})
//             s.save()
//             .then((order) => {
//                 console.log("order saved")
//                 Carts.findOneAndUpdate({buyer:req.user._id},{
//                     $set:{items:[]}
//                 },{
//                     new:true
//                 }).exec((err,result)=>{
//                     if(!err)
//                     return res.json({msg:"success",id:order._id})
//                     else{
//                         return res.json({err:"error"})
//                     }
//                 })
                
//             })
//             .catch((err) => res.json({err:"error"}));
//         })
    
// })
// })


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

// Anurag's Code cancel order
orderRouter.route('/cancelorder/:orderId')
.delete(authenticate.verifyUser, (req, res, next) => {
    Orders.findByIdAndRemove(req.params.orderId, async function(err, order){
        if (err) { 
            console.log(err); 
            return res.json({err:"error"});
        } 
        else { 
            for(i in order.items) {
               await Products.findById(order.items[i].item)
                .then(async function(product) {
                    product.quantity += order.items[i].quantity;
                    await product.save()
                    .then(p=>{})
                    .catch(err => res.json({err:"error"}));
                }).catch(err=>res.json({err}))
                .catch((err) => res.json({err}));
            }

            await pickupslot.findOneAndUpdate({_id:order.timeSlot},{
                $inc: { orders: -1 }
            },{
                new:true
            }).exec((err,result)=>{
                if(!err) {
                    return res.json({msg:"Order Cancelled Successfully",order:order})
                }
                else{
                    return res.json({err:"error"})
                }
            })
        }
    })
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