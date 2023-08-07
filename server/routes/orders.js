const express = require('express');
const router = express.Router();
const { Order, User, OrderItem, Product, Refund } = require('../models');
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
            ]
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
module.exports = router;
