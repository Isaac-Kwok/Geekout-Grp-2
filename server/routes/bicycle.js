const express = require("express")
const yup = require("yup")
const { Bicycle, Sequelize } = require("../models")
const router = express.Router()

const bicycleSchema = yup.object().shape({
    bicycle_lat: yup
        .number()
        .min(-90)
        .max(90)
        .required(),
    bicycle_lng: yup
        .number()
        .min(-180)
        .max(180)
        .required(),
    disabled: yup.boolean(),
    reports: yup.number().integer().min(0),
    passkey: yup.string().nullable(),
    registered: yup.boolean(),
    unlocked: yup.boolean(),
    unlockedAt: yup.date()
});

// Create a new bicycle
router.post('/', async (req, res) => {
    try {
        // Validate the request body against the schema
        const validatedData = await bicycleSchema.validate(req.body);

        // Create a new Bicycle object using the validated data
        const bicycle = await Bicycle.create(validatedData);

        res.status(200).json(bicycle);
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors
            res.status(400).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
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

        // Validate the request body against the schema
        const validatedData = await bicycleSchema.validate(req.body);

        await bicycle.update(validatedData);

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

// DELETE /bicycle route
router.delete('/', async (req, res) => {
    try {
        // Delete all bicycles from the database
        await Bicycle.destroy({
            where: {},
            truncate: true
        });

        res.sendStatus(204); // Successful deletion, send 204 No Content response
    } catch (error) {
        console.error('Error deleting bicycles:', error);
        res.sendStatus(500); // Internal Server Error
    }
});

module.exports = router
