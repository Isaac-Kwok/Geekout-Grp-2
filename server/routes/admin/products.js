const express = require('express');
const router = express.Router();
const { User, Sequelize, Product } = require('../../models');
const yup = require("yup");
const path = require('path');
const jwt = require("jsonwebtoken")
const ejs = require("ejs")
const { emailSender } = require("../../middleware/emailSender")
const { validateAdmin } = require("../../middleware/validateAdmin");
const { upload_picture } = require('../../middleware/upload');

router.get("/", validateAdmin, async (req, res) => {
    try {
        const products = await Product.findAll({
            attributes: {
                exclude: ["createdAt"]
            }
        });
        res.json(products);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// Get file
router.get("/productImage/:filename", (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = path.join(__dirname, "../../public/uploads/products/");
    
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})
// Upload file
router.post('/upload',validateAdmin, upload_picture, (req, res) => {
    res.json({ filename: req.file.filename });
});


router.post("/create", validateAdmin,upload_picture,  async (req, res) => {
    let data = req.body;
    // Create new product
    let validationSchema = yup.object().shape({
        product_name: yup.string().trim().min(3).max(100).required(),
        product_category: yup.string().trim().required(),
        product_sub_category: yup.string().trim().required(),
        pass_category_status: yup.bool(),
        product_stock: yup.number().integer().required(),
        product_description: yup.string().trim().min(3).max(1000).required(),
        product_picture: yup.string(),
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
    data.product_sub_category = data.product_sub_category.trim()
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
    });
    // Check id not found
    if (!product) {
        res.sendStatus(404);
        return;
    }
    res.json(product);
});

router.put("/status/:id", validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
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

router.put("/:id", validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
        product_name: yup.string().trim().min(3).max(100).required(),
        product_category: yup.string().trim().required(),
        product_sub_category: yup.string().trim().required(),
        pass_category_status: yup.bool(),
        product_stock: yup.number().integer().required(),
        product_description: yup.string().trim().min(3).max(1000).required(),
        product_picture: yup.string(),
        product_price: yup.number().positive().integer().required(),
        product_sale: yup.bool(),
        product_discounted_percent: yup.number().positive().integer().required(),
        duration_of_pass: yup.number().integer(),
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

router.post("/:id/upload", validateAdmin, async (req, res) => {
    // Upload profile pictures
    const product = await Product.findByPk(req.params.id);
    if (!product) {
        return res.status(404).json({message: "Product not found"});
    } else {
        await uploadProductPicture(req, res);
    }
    
    // Assume product.product_pictures is an array of picture URLs
    product.product_pictures = req.files.map(file => "//" + req.headers.host + `/uploads/products/${product.id}-${file.filename}`);
    product.product_picture_type = "local";
    await product.save();
    
    res.json(product);
});




module.exports = router;