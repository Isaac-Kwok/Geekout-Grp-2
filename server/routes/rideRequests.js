// routes/rideRequests.js

const express = require("express");
const yup = require("yup");
const router = express.Router();
const { RideRequest } = require("../models");

router.post("/create", async (req, res) => {
  let data = req.body;
  const schema = yup.object().shape({
    email: yup.string().required(),
    date: yup.date().required(),
    time: yup.string().required(),
    startLocation: yup.string().required(),
    destination: yup.string().required(),
    numberOfPassengers: yup.number().required(),
  });
  try {
    await schema.validate(req.body, { abortEarly: false });
    let result = await RideRequest.create(data);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: "Failed to create ride request." });
  }
});

router.get("/myrequests", async (req, res) => {
  const { email } = req.query;
  try {
    const rideRequests = await RideRequest.findAll({ where: { email } });
    res.json(rideRequests);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve ride requests." });
  }
});

// Update a ride request by ID
router.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  // Validate request body
  const schema = yup.object().shape({
    email: yup.string().email().required(),
    date: yup.date().required(),
    time: yup.string().required(),
    startLocation: yup.string().required(),
    destination: yup.string().required(),
    numberOfPassengers: yup.number().required(),
  });

  try {
    await schema.validate(data, { abortEarly: false });
    const rideRequest = await RideRequest.findByPk(id);
    console.log("ID:", id);
    console.log("Data:", data);
    console.log("Ride Request:", rideRequest);

    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found." });
    }

    await rideRequest.update(data);
    res.json({
      message: `Ride request of ID: ${id} updated successfully.`,
      updatedRideRequest: rideRequest,
    });
  } catch (error) {
    res.status(400).json({
      message: `Failed to update ride requeset with ID: ${id}`,
      errors: error.errors,
    });
  }
});

// Delete a ride request by ID
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const rideRequest = await RideRequest.findByPk(id);

    if (!rideRequest) {
      return res.status(404).json({ message: "Ride request not found." });
    }

    await rideRequest.destroy();
    res.json({ message: "Ride request deleted successfully." });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete ride request." });
  }
});

module.exports = router;
