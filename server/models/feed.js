const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const feedSchema = new Schema({
    news: {
        type: String,
        required: true
    },
    expiry: {
        type: Date
    }
}, {
    timestamps: true
});

var Feeds = mongoose.model('Feed', feedSchema);

module.exports = Feeds;