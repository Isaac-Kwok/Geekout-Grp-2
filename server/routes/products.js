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
    res.json(product);
});

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

module.exports = router
