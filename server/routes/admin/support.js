const express = require("express")
const yup = require("yup")
const { Article } = require("../../models")
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




module.exports = router;