const express = require("express")
const router = express.Router()
const { Cart, Product, Order, OrderItem, User } = require("../models")
const { validateToken } = require("../middleware/validateToken")

// Get all items in cart
router.get('/', validateToken, async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findAll({
            attributes: {
                exclude: ["createdAt"]
            },
            include: [
                {
                  model: Product,
                  attributes: ["id","product_name", "product_price", "product_stock", "product_picture", "product_status"],
                },
              ],
            where: { user_id: userId },
        });
        res.json(cart);
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add single item to cart
router.post("/", validateToken, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (!product.product_status) {
            return res.status(400).json({ message: "This product is not available for purchase" });
        }

        if (product.product_stock < quantity) {
            return res.status(400).json({ message: "Insufficient product stock" });
        }

        const itemInCart = await Cart.findOne({ where: { product_id: productId, user_id: userId } });

        if (itemInCart) {
            const newQuantity = itemInCart.quantity + quantity;
            if (product.product_stock < newQuantity) {
                return res.status(400).json({ message: "Insufficient product stock" });
            }

            itemInCart.quantity = newQuantity;
            await itemInCart.save();
        } else {
            await Cart.create({ product_id: productId, user_id: userId, quantity });
        }

        return res.status(201).json({ message: "Product added to cart" });
    } catch (error) {
        console.error("Error adding product to cart:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// Remove single item from cart
router.delete("/:id", validateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const itemInCart = await Cart.findOne({ where: { id, user_id: userId } });

        if (!itemInCart) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        await itemInCart.destroy();
        return res.json({ message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// Update quantity of single item in cart
router.put("/:id", validateToken, async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    try {
        const itemInCart = await Cart.findOne({ where: { id, user_id: userId } });

        if (!itemInCart) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        const product = await Product.findByPk(itemInCart.product_id);
        if (!product || product.product_stock < quantity) {
            return res.status(400).json({ message: "Insufficient product stock" });
        }

        itemInCart.quantity = quantity;
        await itemInCart.save();

        return res.json({ message: "Cart updated" });
    } catch (error) {
        console.error("Error updating cart:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

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

//Remove multiple items from cart
router.post("/removeItems", validateToken, async (req, res) => {
    const { itemsToRemove } = req.body; // expect itemsToRemove to be an array of ids
    const userId = req.user.id;

    try {
        await Cart.destroy({ where: { id: itemsToRemove, user_id: userId } });
        return res.json({ message: "Items removed from cart" });
    } catch (error) {
        console.error("Error removing items from cart:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
})

// Create new order
router.post('/checkout/confirm', async (req, res) => {
    const { order, orderItems } = req.body;
    
    try {
        // Create order
        const newOrder = await Order.create(order);

        // Create orderItems and associate them with the created order
        const newOrderItems = await Promise.all(
            orderItems.map(item => OrderItem.create({ ...item, order_id: newOrder.id }))
        );

        res.status(201).json({ orderId: newOrder.id, orderItems: newOrderItems });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while creating the order.');
    }
});

module.exports = router;

module.exports = router
