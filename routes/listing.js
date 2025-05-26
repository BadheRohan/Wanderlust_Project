const express = require("express");
const router = express.Router();
const wrapAsync = require("../Utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const { index, renderNewForm, showListings, createListing, editListing, updateListing, destroyListing } = require("../controllers/listings.js");
const multer = require("multer");
const { storage, cloudinary } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    wrapAsync(createListing)
  );

// New route
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(showListings) // Show Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    wrapAsync(updateListing)
  ) // Update route
  .delete(isLoggedIn, isOwner, destroyListing); // Delete route

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, editListing);

module.exports = router;
