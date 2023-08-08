const { Wishlist, Product, User } = require("../models");
const { validateToken } = require("../middleware/validateToken");
const express = require("express")
const router = express.Router()

// Get all items in wishlist
router.get('/', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const wishlist = await Wishlist.findAll({
            include: [
                {
                    model: Product,
                    attributes: ["id", "product_name", "product_price", "product_stock", "product_picture", "product_status"],
                },
            ],
            where: { user_id: userId },
        });
        res.json(wishlist);
    } catch (error) {
        console.error("Error retrieving wishlist:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a single item from the wishlist
router.get("/:productId", validateToken, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const itemInWishlist = await Wishlist.findOne({
            include: [
                {
                    model: Product,
                    attributes: ["id", "product_name", "product_price", "product_stock", "product_picture", "product_status"],
                },
            ],
            where: { product_id: productId, user_id: userId }
        });

        if (!itemInWishlist) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }

        return res.json(itemInWishlist);
    } catch (error) {
        console.error("Error retrieving item from wishlist:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


// Add single item to wishlist
router.post("/", validateToken, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const itemInWishlist = await Wishlist.findOne({ where: { product_id: productId, user_id: userId } });

        if (itemInWishlist) {
            return res.status(400).json({ message: "Product already in wishlist" });
        } else {
            await Wishlist.create({ product_id: productId, user_id: userId });
        }


        return res.status(201).json({ message: "Product added to wishlist" });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// Remove single item from wishlist
router.delete("/:productId", validateToken, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        const itemInWishlist = await Wishlist.findOne({ where: { product_id: productId, user_id: userId } });

        if (!itemInWishlist) {
            return res.status(404).json({ message: "Item not found in wishlist" });
        }

        await itemInWishlist.destroy();
        return res.json({ message: "Item removed from wishlist" });
    } catch (error) {
        console.error("Error removing item from wishlist:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})


// Clear wishlist
router.delete("/", validateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        await Wishlist.destroy({ where: { user_id: userId } });
        return res.json({ message: "Wishlist cleared" });
    } catch (error) {
        console.error("Error clearing wishlist:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

module.exports = router;
