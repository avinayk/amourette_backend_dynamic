const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multerConfig"); // Adjust the path as needed

const registerController = require("../controllers/registerController");

// Define the POST /register route
router.post(
  "/register",
  upload.single("profile_image"),
  registerController.register
);
router.post(
  "/updateProfile",
  upload.single("profile_image"),
  registerController.updateProfile
);

router.post(
  "/getProfile",
  upload.single("profile_image"),
  registerController.getProfile
);

module.exports = router;
