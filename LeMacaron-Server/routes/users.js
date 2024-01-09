const express = require("express");
const router = express.Router();
const joi = require("joi");
const auth = require("../middleware/auth");
const User = require("../models/User");
const _ = require("lodash")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const loginSchema = joi.object({
    email: joi.string().required().email(),
    password: joi.string().required().min(8),
})
const userCheckSchema = joi.object({
    firstName: joi.string().required().min(2),
    middleName: joi.string().min(2),
    lastName: joi.string().required().min(2),
    phone: joi.string().required().min(2).max(14),
    email: joi.string().required().email(),
    password: joi.string().required().min(9),
    imageUrl: joi.string(),
    imageAlt: joi.string().required(),
    state: joi.string().min(2),
    country: joi.string().required().min(2),
    city: joi.string().required().min(2),
    street: joi.string().min(2),
    houseNumber: joi.number(),
    zip: joi.number().min(3),
    role: joi.number(),
});


const registerSchema = joi.object({
    firstName: joi.string().required().min(2),
    middleName: joi.string().min(2),
    lastName: joi.string().required().min(2),
    phone: joi.string().required().min(2).max(14),
    email: joi.string().required().email(),
    password: joi.string().required().min(9),
    imageUrl: joi.string(),
    imageAlt: joi.string().required(),
    state: joi.string().min(2),
    country: joi.string().required().min(2),
    city: joi.string().required().min(2),
    street: joi.string().min(2),
    houseNumber: joi.number(),
    zip: joi.number().min(3),
    role: joi.number(),
});
const newPasswordSchema = joi.object({
    currentPassword: joi.string().required().min(9),
    newPassword: joi.string().required().min(9),
    newPasswordConfirm: joi.string().required().min(9),
})

// ADD NEW USER
router.post("/", async (req, res) => {

    try {
        // 1. joi validation
        const { error } = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error);
        // 2. check if user is already exist
        let user = await User.findOne({ email: req.body.email });
        if (user) return res.status(400).send("User is already exist");
        // 3. create the user
        user = new User(req.body);
        // 4. encrypt the password & save the user
        let salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save()

        //5.create emplty carts object for registered user.
        let carts = new Cart({ userId: user._id, cards: [], totalToPay: 0, totalItemsInCart: 0 })

        await carts.save()

        // 6. create the token & return response with token
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) return res.status(400).send("No such cart")
        console.log(user._id);
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role, imageUrl: user.imageUrl }, process.env.jwtKey)

        res.status(201).send(token)
    } catch (error) {
        res.status(400).send(error)
    }
})

// LOGIN WITH EXIST USER
router.post("/login", async (req, res) => {

    try {
        // 1.joi validation
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).send(error);
        // 2.check if user exist
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Wrong email or password");
        // 3.check the password - compare
        const result = await bcrypt.compare(req.body.password, user.password)
        if (!result) return res.status(404).send("Wrong email or password");
        // 4.create token& return a response with token
        let cart = await Cart.findOne({ userId: user._id });
        if (!cart) return res.status(400).send("No such cart")
        console.log(cart);
        const token = jwt.sign({ _id: user._id, email: user.email, role: user.role, imageUrl: user.imageUrl }, process.env.jwtKey)
        res.status(201).send(token)
    } catch (error) {
        res.status(400).send(error)
    }
})





// Update user role
router.put("/", auth, async (req, res) => {
    try {
        if (req.body.role === "isUser") {

            const user = await User.findOneAndUpdate({ email: req.body.email }, { $set: { role: "1" } }, { new: true })
            let newSave = await user.save()

        } else {
            const user = await User.findOneAndUpdate({ email: req.body.email }, { $set: { role: "0" } }, { new: true })
            let newSave = await user.save()

        }
        res.status(200).send("Role has updated!")
    } catch (error) {
        res.status(400).send(error)
    }
})


// Update user by params _id 
router.patch("/:_id", auth, async (req, res) => {
    try {
        // Check user role
        if (!(req.payload.role >= 0) && (req.payload._id === req.params._id))
            return res.status(400).send("Only Admin / logged in users are allowed to update user profile")

        //1. joi validation
        const { error } = userCheckSchema.validate(req.body);
        if (error) return res.status(400).send(error);

        //2. Verify&Update user by req _id



        const user = await User.findOneAndUpdate({ userId: req.payload.userId }, (req.body), { new: true });
        // Encrypt the new password

        if (!user) return res.status(400).send("No such user")

        //3. return response

        res.status(200).send(` User updated successfully!!`)

        await user.save()
    } catch (error) {
        res.status(400).send(error)
    }
})
// change users password
router.patch("/pass/:id", auth, async (req, res) => {
    console.log(req.body);
    try {
        // Check user role (permission)
        if (!(req.payload.role <= 0) && (req.payload._id === req.params._id))
            return res.status(400).send("FUCK");

        // Verify&Update user by req_id
        let user = await User.findById(req.params.id);
        const checkCurrentPassword = await bcrypt.compare(req.body.currentPassword, user.password)

        let salt = await bcrypt.genSalt(10);
        if (checkCurrentPassword) {
            if ((req.body.password) === (req.body.passwordConfirm)) {
                user.password = await bcrypt.hash(req.body.passwordConfirm, salt)
            } else {
                return res.status(400).send("new passwords does not match ")
            }
        } else {
            return res.status(400).send("Current password is wrong")
        }


        await user.save()

        res.status(200).send("Password was updated successfully!")
    } catch (error) {
        res.status(400).send(error)
    }
})
// Get all users
router.get("/", async (req, res) => {
    try {
        // 1. confirm Admin role
        /*   if (((req.payload.role != "isAdmin") && (req.payload.role != "isSuperAdmin")))
              return res.status(400).send("No Permisions") */


        //2. check user
        let users = await User.find();
        if (!users) return res.status(400).send("No users")

        //3. map and pick
        users = _.map(users, (user) => _.pick(user, [
            "_id",
            "firstName",
            "middleName",
            "lastName",
            "phone",
            "email",
            "password",
            "imageUrl",
            "imageAlt",
            "state",
            "country",
            "city",
            "street",
            "houseNumber",
            "zip",
            "role",]))

        //4. return response
        res.status(200).send(users)

    } catch (error) {
        res.status(400).send(error)
    }
})
//Get logged in user by token
//Get user details
router.get("/:_id", auth, async (req, res) => {

    try {
        //1.Get user by token
        const user = await User.findById(req.payload._id);


        if (!user) return res.status(400).send("No such user")
        //2.Return response

        res.status(200).send(_.pick(user, [

            "firstName",
            "middleName",
            "lastName",
            "phone",
            "email",
            "password",
            "imageUrl",
            "imageAlt",
            "state",
            "country",
            "city",
            "street",
            "houseNumber",
            "zip",
            "role",],

        )
        )

    } catch (error) {
        res.status(400).send(error)
    }
});
//Search system
router.get("/search/:key", async (req, res) => {
    let data = await User.find(
        {
            "$or": [
                { firstName: { $regex: req.params.key } },
                { lastName: { $regex: req.params.key } },
                { email: { $regex: req.params.key } },
                { phone: { $regex: req.params.key } },
                { role: { $regex: req.params.key } },

            ]
        }
    );
    res.send(data);
})




// DELETE USER
router.delete("/:_id", auth, async (req, res) => {

    try {
        if (!(req.payload.role <= 0) && (req.payload._id === req.params._id))
            return res.status(400).send("Only Admin / logged in users are allowed to update user profile")

        //1. check&get user by req _id
        let cart = await Cart.findOneAndDelete({ userId: req.params._id });
        const user = await User.findOneAndDelete({ _id: req.params._id });

        if ((!user) && (!cart)) return res.status(400).send("No such user")

        //2. return response
        res.status(200).send(_.pick(user, [
            "firstName",
            "middleName",
            "lastName",
            "phone",
            "email",
            "password",
            "imageUrl",
            "imageAlt",
            "state",
            "country",
            "city",
            "street",
            "houseNumber",
            "zip",
            "role",]))

    } catch (error) {
        res.status(400).send(error)
    }
})
module.exports = router;