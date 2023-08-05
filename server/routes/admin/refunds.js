const express = require('express');
const router = express.Router();
const { Refund, Order, User } = require('../../models');
const yup = require('yup');
const { validateAdmin } = require('../../middleware/validateAdmin');

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

router.get('/', validateAdmin, async (req, res) => {
    try {
        const refund = await Refund.findAll({
            include: [
                {
                    model: Order,
                },
                {
                    model: User,
                    attributes: ["email"],
                },
            ],
        });
        res.json(refund);
    } catch (error) {
        console.error("Error retrieving products:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get single refund
router.get('/:id', validateAdmin, async (req, res) => {
    let id = req.params.id;
    let refund = await Refund.findOne({
        where: { id: id },
        include: [
            {
                model: Order,
            },
            {
                model: User,
                attributes: ["email"],
            },
        ],
    });

    if (!refund) {
        res.status(404).json({ error: 'Refund not found' });
        return;
    }
    res.json(refund);
});


// Update refund status
router.put('/:id', validateAdmin, async (req, res) => {
    const schema = yup.object().shape({
        status: yup.number().integer().min(1).max(8).required(),
        refund_status: yup.string().oneOf(['Approved', 'Rejected']).required()
    });

    try {
        const body = await schema.validate(req.body, { abortEarly: false });
        const refund = await Refund.findByPk(req.params.id, {
            include: [Order],
        });

        if (!refund) {
            return res.status(404).json({message: 'Refund not found'});
        }

        const order = refund.Order;
        await order.update({
            order_status: body.status
        });

        await refund.update({
            refund_status: body.refund_status,
            refund_date: new Date()
        });

        res.json({
            refund: refund,
            order: order
        });
    } catch (error) {
        res.status(400).json({ message: error.errors });
    }
});



module.exports = router;
