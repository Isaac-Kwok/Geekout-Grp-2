const { Order, User, Transaction, OrderItem, Product } = require("../models")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const express = require("express");
const router = express.Router()
const yup = require("yup");
const moment = require("moment")
const ejs = require("ejs")
require('dotenv').config();
const path = require('path')
const { emailSender } = require("../middleware/emailSender")
const { validateToken } = require("../middleware/validateToken");

router.post("/webhook", async (req, res) => {
    // Handle webhook
    // PayementIntent object
    const data = req.body.data.object
    const productPath = `${req.protocol + '://' + req.get('host')}/admin/products/productImage/`

    // Check if the paymentIntent is succeeded
    if (data.status === "succeeded") {
        // Update the transaction
        // Check whether the request is genuine
        const transaction = await Transaction.findOne({
            where: {
                paymentIntent_id: data.id
            }
        })
        if (transaction) {
            if (transaction.status === "Succeeded") {
                return res.status(200).json({ message: "Webhook received." })
            }

            transaction.status = "Succeeded"
            if (transaction.type === "topup") {
                const user = await User.findByPk(transaction.user_id)
                user.cash = parseFloat(user.cash) + parseFloat(transaction.amount)
                await user.save()
            } else if (transaction.type === "purchase") {
                const order = await Order.findByPk(transaction.order_id)
                const orderItems = await OrderItem.findAll({
                    where: {
                        order_id: order.id
                    },
                    include: {
                        model: Product,
                    }
                })

                console.log(orderItems)

                for (let i = 0; i < orderItems.length; i++) {
                    const orderItem = orderItems[i]

                    // Check if the product is a pass
                    if (orderItem.Product.pass_category_status) {
                        // Add days to the user's pass expiry date times the quantity
                        console.log("boom")
                        const user = await User.findByPk(order.user_id)
                        if (user.bike_pass_expiry < new Date()) {
                            user.bike_pass_expiry = moment(user.bike_pass_expiry || new Date()).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                        } else {
                            user.bike_pass_expiry = moment(user.bike_pass_expiry).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                        }
                        await user.save()
                    }
                }

                order.order_status = 1
                order.order_payment_method = "Stripe"
                await order.save()

                const populatedOrderItems = await Promise.all(
                    orderItems.map(async orderItem => {
                        const product = await Product.findByPk(orderItem.Product.id);
                        let productPictures = product.product_picture;

                        // If product_picture is a string representation of a JSON array
                        if (typeof productPictures === 'string') {
                            productPictures = JSON.parse(productPictures);
                        }

                        // Assuming productPictures is now an array
                        if (Array.isArray(productPictures) && productPictures.length > 0) {
                            product.product_picture = productPath + productPictures[0];  // Take the first picture and prepend the path
                        }

                        return {
                            ...orderItem.get({ plain: true }),
                            Product: product
                        };
                    })
                );

                const user = await User.findByPk(order.user_id);
                if (!user) {
                    throw new Error("User not found");
                }

                // Send email
                const link = process.env.CLIENT_URL + `/profile/orders/${order.id}`;

                // Render email content using EJS template
                const html = await ejs.renderFile("templates/orderSummary.ejs", {
                    name: user.name,
                    orderItems: populatedOrderItems,  // Now this includes product details
                    subtotal_amount: order.subtotal_amount,
                    gst_amount: order.gst_amount,
                    total_amount: order.total_amount,
                    delivery_address: order.delivery_address,
                    url: link
                });

                // Send email
                await emailSender.sendMail({
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Order Confirmation',
                    html: html
                });



            }
            await transaction.save()


        }
    }
    res.status(200).json({ message: "Webhook received." })
})

router.post("/topup", validateToken, async (req, res) => {
    // Top up
    // Create a PaymentIntent
    const schema = yup.object().shape({
        amount: yup.number().required().min(1),
    })

    try {
        await schema.validate(req.body, { abortEarly: false })
        const { amount } = req.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // changed by samuel so that his checkout page can work
            currency: "sgd",
            automatic_payment_methods: { enabled: true },
        })

        const transaction = await Transaction.create({
            amount: amount,
            type: "topup",
            status: "Pending",
            paymentIntent_id: paymentIntent.id,
            paymentIntent_client_secret: paymentIntent.client_secret,
            user_id: req.user.id,
            operator: "+"
        })

        res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (err) {
        res.status(400).json({ message: err.errors[0] })
    }
})

router.post("/withdraw", validateToken, async (req, res) => {
    // Withdraw
    // find user and check if user has enough cash

    const schema = yup.object().shape({
        amount: yup.number().required().min(1),
    })

    try {
        await schema.validate(req.body, { abortEarly: false })
        const { amount } = req.body
        const user = await User.findByPk(req.user.id)

        if (parseFloat(user.cash) < parseFloat(amount)) {
            res.status(400).json({ message: "Insufficient funds." })
            return
        }

        user.cash = parseFloat(user.cash) - parseFloat(amount)

        await Transaction.create({
            amount: amount,
            type: "withdraw",
            status: "Succeeded",
            user_id: req.user.id,
            operator: "-"
        })

        await user.save()

        res.status(200).json({ message: "Withdrawal successful." })
    } catch (err) {
        res.status(400).json({ message: err.errors[0] })
    }
})

router.post("/purchase/stripe", validateToken, async (req, res) => {
    // Top up
    // Create a PaymentIntent
    const schema = yup.object().shape({
        amount: yup.number().required().min(1),
        order_id: yup.number().required().min(1),
    })

    try {
        await schema.validate(req.body, { abortEarly: false })
        const { amount, order_id } = req.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // changed by samuel so that his checkout page can work
            currency: "sgd",
            automatic_payment_methods: { enabled: true },
        })

        const transaction = await Transaction.create({
            amount: amount,
            type: "purchase",
            status: "Pending",
            paymentIntent_id: paymentIntent.id,
            paymentIntent_client_secret: paymentIntent.client_secret,
            user_id: req.user.id,
            operator: "+",
            order_id: order_id
        })

        res.status(200).json({ clientSecret: paymentIntent.client_secret })
    } catch (err) {
        console.log(err)
        res.status(400).json({ message: err.errors[0] })
    }
})

router.get("/purchase/wallet/settle/:id", validateToken, async (req, res) => {
    // Get Order
    try {
        const { id } = req.params
        const productPath = `${req.protocol + '://' + req.get('host')}/admin/products/productImage/`


        const order = await Order.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        })

        const transaction = await Transaction.findOne({
            where: {
                order_id: id
            }
        })

        if (!order) {
            res.status(404).json({ message: "Order not found." })
            return
        }

        if (!transaction) {
            res.status(404).json({ message: "Transaction not found." })
            return
        }

        if (order.order_status > 0) {
            res.status(400).json({ message: "Order has already been settled." })
            return
        }

        const user = await User.findByPk(req.user.id)

        if (parseFloat(user.cash) < parseFloat(order.total_amount)) {
            res.status(400).json({ message: "Insufficient funds." })
            return
        }

        user.cash = parseFloat(user.cash) - parseFloat(order.total_amount)
        await user.save()

        const orderItems = await OrderItem.findAll({
            where: {
                order_id: order.id
            },
            include: {
                model: Product,
            }
        })

        console.log(orderItems)

        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = orderItems[i]

            // Check if the product is a pass
            if (orderItem.Product.pass_category_status) {
                // Add days to the user's pass expiry date times the quantity
                const user = await User.findByPk(order.user_id)
                if (user.bike_pass_expiry < new Date()) {
                    user.bike_pass_expiry = moment(user.bike_pass_expiry || new Date()).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                } else {
                    user.bike_pass_expiry = moment(user.bike_pass_expiry).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                }
                await user.save()
            }
        }

        order.order_status = 1
        order.order_payment_method = "Wallet"
        await order.save()


        const populatedOrderItems = await Promise.all(
            orderItems.map(async orderItem => {
                const product = await Product.findByPk(orderItem.Product.id);
                let productPictures = product.product_picture;

                // If product_picture is a string representation of a JSON array
                if (typeof productPictures === 'string') {
                    productPictures = JSON.parse(productPictures);
                }

                // Assuming productPictures is now an array
                if (Array.isArray(productPictures) && productPictures.length > 0) {
                    product.product_picture = productPath + productPictures[0];  // Take the first picture and prepend the path
                }

                return {
                    ...orderItem.get({ plain: true }),
                    Product: product
                };
            })
        );

        // Send email
        const link = process.env.CLIENT_URL + `/profile/orders/${order.id}`;

        // Render email content using EJS template
        const html = await ejs.renderFile("templates/orderSummary.ejs", {
            name: user.name,
            orderItems: populatedOrderItems,  // Now this includes product details
            subtotal_amount: order.subtotal_amount,
            gst_amount: order.gst_amount,
            total_amount: order.total_amount,
            delivery_address: order.delivery_address,
            url: link
        });

        // Send email
        await emailSender.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation',
            html: html
        });

        transaction.status = "Succeeded"
        await transaction.save()

        res.status(200).json({ message: "Order settled." })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get("/purchase/point/settle/:id", validateToken, async (req, res) => {
    // Get Order
    try {
        const { id } = req.params
        const productPath = `${req.protocol + '://' + req.get('host')}/admin/products/productImage/`


        const order = await Order.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        })

        const transaction = await Transaction.findOne({
            where: {
                order_id: id
            }
        })

        if (!order) {
            res.status(404).json({ message: "Order not found." })
            return
        }

        if (!transaction) {
            res.status(404).json({ message: "Transaction not found." })
            return
        }

        if (order.order_status > 0) {
            res.status(400).json({ message: "Order has already been settled." })
            return
        }

        const user = await User.findByPk(req.user.id)
        const p = (order.subtotal_amount * 100).toFixed(0)

        if (user.points < p) {
            res.status(400).json({ message: "Insufficient funds." })
            return
        }

        user.points = parseFloat(user.points) - parseFloat(p)
        await user.save()

        const orderItems = await OrderItem.findAll({
            where: {
                order_id: order.id
            },
            include: {
                model: Product,
            }
        })

        console.log(orderItems)

        for (let i = 0; i < orderItems.length; i++) {
            const orderItem = orderItems[i]

            // Check if the product is a pass
            if (orderItem.Product.pass_category_status) {
                // Add days to the user's pass expiry date times the quantity
                const user = await User.findByPk(order.user_id)
                if (user.bike_pass_expiry < new Date()) {
                    user.bike_pass_expiry = moment(user.bike_pass_expiry || new Date()).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                } else {
                    user.bike_pass_expiry = moment(user.bike_pass_expiry).add(orderItem.Product.duration_of_pass * orderItem.quantity, "days").toDate()
                }
                await user.save()
            }
        }

        transaction.status = "Succeeded"
        await transaction.save()
        
        order.points_used = p
        order.order_status = 1
        order.order_payment_method = "Points"
        await order.save()

        const populatedOrderItems = await Promise.all(
            orderItems.map(async orderItem => {
                const product = await Product.findByPk(orderItem.Product.id);
                let productPictures = product.product_picture;

                // If product_picture is a string representation of a JSON array
                if (typeof productPictures === 'string') {
                    productPictures = JSON.parse(productPictures);
                }

                // Assuming productPictures is now an array
                if (Array.isArray(productPictures) && productPictures.length > 0) {
                    product.product_picture = productPath + productPictures[0];  // Take the first picture and prepend the path
                }

                return {
                    ...orderItem.get({ plain: true }),
                    Product: product
                };
            })
        );

        // Send email
        const link = process.env.CLIENT_URL + `/profile/orders/${order.id}`;

        // Render email content using EJS template
        const html = await ejs.renderFile("templates/orderSummary.ejs", {
            name: user.name,
            orderItems: populatedOrderItems,  // Now this includes product details
            subtotal_amount: order.subtotal_amount,
            gst_amount: order.gst_amount,
            total_amount: order.total_amount,
            delivery_address: order.delivery_address,
            url: link
        });

        // Send email
        await emailSender.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Order Confirmation',
            html: html
        });


        res.status(200).json({ message: "Order settled." })
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get("/history", validateToken, async (req, res) => {
    // Get history
    try {
        const { type } = req.query
        const condition = type ? {
            user_id: req.user.id,
            type
        } : {
            user_id: req.user.id
        }

        const transactions = await Transaction.findAll({
            where: {
                ...condition
            },
            order: [["createdAt", "DESC"]]
        })

        res.status(200).json(transactions)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.get("/history/:id", validateToken, async (req, res) => {
    // Get history
    try {
        const { id } = req.params
        const transaction = await Transaction.findOne({
            where: {
                id: id,
                user_id: req.user.id
            }
        })

        if (!transaction) {
            res.status(404).json({ message: "Transaction not found." })
        }

        res.status(200).json(transaction)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

module.exports = router;