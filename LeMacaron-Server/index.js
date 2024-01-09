const express = require("express");
const mongoose = require("mongoose");
const products = require("./routes/products");
const carts = require("./routes/carts");
const users = require("./routes/users");
const orders = require("./routes/orders")
const logger = require("morgan");
const chalk = require("chalk");
const path = require('path');
const rfs = require('rotating-file-stream')
const cors = require("cors");
const multer = require("multer");
const Product = require("./models/Product");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 9600

mongoose
    .connect(process.env.DB, { useNewUrlParser: true })
    .then(() => console.log(chalk.bgGreenBright("MongoDB connected successfully!")))
    .catch((error) => console.log(chalk.red(error)));

const accessLogStream = rfs.createStream('errors.log', {
    interval: '1d',
    path: path.join(__dirname, 'logs')
})

app.use(logger("common"));
app.use(logger("common", { stream: accessLogStream, skip: function (req, res) { return res.statusCode < 400 } }));
app.use(express.json());
app.use(cors());

app.use(express.json())
app.use(cors())



app.use("/api/products", products)
app.use("/api/carts", carts)
app.use("/api/users", users)
app.use("/api/orders", orders)



app.get("*", (req, res) => {
    res.send("No existing route...")
})


app.listen(port, () => console.log(chalk.bgGreenBright("Server started on port", port)))