const express = require('express');
const router = express.Router();
const upload = require("../middlewares/multer");
const propertyImageController = require("../controllers/propertyImageController");

router.post("/upload", upload.single("image"), propertyImageController.uploadImage);
router.get("/property/:propertyId", propertyImageController.getAllForProperty);
router.delete("/:id", propertyImageController.delete);

module.exports = router;
