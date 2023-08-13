const express = require("express")
const yup = require("yup")
const { Product, Sequelize } = require("../models")
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const product = await Product.findAll({
            attributes: {
                exclude: ["createdAt"]
            },
        });
        res.json(product);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
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
    if (typeof product.product_picture === "string") {
        product.product_picture = JSON.parse(product.product_picture);
    }

    res.json(product);
});

router.get("/productImage/:filename", (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = path.join(__dirname, "../../public/uploads/products/");
    
    res.sendFile(directoryPath + fileName, fileName);
})

module.exports = router
