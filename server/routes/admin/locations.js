const express = require("express");
const yup = require("yup");
const { Location, RideRequest, Sequelize } = require("../../models");
const router = express.Router();
// const jwt = require("jsonwebtoken");
// const ejs = require("ejs");
const { validateAdmin } = require("../../middleware/validateAdmin");
const { name } = require("ejs");
const path = require("path");
const fs = require("fs");

// create new location (staff)
router.post("/create", validateAdmin, async (req, res) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    notes: yup.string().max(1024),
    status: yup.string().required(),
    premium: yup.number(),
    imageFile: yup.string().required(),
    // arrivals: yup.number(),
    // departures: yup.number(),
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

// create new location (staff)
router.post("/create/riderside", async (req, res) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    notes: yup.string().max(1024),
    status: yup.string().required(),
    premium: yup.number(),
    imageFile: yup.string().required(),
    // arrivals: yup.number(),
    // departures: yup.number(),
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
router.get("/:id", async (req, res) => {
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
  const locationId = req.params.id;
  let data = req.body;
  // Validate request body
  const schema = yup.object().shape({
    name: yup.string().required(),
    notes: yup.string().max(1024),
    status: yup.string().required(),
    premium: yup.number(),
    imageFile: yup.string().required(),
    // arrivals: yup.number(),
    // departures: yup.number(),
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

  // image deletion code
  // Fetch the location details
  const location = await Location.findByPk(locationId);
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

  // If a new imageFile is provided in the request, delete the old image
  if (data.imageFile && data.imageFile !== location.imageFile) {
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "location_pictures",
      location.imageFile
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });
  }
  // end of image deletion code

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

// Edit location data (Staff)
router.put("/editdeparture/:id", async (req, res) => {
  let id = req.params.id;
  const locationId = req.params.id;
  let data = req.body;

  // image deletion code
  // Fetch the location details
  const location = await Location.findByPk(locationId);
  if (!location) {
    return res.status(404).json({ message: "Location not found" });
  }

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

// router.delete("/delete/:id", async (req, res) => {
//   let id = req.params.id;
//   let num = await Location.destroy({
//     where: { name: id },
//     cascade: true,
//   });
//   if (num == 1) {
//     res.json({
//       message: "Location was deleted successfully.",
//     });
//   } else {
//     res.status(400).json({
//       message: `Cannot delete location with id ${id}.`,
//     });
//   }
// });

router.delete("/delete/:id", async (req, res) => {
  const locationId = req.params.id;

  // dependency checking code
  // Check if there are any associated ride requests
  const associatedRideRequests = await RideRequest.findAll({
    where: { pickUp: locationId },
  });
  // console.log(associatedRideRequests);
  // console.log(associatedRideRequests.length);

  if (associatedRideRequests.length > 0) {
    // console.log("Unable to delete location as it is a dependency");
    return res.status(400).json({
      message: "Cannot delete location. Associated ride requests exist.",
    });
  }
  // end of dependency checking code

  try {
    // Fetch the location details
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    // Delete the image file
    const imagePath = path.join(
      __dirname,
      "..",
      "..",
      "public",
      "uploads",
      "location_pictures",
      location.imageFile
    );
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error("Error deleting image:", err);
      } else {
        console.log("Image deleted successfully");
      }
    });

    // Delete the location
    await location.destroy();

    res
      .status(200)
      .json({ message: "Location and image deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting location" });
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

// Get driver images by name
router.get("/images/:filename", (req, res) => {
  const fileName = req.params.filename;
  const directoryPath = path.join(
    __dirname,
    "../../public/uploads/location_pictures/"
  );

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
});

module.exports = router;
