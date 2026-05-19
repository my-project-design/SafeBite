const express = require("express");
const router = express.Router();
const prcontrollers = require("../controllers/productrating.controllers");

router.get("/", prcontrollers.getAllRatings);      // GET ALL
router.get("/:id",prcontrollers. getRatingById);  // GET BY ID
router.post("/",prcontrollers.insertRating);
router.put("/:id",prcontrollers.updateRating);
router.delete("/:id",prcontrollers.deleteRating);

module.exports = router;