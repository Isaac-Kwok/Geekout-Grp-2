const express = require("express");
const yup = require("yup");
const router = express.Router();
const { Article, User, Sequelize, Ticket, Message } = require("../models")
const { Op } = Sequelize;
const { validateToken } = require("../middleware/validateToken");
const path = require("path");

router.get("/article/images/:filename", (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = path.join(__dirname, "../public/uploads/article/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            return res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})

router.get("/article", async (req, res) => {
    const { limit, q } = req.query
    const insertReadTime = (articles) => {
        const newArticles = articles.map((article) => {
            const words = article.content.split(" ")
            const readTime = Math.ceil(words.length / 200)
            return {
                ...article.dataValues,
                readTime
            }
        })
        return newArticles
    }

    let query = {
        order: [["createdAt", "DESC"]],
        where: { isPublished: true },
        include: {
            model: User,
            attributes: ["name", "email"]
        }
    }

    if (limit) {
        query = {
            ...query,
            limit: parseInt(limit)
        }
    }

    if (q) {
        query = {
            ...query,
            where: {
                title: {
                    [Op.like]: `%${q}%`
                }
            }
        }
    }

    try {
        const articles = await Article.findAll(query)
        res.status(200).json(insertReadTime(articles))
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/article/:id", async (req, res) => {
    try {
        const { id } = req.params
        // Get single article with user info from user table
        const article = await Article.findOne({
            where: { id: id, isPublished: true },
            include: {
                model: User,
                attributes: ["name", "email"]
            }
        })

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        const words = article.content.split(" ")
        const readTime = Math.ceil(words.length / 200)
        return res.status(200).json({
            ...article.dataValues,
            readTime
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


// Support ticket
router.post("/ticket", validateToken, async (req, res) => {
    const schema = yup.object().shape({
        title: yup.string().required(),
        description: yup.string().required(),
        category: yup.string().required(),
    }).noUnknown()

    try {
        const { title, description, category } = await schema.validate(req.body)
        const { id } = req.user

        const ticket = await Ticket.create({
            title,
            description,
            category,
            user_id: id
        })

        res.status(201).json(ticket)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get("/ticket", validateToken, async (req, res) => {
    try {
        const { id } = req.user
        const tickets = await Ticket.findAll({
            where: { user_id: id },
        })

        res.status(200).json(tickets)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/ticket/:id", validateToken, async (req, res) => {
    try {
        const { id } = req.params
        const { id: userId } = req.user
        
        const ticket = await Ticket.findOne({
            where: { id: id, user_id: userId },
            include: {
                model: User,
                attributes: ["name", "email"]
            }
        })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


router.post("/ticket/:id/message", validateToken, async (req, res) => {
    const schema = yup.object().shape({
        message: yup.string().required(),
    }).noUnknown()

    try {
        const { id } = req.params
        const { id: userId } = req.user
        const { message } = await schema.validate(req.body)

        const ticket = await Ticket.findOne({
            where: { id: id, user_id: userId },
        })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        if (ticket.status === "Closed" || ticket.user_id !== userId) {
            return res.status(403).json({ message: "You are not allowed to reply to this ticket" })
        }

        const newMessage = await Message.create({
            message,
            ticket_id: id,
            user_id: userId
        })

        const sendingMessage = await Message.findByPk(newMessage.id, {
            include: {
                model: User,
                attributes: ["id", "name", "account_type"]
            }
        })


        req.app.io.to(`support_${ticket.id}`).emit("ticket_message", sendingMessage)
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/ticket/:id/message", validateToken, async (req, res) => {
    try {
        const { id } = req.params
        const { id: userId } = req.user

        const ticket = await Ticket.findOne({
            where: { id: id, user_id: userId },
        })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        if (ticket.user_id !== userId) {
            return res.status(403).json({ message: "You are not allowed to view this ticket" })
        }

        const messages = await Message.findAll({
            where: { ticket_id: id },
            include: {
                model: User,
                attributes: ["id", "name", "account_type"]
            }
        })

        res.status(200).json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router;