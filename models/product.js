const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        default: ''
    },
    quantity: {
        type: Number,
        required: true,
        min:0
    },
    image: {
        type: String,
        default: ''
    },
    maxQuantity: {
        type: Number,
        min: 1,
        max: 100
    },
    price:{
        type:Number,
        required:true
    },
    category: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

var Products = mongoose.model('Product', productSchema);

module.exports = Products;