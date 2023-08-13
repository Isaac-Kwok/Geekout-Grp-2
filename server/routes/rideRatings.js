const express = require("express");
const yup = require("yup");
const router = express.Router();
const { RideRating, RideRequest, User } = require("../models");
const { validateToken } = require("../middleware/validateToken");

// create new rating
// router.post("/create", validateToken, async (req, res) => {
//   const schema = yup.object().shape({
//     requestId: yup.number().required(),
//     rating: yup.number().required(),
//     comment: yup.string().max(1024),
//     dateTime: yup.date().required(),
//   });

//   try {
//     await schema.validate(req.body, { abortEarly: false });
//     let data = req.body;
//     let result = await RideRating.create(data);
//     res.json(result);
//   } catch (error) {
//     // check if name exists in database
//     if (error instanceof Sequelize.UniqueConstraintError) {
//       res.status(400).json({ message: "Rating has been made previously." });
//       return;
//     }
//   }
// });
router.post("/create", validateToken, async (req, res) => {
  let data = req.body;
  data.userId = req.user.id;
  data.dateTime = new Date();

  const schema = yup.object().shape({
    rating: yup.number().required(),
    comment: yup.string().max(1024),
  });

  try {
    const validData = await schema.validate(req.body, { abortEarly: false });

    // Check if the associated RideRequest exists
    const rideRequest = await RideRequest.findByPk(validData.requestId);
    if (!rideRequest) {
      return res.status(404).json({ message: "RideRequest not found." });
    }

    const result = await RideRating.create(validData);
    res.status(201).json(result);
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed.", errors: error.errors });
    }
    // Handle other errors
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

// Read a specific rating by ID
router.get("/:id", async (req, res) => {
  const ratingId = req.params.id;

  try {
    const rating = await RideRating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found." });
    }
    res.json(rating);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

// Read all ratings
router.get('/allratings', validateToken, async (req, res) => {
  try {
    const ratings = await RideRating.findAll();
    console.log("Rating object from /viewall", ratings);
    res.status(201).json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred.' });
  }
});


// Update a rating
router.put("/:id", validateToken, async (req, res) => {
  const ratingId = req.params.id;

  const schema = yup.object().shape({
    rating: yup.number(),
    comment: yup.string().max(1024),
    dateTime: yup.date(),
  });

  try {
    const validData = await schema.validate(req.body, { abortEarly: false });

    const rating = await RideRating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found." });
    }

    await rating.update(validData);
    res.json(rating);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed.", errors: error.errors });
    }
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

// Delete a rating
router.delete("/:id", validateToken, async (req, res) => {
  const ratingId = req.params.id;

  try {
    const rating = await RideRating.findByPk(ratingId);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found." });
    }

    await rating.destroy();
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred." });
  }
});

module.exports = router;
