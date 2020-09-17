const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    timeSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'windowslot'
    }
}, {
    timestamps: true
});

var windowOrders = mongoose.model('windowOrder', orderSchema);

module.exports = windowOrders;