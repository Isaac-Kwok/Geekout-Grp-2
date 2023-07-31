// routes/rideRequests.js

const express = require("express");
const yup = require("yup");
const router = express.Router();
const { RideRequest, User } = require("../models");
const { validateToken } = require("../middleware/validateToken");

// create new ride request
router.post("/create", validateToken, async (req, res) => {
  let data = req.body;

  // userId and name is filled in based on requesting the payload
  // response given by validateToken
  data.userId = req.user.id;
  data.name = req.user.name;

  const schema = yup.object().shape({
    // userId: yup.number().required(),
    // name: yup.string().required(),
    date: yup.date().required(),
    time: yup.string().required(),
    pickUp: yup.string().required(),
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

// get all ride requests created by a specific customer (rider) based on the customer's ID
router.get("/myrequests/:userId", validateToken, async (req, res) => {
  const { userId } = req.params;
  try {
    // Check if the user exists in the User database
    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `User of user ID: ${userId} does not exist.` });
    }

    // If the user exists, retrieve their ride requests
    const rideRequests = await RideRequest.findAll({ where: { userId } });
    res.json(rideRequests);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve ride requests." });
  }
});

// Update a ride request by ID (does not require token validation)
router.put("/update/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  // Validate request body
  const schema = yup.object().shape({
    // userId: yup.number().required(),
    // name: yup.string().required(),
    date: yup.date().required(),
    time: yup.string().required(),
    pickUp: yup.string().required(),
    destination: yup.string().required(),
    numberOfPassengers: yup.number().required(),
  });

  try {
    await schema.validate(data, { abortEarly: false });
    const rideRequest = await RideRequest.findByPk(id);

    if (!rideRequest) {
      return res
        .status(404)
        .json({ message: `Ride request of ID: ${id} not found.` });
    }

    await rideRequest.update(data);
    res.json({
      message: `Ride request of ID: ${id} updated successfully.`,
      updatedRideRequest: rideRequest,
    });
  } catch (error) {
    res.status(400).json({
      message: `Failed to update ride request with ID: ${id}`,
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
      return res
        .status(404)
        .json({ message: `Ride request of ID: ${id} not found.` });
    }

    await rideRequest.destroy();
    res.json({ message: `Ride request of ID: ${id} deleted successfully.` });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete ride request." });
  }
});

// Special routes (Additional, for other functionalities)
// Get all ride requests created by all users (accessible to the driver)
router.get("/allrequests", async (req, res) => {
  try {
    const rideRequests = await RideRequest.findAll();
    res.json(rideRequests);
  } catch (error) {
    res.status(400).json({ message: "Failed to retrieve ride requests." });
  }
});

module.exports = router;
