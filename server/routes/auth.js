const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../models")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.post("/", async (req, res) => {
    // Authenticate a user
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        password: yup.string().required().min(12).max(64),
    })

    try {
        await schema.validate(req.body, { abortEarly: false })
        const { email, password } = req.body
        const user = await User.findByPk(email)
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." })
            return
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid email or password." })
            return
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
        res.json({ token, user: { email: user.email, name: user.name, account_type: user.account_type } })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router