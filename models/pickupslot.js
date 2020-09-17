const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSchema = new Schema({
    date: {
        type: String,
        required: true
    },
    maxOrders: {
        type: Number,
        default:3
    },
    start: {
        type: Number,
        required: true
    },
    end: {
        type: Number,
        required: true
    },
    orders: {
        type: Number,
        default:0
    }

});

var Times = mongoose.model('pickupslot', timeSchema);

module.exports = Times;