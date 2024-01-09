const express = require("express");
const Product = require("../models/Product");
const joi = require("joi");
const auth = require("../middleware/auth");
const Cart = require("../models/Cart");
const router = express.Router();
const app = express()

const cardValidateSchema = joi.object({
    image: joi.string().required(),
    title: joi.string().required().min(2),
    description: joi.string().required().min(2),
    price: joi.number().required(),
    quantityInStock: joi.number().required(),
    creatorId: joi.string(),
    category: joi.string().required().min(2),
    images: joi.array(),
});


router.post("/", auth, async (req, res) => {
    try {

        // 1. check if user is an admin
        if ((req.payload.role < 1)) return res.status(400).send("Access denied.")
        // 2. joi validation

        const { error } = cardValidateSchema.validate(req.body)
        if (error) return res.status(400).send(error);

        // 3.check if card already exist
        let product = await Product.findOne({ id: req.body.id, title: req.body.title })
        if (product) return res.status(400).send("product already exists");
        // 4.add card
        product = new Product(req.body)
        await product.save();
        // 5. return new product details
        res.status(201).send(product);
    } catch (error) {
        res.status(400).send(error)
    }
});



// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) return res.status(400).send("There are no products");
        res.status(200).send(products);
    } catch (error) {
        res.status(400).send(error);
    }
});

//Search system
router.get("/search/:key", async (req, res) => {
    let data = await Product.find(
        {
            "$or": [
                { title: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }

            ]
        }
    );
    res.send(data);
})



//Get specific product by id
router.get("/:_id", async (req, res) => {

    try {
        const product = await Product.findById(req.params._id);
        if (!product) return res.status(404).send("No such product");
        res.status(200).send(product);
    } catch (error) {
        res.status(400).send(error);
    }
});




router.put("/:_id", auth, async (req, res) => {
    try {

        // 1. check if user is an admin  
        if ((req.payload.role < 1))
            return res.status(400).send("Access denied.");

        // 2. joi validation
        const { error } = cardValidateSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        // 3. find product and update
        const product = await Product.findOneAndUpdate({ _id: req.params._id }, req.body, { new: true });
        if (!product) return res.status(400).send("No such product")

        res.status(200).send("Updated successfully!");
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete("/:_id", auth, async (req, res) => {
    try {
        // 1. check if user is an admin 
        if ((req.payload.role < 1))
            return res.status(400).send("Access denied. User is not an admin");

        // Check if exist and delete Card
        const product = await Product.findOneAndDelete({ _id: req.params._id });
        if (!product) return res.status(400).send("This product details are not available...");
        // return response
        res.status(200).send(`${product.title} was deleted successfully!!`);
    } catch (error) {
        res.status(400).send(error);
    }
});



module.exports = router;