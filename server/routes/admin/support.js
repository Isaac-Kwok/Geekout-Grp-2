const express = require("express")
const yup = require("yup")
const { Article, Ticket, Message, User } = require("../../models")
const router = express.Router()
const { validateAdmin } = require("../../middleware/validateAdmin")
const { uploadArticlePicture } = require("../../middleware/upload")
const path = require("path")
const fs = require("fs")


router.post("/article/upload", validateAdmin, uploadArticlePicture, async (req, res) => {
    try {
        res.json({ filename: req.file.filename })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/article", validateAdmin, async (req, res) => {
    try {
        const articles = await Article.findAll()
        res.status(200).json(articles)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/article/:id", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findOne({ where: { id: id } })
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/article", validateAdmin, async (req, res) => {
    try {
        const { title, content, image, isPublished } = req.body
        const schema = yup.object().shape({
            title: yup.string().required(),
            content: yup.string().required(),
            image: yup.string().required(),
            isPublished: yup.boolean().required()
        })
        await schema.validate({
            title,
            content,
            image,
            isPublished
        })
        const article = await Article.create({
            title: title,
            content: content,
            image: image,
            isPublished: isPublished,
            user_id: req.user.id
        })

        res.status(201).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put("/article/:id", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const schema = yup.object().shape({
            title: yup.string().optional(),
            content: yup.string().optional(),
            image: yup.string().optional(),
            isPublished: yup.boolean().optional()
        }).noUnknown()

        const body = await schema.validate(req.body, { abortEarly: false })
        const article = await Article.findOne({ where: { id: id } })

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        if (body.image) {
            // Delete old article image
            const directoryPath = path.join(__dirname, "../../public/uploads/article/")
            fs.unlinkSync(directoryPath + article.image)
        }

        await article.update({...body})
        res.status(200).json(article)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete("/article/:id", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const article = await Article.findOne({ where: { id: id } })

        if (!article) {
            return res.status(404).json({ message: "Article not found" })
        }

        // Delete article image
        const directoryPath = path.join(__dirname, "../../public/uploads/article/")
        fs.unlinkSync(directoryPath + article.image)

        await article.destroy()
        res.status(200).json({ message: "Article deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/ticket", validateAdmin, async (req, res) => {
    try {
        const tickets = await Ticket.findAll()
        res.status(200).json(tickets)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/ticket/:id", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findOne({ where: { id: id } })
        res.status(200).json(ticket)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/ticket/:id/message", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const { message } = req.body
        const schema = yup.object().shape({
            message: yup.string().required()
        })
        await schema.validate({
            message
        })

        const ticket = await Ticket.findOne({ where: { id: id } })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        const newMessage = await Message.create({
            message: message,
            ticket_id: ticket.id,
            user_id: req.user.id
        }, {
            include: {
                model: User,
                attributes: ["id", "name", "account_type"]
            }
        })

        const sendingMessage = await Message.findByPk(newMessage.id, {
            include: {
                model: User,
                attributes: ["id", "name", "account_type"]
            }
        })

        req.app.io.to(`support_${ticket.id}`).emit("ticket_message", sendingMessage)
        res.status(201).json(sendingMessage)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get("/ticket/:id/message", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findOne({ where: { id: id } })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        // Find all messages of ticket and include user
        const messages = await Message.findAll({
            where: { ticket_id: ticket.id },
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

// Close ticket
router.delete("/ticket/:id", validateAdmin, async (req, res) => {
    try {
        const { id } = req.params
        const ticket = await Ticket.findOne({ where: { id: id } })

        if (!ticket) {
            return res.status(404).json({ message: "Ticket not found" })
        }

        await ticket.update({ status: "Closed"})

        res.status(200).json({ message: "Ticket closed" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})




module.exports = router;