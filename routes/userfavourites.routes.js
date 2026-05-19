const express = require("express");
const router = express.Router();
const controllers = require("../controllers/userfavourites.controllers");

router.get("/", controllers.getAllUserFavourites);
router.get("/:id", controllers.getUserFavouritesById);
router.post("/", controllers.insertUserFavourites);
router.put("/:id", controllers.updateUserFavourites);
router.delete("/:id", controllers.deleteUserFavourites);

module.exports = router;