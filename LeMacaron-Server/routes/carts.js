const express = require("express");
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const joi = require("joi");
const Product = require("../models/Product");
const router = express.Router();
const chalk = require("chalk");
const Order = require("../models/Order");



//Get carts
router.get("/:_id", auth, async (req, res) => {
    try {
        const carts = await Cart.findOne({ userId: req.params._id });
        if (!carts) return res.status(204).send(["No cards to display"]);
        res.status(200).send(carts);
    } catch (error) {
        res.status(400).send(error);
    }
})






// ADD TO CART
router.post("/", auth, async (req, res) => {
    try {

        let carts = await Cart.findOne({ userId: req.payload._id });
        let product = await Product.findById(req.body._id);
        let changeQuantityOfItemInDataBase = () => {
            if (product.quantityInStock <= 0) {
                return console.log(chalk.bgRed(`Item [Name: "${product.title}" ID: "${product._id}"] is no longer available`));
            } else {
                carts.totalToPay += req.body.price



            }
            product.quantityInStock--;
            carts.totalItemsInCart++;
        }
        if (!carts)
            return res.status(404).send("Something went wrong, please try again later");
        let cardList = carts.cards.find((cart) => cart._id == req.body._id);
        if (cardList) {
            let specificCardIndex = carts.cards.findIndex((card) => card._id == req.body._id)
            carts.cards.splice(specificCardIndex, 1, { _id: req.body._id, price: cardList.price + req.body.price, quantity: cardList.quantity + req.body.quantity })


            changeQuantityOfItemInDataBase()
        }
        else {
            carts.cards.push(req.body)

            changeQuantityOfItemInDataBase()
        }


        await carts.save();
        await product.save()

        res.status(201).send("The product was successfully added to cart");
    } catch (error) {
        console.log(error);
    }
})



// decrease quantity in cart
router.put("/", auth, async (req, res) => {
    let carts = await Cart.findOne({ userId: req.payload._id });
    let product = await Product.findById(req.body._id);
    let cardList = (carts.cards.find((cart) => cart._id == req.body._id));
    let specificCardIndex = carts.cards.findIndex((card) => card._id == req.body._id);
    let check = () => {
        if (((carts.cards[specificCardIndex].quantity) === (0))) {
            console.log("HELLO");
            carts.cards.splice(specificCardIndex, 1)
        }
    }
    try {

        let changeQuantityOfItemInDataBase = () => {
            if (product.quantityInStock <= 0) {
                return console.log(chalk.bgRed(`Item [Name: "${product.title}" ID: "${product._id}"] is no longer available`));
            } else {
                carts.totalToPay -= req.body.price

            }
            product.quantityInStock++;
            carts.totalItemsInCart--;
        }


        if (!carts)
            return res.status(404).send("Something went wrong, please try again later");
        if (cardList) {
            carts.cards.splice(specificCardIndex, 1, { _id: req.body._id, price: cardList.price - req.body.price, quantity: cardList.quantity - 1 });
            changeQuantityOfItemInDataBase();



        }
        check();





        await carts.save();
        await product.save()
        res.status(201).send("The product quantity was successfully decreased!");
    } catch (error) {
        console.log(error);
    }
})

// delete product from cart
router.put("/items", auth, async (req, res) => {
    let carts = await Cart.findOne({ userId: req.payload._id });
    let product = await Product.findById(req.body._id);
    let cardList = (carts.cards.find((cart) => cart._id == req.body._id));
    let specificCardIndex = carts.cards.findIndex((card) => card._id == req.body._id);
    try {

        if (cardList) {
            ((carts.totalToPay) -= ((req.body.price) / ((req.body.quantity) * (req.body.quantity))));



            product.quantityInStock += (req.body.quantity);
            carts.totalItemsInCart -= (req.body.quantity);
            carts.cards.splice(specificCardIndex, 1);



        }
        await carts.save();
        await product.save()
        res.status(201).send("The product was successfully deleted!");
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;