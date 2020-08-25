// Imported Modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Orders = require('../models/order');
var authenticate = require('../authenticate');

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

// Methods for http://localhost:3000/orders/ API end point
orderRouter.route('/')
.get((req,res,next) => {
    Orders.find(req.query)
    .then((orders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(orders);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Orders.create(req.body)
    .then((order) => {
        console.log('Order Placed ', order);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
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
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(order);
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
    .catch((err) => next(err));
});

// Methods for http://localhost:3000/orders/:orderId/items API end point
orderRouter.route('/:orderId/items')
.get((req,res,next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order.items);
        }
        else {
            err = new Error('Order ' + req.params.orderId + ' not found');
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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Order ' + req.params.orderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /orders/' + req.params.orderId + '/items');
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
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);                
            }, (err) => next(err));
        }
        else {
            err = new Error('Order ' + req.params.orderId + ' not found');
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
    .then((order) => {
        if (order != null && order.items.id(req.params.itemId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(order.orderId.id(req.params.itemId));
        }
        else if (order == null) {
            err = new Error('Order ' + req.params.orderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Item ' + req.params.itemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /orders/'+ req.params.orderId
        + '/items/' + req.params.itemId);
})
.put((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null && order.items.id(req.params.itemId) != null) {
            if (req.body.item) {
                order.items.id(req.params.itemId).item = req.body.item;
            }
            if (req.body.quantity) {
                order.items.id(req.params.itemId).quantity = req.body.quantity;                
            }
            order.save()
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);                
            }, (err) => next(err));
        }
        else if (order == null) {
            err = new Error('Order ' + req.params.orderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Item ' + req.params.itemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Orders.findById(req.params.orderId)
    .then((order) => {
        if (order != null && order.item.id(req.params.itemId) != null) {
            order.item.id(req.params.itemId).remove();
            order.save()
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);                
            }, (err) => next(err));
        }
        else if (order == null) {
            err = new Error('Order ' + req.params.orderId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Item ' + req.params.itemId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = orderRouter;