const express = require('express');
const router = express.Router();
const { Order, OrderItem, Product, User, Refund } = require('../models');
const yup = require('yup');
const { validateToken } = require('../middleware/validateToken');

router.get('/:orderId', validateToken, async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findOne({
            where: { 
                user_id: req.user.id,
                id: orderId
            }, 
            include: [
                {
                    model: OrderItem,
                    include: [ Product ]
                },
                {
                    model: User,
                    attributes: ["email"],
                },
            ]
        });
        
        if (!order || order.order_status !== 6) {
            res.status(404).json({ error: 'No refund processing found for this order' });
            return;
        }

        res.json(order);
    } catch (error) {
        console.log('Error retrieving order with refund processing:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', validateToken, async (req, res) => {
    const schema = yup.object().shape({
        order_id: yup.number().integer().required(),
        refund_reason: yup.string().required(),
        refund_amount: yup.number().required()
    });

    try {
        const body = await schema.validate(req.body, { abortEarly: false });

        const order = await Order.findOne({
            where: { id: body.order_id, user_id: req.user.id }
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Set order_status to 6 (Refund Processing)
        order.order_status = 6;
        await order.save();

        // Create a refund record in Refund table
        const refund = await Refund.create({
            order_id: order.id,
            user_id: req.user.id,
            refund_reason: body.refund_reason,
            refund_amount: body.refund_amount
        });

        res.json({ order, refund });
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
});

module.exports = router;
