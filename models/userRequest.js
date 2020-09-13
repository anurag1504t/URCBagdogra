var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserRequest = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: Number,
        required: true
    },
    name: {
        type: String,
        default: ''
    },
    mobileNumber : {
        type: Number,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    livingIn: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('UserRequest', UserRequest);