const express = require("express");
const auth = require("../middleware/auth");
const joi = require("joi");
const chalk = require("chalk");
const Order = require("../models/Order");
const Cart = require("../models/Cart")
const router = express.Router();


//Get orders
router.get("/:_id", auth, async (req, res) => {
    try {
        const carts = await Order.find({ userId: req.params._id });
        if (!carts) return res.status(204).send(["No cards to display"]);
        res.status(200).send(carts);
    } catch (error) {
        res.status(400).send(error);
    }
})
//ADD TO ORDERS
router.post("/addNewOrder", auth, async (req, res) => {
    try {

        let randomId = Date.now() + Math.floor(Math.random() * 100)

        let cart = await Cart.findOne({ userId: req.payload._id });

        let order = new Order(req.body);


        order.$set({ orderStatus: "Confirmed!" })
        order.$set({ _id: randomId })




        if ((req.body.totalToPay < 200) && (cart.orderDiscountCode != "True")) {

            order.$set({ totalToPay: req.body.totalToPay + 20 })

        } else if ((cart.orderDiscountCode == "True") && ((req.body.totalToPay * 0.8) < 200)) {

            order.$set({ totalToPay: (req.body.totalToPay * 0.8) + 20 })

        } else if ((cart.orderDiscountCode == "True") && ((req.body.totalToPay * 0.8) > 200)) {
            order.$set({ totalToPay: (req.body.totalToPay * 0.8) })

        } else {

            order.$set({ totalToPay: (req.body.totalToPay) })
        }
        let newOrder = await order.save()

        let carts = await Cart.updateMany({ userId: req.body.userId }, { cards: [], totalItemsInCart: 0, totalToPay: 0 })
        if (cart.orderDiscountCode == "True") {
            cart.$set({ orderDiscountCode: "AlreadyUsed" })
            order.$set({ orderDiscountCode: "True" })
            cart.save()
            order.save()
        }
        res.status(201).send("The order was confirmed!");

        if ((!newOrder && carts))
            return res.status(404).send("Something went wrong, please try again later");

    } catch (error) {
        console.log(error);
    }
})

router.post("/discount", auth, async (req, res) => {


    try {
        let cart = await Cart.findOne({ userId: req.payload._id });
        let checkTheCode = () => {
            console.log(req.body);
            if ((cart.orderDiscountCode == "True") && (req.body == "GET20")) {
                console.log("Discount code already active!");

            } else if ((req.body) = "GET20") {
                cart.$set({ orderDiscountCode: "True" })

            } else {
                console.log("WRONG CODE");
            }

        }

        checkTheCode()



        await cart.save()

    } catch (error) {

        console.log(error);
    }
})
module.exports = router;