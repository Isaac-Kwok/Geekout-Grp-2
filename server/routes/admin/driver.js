const express = require("express")
const yup = require("yup")
const { User, DriverApplication, Sequelize } = require("../../models")
const router = express.Router()
const { validateAdmin } = require("../../middleware/validateAdmin")
const path = require('path')
const ejs = require("ejs")
const { emailSender } = require("../../middleware/emailSender")
require('dotenv').config();
var MarkdownIt = require('markdown-it');


// Route to update driver Applicaiton using 'PUT'
router.put("/edit/:id", async (req, res) => {
    let id = req.params.id;
    let application = await DriverApplication.findByPk(id);
    if (!application) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object().shape({
        email: yup.string().trim().min(3).max(100).required(),
        subject: yup.string().trim(),
        body: yup.string().trim().min(3).max(500).required()
    });
    try {
        await validationSchema.validate(data,
            { abortEarly: false, strict: true });
    }
    catch (err) {
        console.error(err);
        res.status(400).json({ errors: err.errors });
        return;
    }
    data.email = data.email.trim();
    data.subject = data.subject.trim();
    let md = new MarkdownIt();
    data.body = md.render(data.body.trim());
    console.log("status", data.status)
    const link = process.env.CLIENT_URL
    let newDriverApplication = {};
    let newUser = {};
    if (data.status == "Approved") {
        console.log("reached")
        newDriverApplication = {
            driver_status: data.status
        };
        newUser = {
            account_type: 2,
            driver_application_sent: true
        };
    }
    else if (data.status == "Rejected") {
        newDriverApplication = {
            driver_status: data.status
        };
        newUser = {
            account_type: 1,
            driver_application_sent: false
        };
    }

    console.log("Driver appplication", newDriverApplication)
    let num = await DriverApplication.update(newDriverApplication, {
        where: { id: id }
    })
    let num2 = await User.update(newUser, {
        where: { id: application.user_id }
    })
    if (num == 1 && num2 == 1) {
        // Send email
        const html = await ejs.renderFile("templates/driverApplicationReply.ejs", { body: data.body, url: link })
        await emailSender.sendMail({
            from: process.env.EMAIL_USER,
            to: data.email,
            subject: data.subject,
            html: html,
        })

        res.json({
            message: "Driver Application and User was updated successfully."
        });
    }
    else {
        console.log(num + " " + num2)
        res.status(400).json({
            message: `Cannot update Driver application with id ${id}.`
        });
    }

});

// Get driver images by name
router.get("/driverImage/:filename", (req, res) => {
    const fileName = req.params.filename;
    const directoryPath = path.join(__dirname, "../../public/uploads/driver/");

    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file. " + err,
            });

        }
    });
})

router.get("/GetAllDriverApplications", async (req, res) => {
    let list = await DriverApplication.findAll({
        order: [['createdAt', 'DESC']],
        include: { model: User, as: "User", attributes: ['name', "email", "profile_picture", "profile_picture_type"] }
    });
    res.json(list);
})
router.get('/SearchDriverApplication', async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Sequelize.Op.or] = [
            { user_id: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_nric_name: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_nric_number: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_age: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_car_model: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_car_license_plate: { [Sequelize.Op.like]: `%${search}%` } },
            { driver_status: { [Sequelize.Op.like]: `%${search}%` } }
        ]
    }

    let list = await DriverApplication.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list)
});

// route to get Driver Application data by ID
router.get('/GetdriverApplicationbyId/:id', async (req, res) => {
    let id = req.params.id;
    let driver = await DriverApplication.findByPk(id, {
        include: { model: User, as: "User", attributes: ["email", "phone_number"] }
    });
    // Check if ID is not found
    if (!driver) {
        res.send("ID: " + id + " is not found")
        // res.sendStatus(404);
        return
    }
    res.json(driver);
})
router.delete("/deleteDriverApplicationById/:id", async (req, res) => {
    let id = req.params.id;
    let num = await DriverApplication.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Driver application was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Driver Application with id ${id}.`
        });
    }
});


module.exports = router;