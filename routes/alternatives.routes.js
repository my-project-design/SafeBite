const express = require("express");
const router = express.Router();
const acontrollers = require("../controllers/alternatives.controllers");

router.get("/", acontrollers.getAllAlternatives);      // GET ALL
router.get("/:id",acontrollers. getAlternativeById);  // GET BY ID
router.post("/",acontrollers.insertAlternative);
router.put("/:id",acontrollers.updateAlternative);
router.delete("/:id",acontrollers.deleteAlternative);

module.exports = router;