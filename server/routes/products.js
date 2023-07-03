const express = require("express")
const yup = require("yup")
const { Products, Sequelize } = require("../models")
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        const bicycles = await Bicycle.findAll();
        res.json(bicycles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router
