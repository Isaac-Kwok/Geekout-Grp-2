const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../../models")
const router = express.Router()
const { validateAdmin } = require("../../middleware/validateAdmin")

router.get("/", validateAdmin, async (req, res) => {
    // Get all users
    const users = await User.findAll({
        attributes: {
            exclude: ["password", "is_email_verified", "createdAt", "updatedAt"]
        }
    })
    res.json(users)
})


module.exports = router