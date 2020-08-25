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
        required: true
    },
    email: {
        type: String,
        required: true
    },
    livingIn: {
        type: Boolean,
        default: false
    },
    admin: {
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);