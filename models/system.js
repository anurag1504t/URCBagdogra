const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sysSchema = new Schema({
    id : {
        type: Number,
        required: false
    },
    shop:{
        type: Boolean,
        default: true
    },
    slot:{
        type: Boolean,
        default: true
    }
});

var system = mongoose.model('System', sysSchema);

module.exports = system;