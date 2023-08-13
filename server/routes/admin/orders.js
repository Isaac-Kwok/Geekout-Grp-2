const express = require('express');
const router = express.Router();
const { Order, User, Product, OrderItem } = require('../../models');
const yup = require('yup');
const { validateAdmin } = require('../../middleware/validateAdmin');
const ejs = require('ejs');
const { emailSender } = require('../../middleware/emailSender');
const order_status = {
    1: "Preparing",
    2: "Wait for delivery",
    3: "Delivered",
    4: "Received",
    5: "Cancelled",
    6: "Refund Processing",
    7: "Refund Approved",
    8: "Refund Denied"
};

// Get all orders
router.get('/', validateAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                  model: User,
                  attributes: ["email"],
                },
              ],
        });
        console.log(orders)
        res.json(orders);
    } catch (error) {
        console.log('Error retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single order
router.get('/:id', validateAdmin, async (req, res) => {
    let id = req.params.id;
    let order = await Order.findOne({
        where: { id: id },
        include: [
            {
              model: User,
              attributes: ["email"],
            },
            {
                model: OrderItem,
                include: [
                    {
                        model: Product,
                        attributes: ["id","product_name", "product_price", "product_stock", "product_picture", "product_status"],
                    }
                ]
            },
        ],
    });

    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }

    order = order.toJSON();  

    order.OrderItems.forEach(orderItem => {
        if (typeof orderItem.Product.product_picture === "string") {
            orderItem.Product.product_picture = JSON.parse(orderItem.Product.product_picture);
        }
    });

    order.order_status = order_status[order.order_status];
    res.json(order);
});



// Update order status
router.put('/:id', validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
        status: yup.number().integer().min(1).max(6).required(),
    });

    try {
        const body = await schema.validate(req.body, { abortEarly: false });
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        await order.update({
            order_status: body.status
        });

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
});



module.exports = router;
