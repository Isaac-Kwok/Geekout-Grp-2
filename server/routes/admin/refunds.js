const express = require('express');
const router = express.Router();
const { Refund, Order, User } = require('../../models');
const yup = require('yup');
const { validateAdmin } = require('../../middleware/validateAdmin');
const ejs = require("ejs")
require('dotenv').config();
const path = require('path')
const { emailSender } = require("../../middleware/emailSender")

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

        const user = await User.findByPk(order.user_id);
        if (!user) {
            throw new Error("User not found");
        }

        const link = process.env.CLIENT_URL + `/profile/orders/${order.id}`;

        if (body.refund_status === 'Approved') {
            const html = await ejs.renderFile("templates/refundAcceptReply.ejs", {
                name: user.name,
                refund_id: refund.id,
                url: link
            });

            await emailSender.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Refund Reply',
                html: html
            });
            

        } else if (body.refund_status === 'Rejected') {
            const html = await ejs.renderFile("templates/refundRejectedReply.ejs", {
                name: user.name,
                refund_id: refund.id,
                url: link
            });

            await emailSender.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Refund Reply',
                html: html
            });
            
        }
        res.json({
            refund: refund,
            order: order
        });
    } catch (error) {
        console.error(error);  
        if (error instanceof yup.ValidationError) {
            res.status(400).json({ message: error.errors });
        } else {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    
});



module.exports = router;
