const express = require("express");
const router = express.Router();
const uhpcontrollers = require("../controllers/userhealthprofile.controllers");

router.get("/", uhpcontrollers.getAllUserHealthProfiles);      // GET ALL
router.get("/:id",uhpcontrollers. getUserHealthProfileById);  // GET BY ID
router.post("/",uhpcontrollers.insertUserHealthProfile);
router.put("/:id",uhpcontrollers.updateUserHealthProfile);
router.delete("/:id",uhpcontrollers.deleteUserHealthProfile);

module.exports = router;