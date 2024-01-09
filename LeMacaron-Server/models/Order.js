const mongoose = require("mongoose");
let date_time = new Date();

// get current date
// adjust 0 before single digit date
let date = ("0" + date_time.getDate()).slice(-2);
// get current month
let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
// get current year
let year = date_time.getFullYear();
// get current hours
let hours = date_time.getHours();
// get current minutes
let minutes = date_time.getMinutes();
// get current seconds
let seconds = date_time.getSeconds();


const orderSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: false,
    },
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
    orderStatus: {
        type: String,
        required: false,
    },
    orderDate: {
        type: String,
        default: (year + "-" + month + "-" + date + " " + hours + ":" + minutes),
        required: false

    },
    orderDiscountCode: {
        type: String,
        default: "False",
        required: false,
    }
});
const Order = mongoose.model("orders", orderSchema);
module.exports = Order;