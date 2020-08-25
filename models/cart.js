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

const cartSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [productSchema]
});

var Carts = mongoose.model('Cart', cartSchema);

module.exports = Carts;