const express = require('express');
const router = express.Router();
const { Order, User } = require('../../models');
const yup = require('yup');
const { validateAdmin } = require('../../middleware/validateAdmin');
const ejs = require('ejs');
const { emailSender } = require('../../middleware/emailSender');

// Get all orders
router.get('/', validateAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.json(orders);
    } catch (error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single order
router.get('/:id', validateAdmin, async (req, res) => {
    let id = req.params.id;
    let order = await Order.findByPk(id);

    if (!order) {
        res.status(404).json({ error: 'Order not found' });
        return;
    }

    res.json(order);
});

// Update order status
router.put('/:id', validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
        status: yup.number().integer().min(1).max(6).required()
    });

    try {
        const body = await schema.validate(req.body, { abortEarly: false });
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        await order.update({
            ...body
        });

        // Send email to user with updated order status (assuming you have a function for this)
        const user = await User.findByPk(order.userId);
        await emailSender(user.email, 'Order status updated', ejs.renderFile('./emailTemplates/orderStatus.ejs', { order }));

        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
});

// Cancel order
router.put('/:id/cancel', validateAdmin, async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.update({ status: 5 });

        res.json(order);
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
