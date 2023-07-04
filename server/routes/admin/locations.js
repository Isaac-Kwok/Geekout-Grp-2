const express = require("express");
const yup = require("yup");
const { Location, Sequelize } = require("../../models");
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const ejs = require("ejs");
const { validateAdmin } = require("../../middleware/validateAdmin");
const { name } = require("ejs");

// create new location (staff)
router.post("/create", validateAdmin, async (req, res) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    notes: yup.string().max(1024),
    status: yup.bool().required(),
    premium: yup.number(),
    imageurl: yup.string().required(),
    arrivals: yup.number(),
    departures: yup.number(),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });
    let data = req.body;
    let result = await Location.create(data);
    res.json(result);
  } catch (error) {
    // check if name exists in database
    if (error instanceof Sequelize.UniqueConstraintError) {
      res.status(400).json({ message: "Location already exists." });
      return;
    }
  }
});

// Get all locations (For location list) (staff)
// Note: Add back validateAdmin. Removed for testing
router.get("/all", async (req, res) => {
  let list = await Location.findAll({
    order: [["createdAt", "DESC"]],
  });
  res.json(list);
});

// // Get all locations (Location list) (User)
// router.get("/", async (req, res) => {
//   let list = await Location.findAll({
//     order: [["createdAt", "DESC"]],
//     attributes: {
//       exclude: ["notes", "createdAt", "updatedAt"],
//     },
//   });
//   res.json(list);
// });

// Get specific location by ID (For edit location & view specific location) (Staff)
router.get("/:id", validateAdmin, async (req, res) => {
  // Get location by id
  const location = await Location.findByPk(req.params.id);
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }
  res.json(location);
});

// Edit location data (Staff)
router.put("/edit/:id", async (req, res) => {
  let id = req.params.id;
  let data = req.body;
  // Validate request body
  const schema = yup.object().shape({
    name: yup.string().required(),
    notes: yup.string().max(1024),
    status: yup.bool().required(),
    premium: yup.number(),
    imageurl: yup.string().required(),
    arrivals: yup.number(),
    departures: yup.number(),
  });
  try {
    await schema.validate(data, { abortEarly: false, strict: true });
  } catch (err) {
    console.error(err);
    res.status(400).json({ errors: err.errors });
    return;
  }
  data.name = data.name.trim();
  data.notes = data.notes.trim();
  let num = await Location.update(data, {
    where: { name: id },
  });
  if (num == 1) {
    res.json({
      message: `Location ${id} updated successfully.`,
    });
  } else {
    res.status(400).json({
      message: `Cannot update location named ${id}`,
    });
  }
});

router.delete("/delete/:id", async (req, res) => {
  let id = req.params.id;
  let num = await Location.destroy({
    where: { name: id },
  });
  if (num == 1) {
    res.json({
      message: "Location was deleted successfully.",
    });
  } else {
    res.status(400).json({
      message: `Cannot delete location with id ${id}.`,
    });
  }
});

// Delete all locations
router.delete("/deleteAll", async (req, res) => {
  try {
    await Location.destroy({
      where: {},
      truncate: true, // This option ensures that all records are deleted
    });
    res.json({
      message: "All locations were deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while deleting all locations.",
      error: error.message,
    });
  }
});

// // Get specific location by ID (For view specific location) (User)
// router.get("/:id", async (req, res) => {
//   // Get location by id
//   const location = await Location.findByPk(req.params.id);
//   if (!location) {
//     return res.status(404).json({ message: "Location not found" });
//   }
//   res.json(location);
// });

module.exports = router;
