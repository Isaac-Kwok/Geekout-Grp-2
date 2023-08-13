// routes/rideRequests.js

const express = require("express");
const yup = require("yup");
const router = express.Router();
const { RideRequest, User, Route, RideRating } = require("../models");
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
    return res.json(result);
  } catch (error) {
    return res.status(400).json({ message: "Failed to create ride request." });
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
    return res.json(rideRequests);
  } catch (error) {
    return res.status(400).json({ message: "Failed to retrieve ride requests." });
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
      return res.status(400).json({ message: "Failed to retrieve ride request." });
    }
  }
);

// get specific routes
router.get("/routes/:rideId", validateToken, async (req, res) => {
  const { rideId } = req.params;
  try {
    // Find routes based on the provided rideId

    const routes = await Route.findAll();
    for (let index = 0; index < routes.length; index++) {
      let route = routes[index];
      if (route.rideIds.includes(rideId.toString())) {
        console.log("found route:", route);
        return res.status(200).json({ routes: routes });
      }
    }

    if (routes.length === 0) {
      return res
        .status(404)
        .json({ message: `No routes found for ride ID: ${rideId}.` });
    }

    // If routes are found, return them in the response
    // res.status(200).json({ routes: routes });
  } catch (error) {
    console.error(error);
    return res
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
    return res.json({
      message: `Ride request of ID: ${id} updated successfully.`,
      updatedRideRequest: rideRequest,
    });
  } catch (error) {
    return res.status(400).json({
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
    return res.json({ message: `Ride request of ID: ${id} deleted successfully.` });
  } catch (error) {
    return res.status(400).json({ message: "Failed to delete ride request." });
  }
});

// Special routes (Additional, for other functionalities)
// Get all ride requests created by all users (accessible to the driver)
router.get("/allrequests", async (req, res) => {
  try {
    const rideRequests = await RideRequest.findAll();
    return res.json(rideRequests);
  } catch (error) {
    return res.status(400).json({ message: "Failed to retrieve ride requests." });
  }
});

// Read all ratings
router.get("/allratings", validateToken, async (req, res) => {
  try {
    const ratings = await RideRating.findAll();
    console.log("Rating object from /viewall", ratings);
    return res.status(201).json(ratings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred." });
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
      req.app.io.to(`chat_${routeId}`).emit("riderAbort");
      return res.json({
        message: `Ride request of ID: ${requestId} updated successfully.`,
        updatedRideRequest: rideRequest,
      });
    } catch (error) {
      return res.status(400).json({
        message: `Failed to update ride request with ID: ${requestId}`,
        errors: error.errors,
      });
    }
  }
);

router.put("/minuscash/user/:userId", validateToken, async (req, res) => {
  let userId = req.params.userId;
  let routeId = req.params.routeId;
  let data = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res
        .status(404)
        .json({ message: `User of ID: ${userId} not found.` });
    }

    await user.update(data);
    res.json({
      message: `User of ID: ${userId} updated successfully.`,
      updatedUser: user,
    });
  } catch (error) {
    res.status(400).json({
      message: `Failed to update user with ID: ${userId}`,
      errors: error.errors,
    });
  }
});

// Update a ride request by ID (does not require token validation)
router.put("/updatestatus/:requestId", async (req, res) => {
  let id = req.params.requestId;
  let data = req.body;

  try {
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


module.exports = router;
