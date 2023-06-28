const express = require("express")
const yup = require("yup")
const { Bicycle, Sequelize } = require("../models")
const router = express.Router()

// Create a new bicycle
router.post('/', async (req, res) => {
    try {
        const { bicycle_lat, bicycle_lng, disabled, reports, passkey, registered } = req.body;

        const bicycle = await Bicycle.create({
            bicycle_lat: 1.3800,
            bicycle_lng: 103.8489,
            disabled: true,
            reports: 0,
            passkey: null,
            registered: false
        });

        res.status(201).json(bicycle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get all bicycles
router.get('/', async (req, res) => {
    try {
        const bicycles = await Bicycle.findAll();
        res.json(bicycles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a specific bicycle by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bicycle = await Bicycle.findByPk(id);
        if (!bicycle) {
            return res.status(404).json({ message: 'Bicycle not found' });
        }
        res.json(bicycle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a bicycle
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { bicycle_lat, bicycle_lng, disabled, reports, passkey, registered } = req.body;

        const bicycle = await Bicycle.findByPk(id);
        if (!bicycle) {
            return res.status(404).json({ message: 'Bicycle not found' });
        }

        await bicycle.update({
            bicycle_lat: 10,
            bicycle_lng: 10,
            disabled: true,
            reports: 0,
            passkey: null,
            registered: false
        });

        res.json(bicycle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a bicycle
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bicycle = await Bicycle.findByPk(id);
        if (!bicycle) {
            return res.status(404).json({ message: 'Bicycle not found' });
        }
        await bicycle.destroy();
        res.json({ message: 'Bicycle deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router
