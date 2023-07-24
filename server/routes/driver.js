const express = require("express")
const yup = require("yup")
const { DriverApplication, Sequelize, User } = require("../models")
const router = express.Router()
require('dotenv').config();

const { upload } = require('../middleware/upload');

const { validateToken } = require("../middleware/validateToken");

// Get the Application based on the token
router.get("/getDriverApplication", validateToken, async (req, res) => {
    try {
        const application = await DriverApplication.findAll({ where: { user_id: req.user.id }, order: [ [ 'updatedAt' ]] })
        console.log('application:', application)
        res.json(application[application.length - 1])
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

router.post('/upload', validateToken, upload, (req, res) => {
    res.json({ filename: req.file.filename });
});


router.post("/register", validateToken, upload, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        driver_nric_name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        driver_nric_number: yup.string().trim()
            .min(9).max(9).required(),
        driver_postalcode: yup.number().required(),
        driver_age: yup.number().required(),
        driver_question: yup.string().trim().min(10).max(300).required(),
        driver_nationality: yup.string().trim().required(),
        driver_sex: yup.string().trim().required(),
        driver_car_model: yup.string().trim().required(),
        driver_car_license_plate: yup.string().trim().required(),
        driver_face_image: yup.string().trim().required(),
        driver_car_image: yup.string().trim().required(),
        driver_license: yup.string().trim().required(),
        driver_ic: yup.string().trim().required()
    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
    console.log('req.user:', req.user)
    // Trim string values
    data.user_id = req.user.id;
    data.driver_phone_number = req.user.phone_number;
    data.driver_email = req.user.email;
    data.driver_nric_name = data.driver_nric_name.trim();
    data.driver_nric_number = data.driver_nric_number.trim();
    data.driver_postalcode = data.driver_postalcode;
    data.driver_age = data.driver_age;
    data.driver_question = data.driver_question.trim();
    data.driver_car_model = data.driver_car_model.trim();
    data.driver_car_license_plate = data.driver_car_license_plate.trim();
    
    data.driver_face_image = data.driver_face_image
    data.driver_car_image = data.driver_car_image;
    data.driver_license = data.driver_license;
    data.driver_ic = data.driver_ic

    const newUser = {
        driver_application_sent : true
    }
    // Update User to make driver application sent
    let num2 = await User.update(newUser, {
        where: { id: req.user.id }
    })

    // Create Driver
    let result = await DriverApplication.create(data);
    res.json(result);
});

module.exports = router;