const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var productSchema = new Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
});

var timeSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    }
});

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    timeSlot: timeSchema,
    items: [ productSchema ]
}, {
    timestamps: true
});

var Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;