const express = require("express");
const yup = require("yup");
const router = express.Router();
const { Article, User, Sequelize } = require("../models")
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

module.exports = router;