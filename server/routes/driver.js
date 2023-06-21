const express = require("express")
const yup = require("yup")
const { User, Driver, Sequelize } = require("../models")
const router = express.Router()
require('dotenv').config();

const { upload } = require('../middleware/upload');

const { validateToken } = require("../middleware/validateToken")

router.post('/uploadDriverFaceImage', validateToken, upload, (req, res) => {
    res.json({ driver_face_image : req.file.filename });
    });

router.post("/DriverRegister", validateToken, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object().shape({
        driver_nric_name: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        driver_nric_number: yup.string().trim()
            .min(9).max(9).required(),
        driver_postalcode: yup.number()
            .length(6, "Postal code needs to be 6 digits long").required(),
        driver_age: yup.number().required(),
        driver_question: yup.string().trim().min(10).max(300).required()
    })
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
    // Trim string values
    data.user_id = req.user.id;
    data.driver_nric_name = data.driver_nric_name.trim();
    data.driver_nric_number = data.driver_nric_number.trim();
    data.driver_postalcode = data.driver_postalcode.trim();
    data.driver_age = data.driver_age.trim();
    data.driver_question = data.driver_question.trim();

    // Create user
    let result = await Driver.create(data);
    res.json(result);
});

module.exports = router;