const express = require("express");
const router = express.Router();
const nfcontrollers = require("../controllers/nutritionfacts.controllers");

router.get("/", nfcontrollers.getAllNutritionFacts);      // GET ALL
router.get("/:id",nfcontrollers.getNutritionFactsById);  // GET BY ID
router.post("/",nfcontrollers.insertNutritionFacts);
router.put("/:id",nfcontrollers.updateNutritionFacts);
router.delete("/:id",nfcontrollers.deleteNutritionFacts);

module.exports = router;