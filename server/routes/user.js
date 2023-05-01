const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../models")
const router = express.Router()

router.post("/", async (req, res) => {
    // Create a new user
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        name: yup.string().required(),
        password: yup.string().required().min(12).max(64),
    })

    try {
        const { email, name, password } = await schema.validate(req.body, { abortEarly: false })
        const newUser = await User.create({ email, name, password })
        res.json(newUser)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router