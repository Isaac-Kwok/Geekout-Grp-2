const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../../models")
const router = express.Router()
const jwt = require("jsonwebtoken")
const ejs = require("ejs")
const { emailSender } = require("../../middleware/emailSender")
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

router.get("/:id", validateAdmin, async (req, res) => {
    // Get user by id
    const user = await User.findByPk(req.params.id, {
        attributes: {
            exclude: ["password", "is_email_verified", "createdAt", "updatedAt"]
        }
    })
    if (!user) {
        return res.status(404).json({message: "User not found"})
    }
    res.json(user)
})

router.post("/", validateAdmin, async (req, res) => {
    // Create new user
    const schema = yup.object().shape({
        email: yup.string().email().required(),
        phone_number: yup.string().when("phone_number", (phone_number) => {
            if (phone_number.length > 0) {
                return yup.string().length(8).matches(/^[0-9]+$/, "Phone number must be a number.")
            } else {
                return yup.string().notRequired()
            }
        }),
        name: yup.string().required(),
        account_type: yup.number().min(0).max(2).nullable(true).default(1),
    }, [["phone_number", "phone_number"]])

    try {
        await schema.validate(req.body, { abortEarly: false })
        const { email, phone_number, name, account_type } = req.body
        const newUser = await User.create({
            email,
            phone_number,
            name,
            account_type,
            is_email_verified: true,
        })

        // Send email to user to set password
        const token = jwt.sign({ type: "reset", email }, process.env.APP_SECRET, { expiresIn: "15m" })
        const link = `${process.env.CLIENT_URL}/reset?token=${token}`
        const html = await ejs.renderFile("templates/setPassword.ejs", { user: newUser, url:link })
        await emailSender.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "EnviroGo - Set Password",
            html: html,
        })
        res.json(newUser)
    } catch (error) {
        // check if error is because of duplicate email
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ message: "Email already exists." })
            return
        }

        res.status(400).json({ message: error.message })
    }
})

router.put("/:id", validateAdmin, async (req, res) => {
    // Update user by id
    const schema = yup.object().shape({
        email: yup.string().email().optional(),
        phone_number: yup.string().when("phone_number", (phone_number) => {
            if (phone_number.length > 0) {
                return yup.string().length(8).matches(/^[0-9]+$/, "Phone number must be a number.")
            } else {
                return yup.string().notRequired()
            }
        }),
        name: yup.string().optional(),
        account_type: yup.number().min(0).max(2).nullable(true),
        profile_picture: yup.string().optional().nullable(true),
        profile_picture_type: yup.string().when("profile_picture_type", (profile_picture_type) => {
            if (profile_picture_type.length > 0) {
                return yup.string().oneOf(["local", "gravatar"], "Profile picture type must be either local or gravatar.")
            } else {
                return yup.string().notRequired()
            }
        }),
        cash: yup.number().min(0).nullable(true),
        points: yup.number().min(0).nullable(true),
        is_2fa_enabled: yup.boolean().nullable(true),
        is_active: yup.boolean().nullable(true),
    }, [["phone_number", "phone_number"], ["profile_picture_type", "profile_picture_type"]]).noUnknown(true)

    try {
        const body = await schema.validate(req.body, { abortEarly: false })
        const user = await User.findByPk(req.params.id)
        if (!user) {
            return res.status(404).json({message: "User not found"})
        }

        await user.update({
            ...body
        })

        res.json(user)
    } catch (error) {
        // check if error is because of duplicate email
        if (error instanceof Sequelize.UniqueConstraintError) {
            res.status(400).json({ message: "Email already exists." })
            return
        }

        res.status(400).json({ message: error.errors })
    }
})

module.exports = router