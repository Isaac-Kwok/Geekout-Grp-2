const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../models")
const router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { validateToken } = require('../middleware/validateToken');

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

        let userInfo = {
            email: user.email,
            name: user.name,
            account_type: user.account_type,
            profile_picture: user.profile_picture,
            profile_picture_type: user.profile_picture_type,
        }

        const token = jwt.sign(userInfo, process.env.APP_SECRET, { expiresIn: "1d" })
        res.json({ token, user: userInfo })
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get("/validate", validateToken, (req, res) => {
    let userInfo = {
        email: req.user.email,
        name: req.user.name,
        account_type: req.user.account_type,
        profile_picture: req.user.profile_picture,
        profile_picture_type: req.user.profile_picture_type,
    };
    res.json({
        user: userInfo
    });
});
module.exports = router