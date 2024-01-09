const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    /*    _id: {
           type: String,
           required: false
       }, */
    image: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        minlength: 2
    },
    description: {
        type: String,
        required: true,
        minlength: 2
    },
    price: {
        type: Number,
        required: true,
    },
    quantityInStock: {
        type: Number,
        required: true,
    },
    creatorId: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: true,
        minlength: 2
    },
    images: {
        type: Array,
        required: false,
    }
});
const Product = mongoose.model("products", productSchema);
module.exports = Product;