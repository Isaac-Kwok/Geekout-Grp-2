const express = require("express")
const yup = require("yup")
const { Bicycle, BicycleReports, BicycleUsages, Sequelize } = require("../models")
const router = express.Router()
const { Op } = require('sequelize');

const bicycleSchema = yup.object().shape({
    bicycle_lat: yup
        .number()
        .min(-90)
        .max(90),
    bicycle_lng: yup
        .number()
        .min(-180)
        .max(180),
    disabled: yup.boolean(),
    reports: yup.number().integer().min(0),
    passkey: yup.string().nullable(),
    registered: yup.boolean(),
    unlocked: yup.boolean(),
    unlockedAt: yup.date().optional().nullable()
});

const BicycleReportsSchema = yup.object().shape({
    bike_id: yup
        .number(),
    reportedAt: yup
        .date(),
    reportType: yup 
        .string(),
    report: yup
        .string()
});

const BicycleUsagesSchema = yup.object().shape({
    bike_id: yup
        .number(),
    unlockedAt: yup
        .date(),
    startPosition: yup 
        .string(),
    endPostion: yup
        .string(),
    transaction: yup
        .number()
});

// Get a specific bicycle usage by USER ID
router.get('/usages/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usage = await BicycleUsages.findAll({
            where: {
                user_id: id
            }
        });
        if (!usage) {
            return res.status(404).json({ message: 'Bicycle usage not found' });
        }
        res.json(usage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a specific bicycle usage by USAGE ID
router.get('/usages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usage = await BicycleUsages.findAll({
            where: {
                bike_id: id
            }
        });
        if (!usage) {
            return res.status(404).json({ message: 'Bicycle usage not found' });
        }
        res.json(usage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to update bicycle usage by bike ID and latest unlocked date
router.put('/usages', async (req, res) => {
    const { endPosition, transaction } = req.body;
    
    try {
        // Get the usage record with the latest unlockedAt timestamp
        const latestUnlockedRecord = await BicycleUsages.findOne({
            order: [['unlockedAt', 'DESC']], // Get the record with the latest unlockedAt timestamp
        });

        if (!latestUnlockedRecord) {
            return res.status(404).json({ message: 'No unlocked usage record found' });
        }

        // Update the usage record
        const updatedUsage = await BicycleUsages.update(
            {
                endPosition: endPosition, // Update end position as needed
                transction: transaction,
                updatedAt: new Date(), // Update the updatedAt timestamp
            },
            {
                where: {
                    id: latestUnlockedRecord.id,
                },
            }
        );

        if (updatedUsage) {
            return res.status(200).json({ message: 'Bicycle usage updated successfully' });
        } else {
            return res.status(500).json({ message: 'Failed to update bicycle usage' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new bicycle usage
router.post('/usages', async (req, res) => {
    try {
        const validatedData = await BicycleUsagesSchema.validate(req.body);
        const usage = await BicycleUsages.create(validatedData);
        res.status(200).json(usage);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// Get all bicycle usages
router.get('/usages', async (req, res) => {
    try {
        const usages = await BicycleUsages.findAll();
        res.json(usages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a specific bicycle report by ID
router.get('/reports/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const report = await BicycleReports.findAll({
            where: {
                bike_id: id
            }
        });
        if (!report) {
            return res.status(404).json({ message: 'Bicycle report not found' });
        }
        res.json(report);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a new bicycle report
router.post('/reports', async (req, res) => {
    try {
        const validatedData = await BicycleReportsSchema.validate(req.body);
        const report = await BicycleReports.create(validatedData);
        res.status(200).json(report);
    } catch (error) {
        if (error.name === 'ValidationError') {
            res.status(400).json({ message: error.message });
        } else {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

// Get all bicycle reports
router.get('/reports', async (req, res) => {
    try {
        const reports = await BicycleReports.findAll();
        res.json(reports);
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
        const { bicycle_lat, bicycle_lng, disabled, reports, passkey, registered, unlocked, unlockedAt } = req.body;

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
