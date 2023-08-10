const express = require("express")
const yup = require("yup")
const { Secret, User, Sequelize } = require("../models")
const router = express.Router()
const { validateToken } = require("../middleware/validateToken")
const { uploadProfilePicture } = require("../middleware/upload")
const path = require("path")
const { authenticator } = require("otplib")
const { OAuth2Client } = require('google-auth-library');
const axios = require("axios")
const client = new OAuth2Client();

// Get the user based on the token
router.get("/", validateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ["password"]
            }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post("/upload", validateToken, async (req, res) => {
    // Upload profile picture
    const user = await User.findByPk(req.user.id)
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    } else {
        await uploadProfilePicture(req, res)
    }
    user.profile_picture = "//" + req.headers.host + `/uploads/profile/${user.id + path.extname(req.file.originalname)}`
    user.profile_picture_type = "local"
    await user.save()
    res.json(user)
})

router.put("/", validateToken, async (req, res) => {
    // Update user by id
    const schema = yup.object().shape({
        phone_number: yup.string().when("phone_number", (phone_number) => {
            if (phone_number.length > 0) {
                return yup.string().length(8).matches(/^[0-9]+$/, "Phone number must be a number.")
            } else {
                return yup.string().notRequired()
            }
        }),
        name: yup.string().optional(),
        profile_picture_type: yup.string().when("profile_picture_type", (profile_picture_type) => {
            if (profile_picture_type.length > 0) {
                return yup.string().oneOf(["local", "gravatar"], "Profile picture type must be either local or gravatar.")
            } else {
                return yup.string().notRequired()
            }
        }),
        email: yup.string().email().optional(),
        password: yup.string().min(12).max(64).optional(),
        profile_picture_type: yup.string().oneOf(["local", "gravatar"]).optional(),
        delivery_address: yup.string().optional(),
    }, [["phone_number", "phone_number"], ["profile_picture_type", "profile_picture_type"]]).noUnknown(true)

    try {
        const body = await schema.validate(req.body, { abortEarly: false })
        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
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

router.get("/2fa/backup", validateToken, async (req, res) => {
    const secret = await Secret.findOne({
        where: {
            user_id: req.user.id
        }
    })
    if (!secret) {
        return res.status(404).json({ message: "2FA not enabled" })
    }

    res.json({
        backup: secret.backup
    })
})

router.get("/2fa/enable", validateToken, async (req, res) => {
    const user = await User.findByPk(req.user.id)
    const secret = await Secret.findOne({
        where: {
            user_id: req.user.id
        }
    })
    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    if (secret) {
        return res.status(400).json({ message: "2FA already enabled" })
    }

    const otpSecret = authenticator.generateSecret()
    const otpAuthUrl = authenticator.keyuri(user.email, "EnviroGo", otpSecret)
    const backup = Array.from(Array(12), () => Math.floor(Math.random() * 36).toString(36)).join('');

    await Secret.create({
        user_id: req.user.id,
        secret: otpSecret,
        backup: backup
    })

    res.json({
        otpAuthUrl,
        backup
    })
})

router.get("/2fa/disable", validateToken, async (req, res) => {
    const secret = await Secret.findOne({
        where: {
            user_id: req.user.id
        }
    })

    if (!secret) {
        return res.status(404).json({ message: "2FA not enabled" })
    }

    await secret.destroy()

    res.json({ message: "2FA disabled" })
})

router.post("/social/google", validateToken, async (req, res) => {
    const schema = yup.object().shape({
        token: yup.string().required(),
    })
    try {
        await schema.validate(req.body, { abortEarly: false })
        const accessToken = req.body.token
        const ticket = await client.getTokenInfo(accessToken)

        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.is_google_auth_enabled) {
            if (user.is_google_auth_enabled !== ticket.email) {
                return res.status(400).json({ message: "Can only un-link with the same Google account used to link" })
            }
            user.is_google_auth_enabled = null
            user.save()
            res.json({ message: "Google account un-linked" })
        } else {
            user.is_google_auth_enabled = ticket.email
            user.save()
            res.json({ message: "Google account linked" })
        }
    } catch (error) {
        res.status(400).json({ message: error.errors })
    }
    
})

// TODO: Need to catch axios error
router.post("/social/facebook", validateToken, async (req, res) => {
    const schema = yup.object().shape({
        token: yup.string().required(),
    })
    try {
        await schema.validate(req.body, { abortEarly: false })
        const accessToken = req.body.token
        const ticket = await axios.get(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`)

        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        if (user.is_fb_auth_enabled) {
            if (user.is_fb_auth_enabled !== ticket.data.id) {
                return res.status(400).json({ message: "Can only un-link with the same Facebook account used to link" })
            }
            user.is_fb_auth_enabled = null
            user.save()
            res.json({ message: "Facebook account un-linked" })
        } else {
            user.is_fb_auth_enabled = ticket.data.id
            user.save()
            res.json({ message: "Facebook account linked" })
        }
    } catch (error) {
        res.status(400).json({ message: error.errors })
        console.log(error)
    }
    
})

module.exports = router