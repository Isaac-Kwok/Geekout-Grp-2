const express = require("express")
const yup = require("yup")
const { DriverApplication, Sequelize, User, Route } = require("../models")
const router = express.Router()
require('dotenv').config();

const { upload } = require('../middleware/upload');

const { validateToken } = require("../middleware/validateToken");

// Get the Application based on the token
router.get("/getDriverApplication", validateToken, async (req, res) => {
    try {
        const application = await DriverApplication.findAll({ where: { user_id: req.user.id }, order: [['updatedAt']] })
        console.log('application:', application)
        res.json(application[application.length - 1])
    } catch (error) {
        res.status(500).json({ message: error.message })
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
        driver_application_sent: true
    }
    // Update User to make driver application sent
    let num2 = await User.update(newUser, {
        where: { id: req.user.id }
    })

    // Create Driver
    let result = await DriverApplication.create(data);
    res.json(result);
});

router.post("/createRoute", validateToken, async (req, res) => {
    let data = req.body;
    console.log('route dat:', data)
    // Validate request body
    let validationSchema = yup.object().shape({
        names: yup.string().trim().matches(/^[a-z ,.'-]+$/i)
            .min(3).max(50).required(),
        pickUp: yup.string().trim().required(),
        destination: yup.string().trim().required(),
        wayPoints: yup.string().trim(),

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
    data.names = data.names.trim();
    data.pickUp = data.pickUp.trim();
    data.destination = data.destination.trim();
    data.wayPoints = data.wayPoints.trim();
    data.driver_pofit = data.driver_profit;
    data.rideDirections = data.rideDirections;
    const jsonString = JSON.stringify(data.rideDirections);

    // Create Route
    let result = await Route.create(data);
    // Update User to increment accepted routes field by 1
    await User.update(
        {
            on_duty: true,
            current_route: result,
            rideDirections: jsonString,
            accepted_routes: Sequelize.literal('accepted_routes + 1'),
        },
        {
            where: { id: req.user.id },
        }
    );

    res.json(result);
});

// Get the routes based on the token
router.get("/getRoutes", validateToken, async (req, res) => {
    try {
        const routes = await Route.findAll({ where: { user_id: req.user.id } })
        console.log('routes:', routes)
        res.json(routes)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})
router.put("/abort", validateToken, async (req, res) => {
    // Update user by id
    try {
        const user = await User.findByPk(req.user.id)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await user.update({
            on_duty: false,
            aborted_routes: Sequelize.literal('aborted_routes + 1'),
            rideDirections: null,
            current_route: {}
        })

        res.json(user)
    } catch (error) {

        res.status(400).json({ message: error.errors })
    }
})
// Delete route
router.delete("/route/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      const route = await Route.findByPk(id);
      if (!route) {
        return res.status(404).json({ message: "route not found" });
      }
  
      await route.destroy();
      res.json({ message: "route deleted successfully" });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ message: "Error deleting route" });
    }
  });

module.exports = router;