const express = require('express');
const router = express.Router();
const { User, Sequelize, Product } = require('../../models');
const yup = require("yup");
const jwt = require("jsonwebtoken")
const ejs = require("ejs")
const { emailSender } = require("../../middleware/emailSender")
const { validateAdmin } = require("../../middleware/validateAdmin")

router.get("/", validateAdmin, async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: {
                exclude: ["createdAt", "updatedAt"]
            }
        });
        res.json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.post("/create", validateAdmin, async (req, res) => {
    let data = req.body;
    // Create new product
    let validationSchema = yup.object().shape({
        product_name: yup.string().trim().min(3).max(100).required(),
        product_category: yup.string().trim().required(),
        product_stock: yup.number().integer().required(),
        product_description: yup.string().trim().min(3).max(1000).required(),
        product_picture: yup.string(),
        product_picture_type: yup.string(),
        product_price: yup.number().positive().integer().required(),
        product_sale: yup.bool(),
        product_discounted_percent: yup.number().positive().integer().required(),
        duration_of_pass: yup.number().integer(),
        product_status: yup.bool()
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }

    data.product_name = data.product_name.trim();
    data.product_category = data.product_category.trim();
    data.product_stock = data.product_stock;
    data.product_description = data.product_description.trim();
    data.product_picture = data.product_picture;
    data.product_picture_type = data.product_picture_type;
    data.product_price = data.product_price;
    data.product_sale = data.product_sale;
    data.product_discounted_percent = data.product_discounted_percent;
    data.duration_of_pass = data.duration_of_pass;
    data.product_status = data.product_status;
    let result = await Product.create(data);
    res.json(result);
});



router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let product = await Product.findByPk(id, {
        //include: { model: User, as: "user", attributes: ['name'] }
    });
    // Check id not found
    if (!product) {
        res.sendStatus(404);
        return;
    }
    res.json(product);
});

router.put("/:id", validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
        product_name: yup.string().trim().min(3).max(100),
        product_category: yup.string().trim(),
        product_stock: yup.number().integer(),
        product_description: yup.string().trim().min(3).max(1000),
        product_picture: yup.string().trim(),
        product_picture_type: yup.string().trim(),
        product_price: yup.number().positive().integer(),
        product_sale: yup.bool(),
        product_discounted_percent: yup.number().positive().integer(),
        duration_of_pass_status: yup.bool(),
        duration_of_pass: yup.number().positive().integer(),
        product_status: yup.bool()
    });
    try {
        const body = await schema.validate(req.body, { abortEarly: false })
        const product = await Product.findByPk(req.params.id)
        if (!product) {
            return res.status(404).json({message:"Product not found"})
        }

        await product.update({
            ...body
        })

        res.json(product)
    } catch (error) {
        res.status(400).json({ message: error.errors })
    }

});

module.exports = router;