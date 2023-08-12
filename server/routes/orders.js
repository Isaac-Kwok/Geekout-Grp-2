const express = require('express');
const router = express.Router();
const { Order, User, OrderItem, Product, Refund, Transaction } = require('../models');
const { Op } = require('sequelize');
const yup = require('yup');
const { validateToken } = require('../middleware/validateToken');

const order_status = {
    0: "Pending",
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
router.get('/', validateToken, async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: {
                user_id: req.user.id,
                order_status: {
                    [Op.notIn]: [0]
                }
            },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: User,
                    attributes: ["email"],
                },
                {
                    model: Refund,
                }
            ]
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
    } catch (error) {
        console.log('Error retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single order
router.get('/:orderId', validateToken, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        let order = await Order.findOne({
            where: {
                user_id: req.user.id,
                id: orderId
            },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                },
                {
                    model: User,
                    attributes: ["email"],
                },
                {
                    model: Refund,
                }
            ]
        });

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        order = order.toJSON();

        // Parsing product_picture if it's a string
        order.OrderItems.forEach(orderItem => {
            if (typeof orderItem.Product.product_picture === "string") {
                orderItem.Product.product_picture = JSON.parse(orderItem.Product.product_picture);
            }
        });

        order.order_status = order_status[order.order_status];

        res.json(order);
    } catch (error) {
        console.log('Error retrieving order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Change transaction payment method
router.put('/:orderId', validateToken, async (req, res) => {
    const orderId = req.params.orderId;
    const { payment_method } = req.body;
    try {
        let transaction = await Transaction.findOne({
            where: {
                user_id: req.user.id,
                order_id: orderId
            }
        });

        if (!transaction || transaction.status !== 'Pending') {
            res.status(404).json({ error: 'Transaction not found' });
            return;
        }

        transaction.payment_method = payment_method;
        await transaction.save();

        res.json({ message: 'Payment method updated' });
    } catch (error) {
        console.log('Error updating payment method:', error);
        res.status(500).json({ error: error.message });
    }
});


        

router.get('/refunds/:orderId', validateToken, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        let order = await Order.findOne({
            where: {
                user_id: req.user.id,
                id: orderId
            },
            include: [User]
        });

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        order = order.toJSON();
        order.order_status = order_status[order.order_status];
        res.json(order);
    } catch (error) {
        console.log('Error retrieving order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Set the order status to "Received"
router.put('/set-received/:orderId', validateToken, async (req, res) => {
    try {
        // Fetch the order by ID
        const order = await Order.findOne({
            where: {
                id: req.params.orderId,
                user_id: req.user.id // Ensure the order belongs to the user making the request
            }
        });

        // Check if order exists
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if the order's current status is "Delivered"
        if (order.order_status !== 3) {
            return res.status(400).json({ message: 'Order status is not "Delivered". Can\'t set to "Received".' });
        }

        // Update the order status to "Received"
        await order.update({ order_status: 4 });

        res.json({ message: 'Order status set to Received', order });

    } catch (error) {
        console.log('Error setting order status to Received:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
