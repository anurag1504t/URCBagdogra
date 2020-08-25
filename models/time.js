const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const timeSchema = new Schema({
    date: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        default: ''
    },
    maxOrders: {
        type: Number,
        required: 10
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

var Times = mongoose.model('Time', timeSchema);

module.exports = Times;