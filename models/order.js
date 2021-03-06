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

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        default: "TO BE DELIVERED"
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'pickupslot'
    },
    items: [ productSchema ],
    date:{
        type: String,
        required:false
    }
}, {
    timestamps: true
});

var Orders = mongoose.model('Order', orderSchema);

module.exports = Orders;