// routes/rideRequests.js

const express = require("express");
const yup = require("yup");
const router = express.Router();
const { RideRequest, User, Route } = require("../models");
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
    dateTime: yup.date().required(),
    pickUp: yup.string().required(),
    destination: yup.string().required(),
    numberOfPassengers: yup.number().required(),
    // date: yup.date().required(),
    // time: yup.string().required(),
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

// get specific ride request
router.get(
  "/myrequests/:userId/specific/:requestId",
  validateToken,
  async (req, res) => {
    const { userId, requestId } = req.params;
    try {
      // Check if the user exists in the User database
      const user = await User.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: `User of user ID: ${userId} does not exist.` });
      }

      // If the user exists, retrieve their ride request with the specific requestId
      const rideRequest = await RideRequest.findByPk(requestId);
      if (!rideRequest) {
        return res.status(404).json({
          message: `Ride request with ID: ${requestId} does not exist.`,
        });
      }

      res.json(rideRequest);
    } catch (error) {
      res.status(400).json({ message: "Failed to retrieve ride request." });
    }
  }
);

// get specific routes
router.get("/routes/:rideId", validateToken, async (req, res) => {
  const { rideId } = req.params;
  try {
    // Find routes based on the provided rideId
    const routes = await Route.findAll({ where: { rideIds: rideId } });

    if (routes.length === 0) {
      return res
        .status(404)
        .json({ message: `No routes found for ride ID: ${rideId}.` });
    }

    // If routes are found, return them in the response
    res.status(200).json({ routes: routes });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching routes." });
  }
});

// Update a ride request by ID (does not require token validation)
router.put("/update/:requestId", async (req, res) => {
  let id = req.params.requestId;
  let data = req.body;
  // Validate request body
  const schema = yup.object().shape({
    // userId: yup.number().required(),
    // name: yup.string().required(),
    dateTime: yup.date().required(),
    pickUp: yup.string().required(),
    destination: yup.string().required(),
    numberOfPassengers: yup.number().required(),
    // date: yup.date().required(),
    // time: yup.string().required(),
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

router.put(
  "/abortrequest/requestId/:requestId/routeId/:routeId",
  async (req, res) => {
    let requestId = req.params.requestId;
    let routeId = req.params.routeId;
    let data = req.body;
    data.status = "Pending";

    try {
      const rideRequest = await RideRequest.findByPk(requestId);

      if (!rideRequest) {
        return res
          .status(404)
          .json({ message: `Ride request of ID: ${requestId} not found.` });
      }

      await rideRequest.update(data);
      res.json({
        message: `Ride request of ID: ${requestId} updated successfully.`,
        updatedRideRequest: rideRequest,
      });
      req.app.io.to(`chat_${routeId}`).emit("riderAbort");
    } catch (error) {
      res.status(400).json({
        message: `Failed to update ride request with ID: ${requestId}`,
        errors: error.errors,
      });
    }
  }
);

module.exports = router;
