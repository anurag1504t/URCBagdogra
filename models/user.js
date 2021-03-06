var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
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
        required: false
    },
    livingIn: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    },
    shopping:{
        type: Boolean,
        default: true
    },
    slotbooking:{
        type: Boolean,
        default: true
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);