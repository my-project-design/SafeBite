const express = require("express");
const router = express.Router();

const mControllers = require("../controllers/mealsnutrition.controllers");

console.log("MEALS CONTROLLERS => ", mControllers);


router.get("/", mControllers.getMealNutritionAll);
router.get("/:id", mControllers.getMealNutritionById);
router.post("/", mControllers.insertMealNutrition);
router.put("/:id", mControllers.updateMealNutrition);
router.delete("/:id", mControllers.deleteMealNutrition);

module.exports = router;