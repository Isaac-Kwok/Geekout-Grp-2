const express = require("express")
const yup = require("yup")
const { User, Sequelize } = require("../models")
const router = express.Router()
const { validateToken } = require("../middleware/validateToken")
const { uploadProfilePicture } = require("../middleware/upload")
const path = require("path")

// Get the user based on the token
router.get("/",validateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {
                exclude: ["password"]
            }
        })
        res.json(user)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post("/upload", validateToken, async (req, res) => {
    // Upload profile picture
    const user = await User.findByPk(req.user.id)
    if (!user) {
        return res.status(404).json({message: "User not found"})
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
    }, [["phone_number", "phone_number"], ["profile_picture_type", "profile_picture_type"]]).noUnknown(true)

    try {
        const body = await schema.validate(req.body, { abortEarly: false })
        const user = await User.findByPk(req.user.id)
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