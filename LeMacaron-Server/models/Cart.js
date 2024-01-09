const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    cards:
        [{
            type: { _id: String, price: Number, quantity: Number },
            required: true,
        }]
    ,

    totalToPay: {
        type: Number,
        required: true,
    },
    totalItemsInCart: {
        type: Number,
        required: true,
    },
    orderDiscountCode: {
        type: String,
        default: "False",
        required: false,
    }
});
const Cart = mongoose.model("carts", cartSchema);
module.exports = Cart;