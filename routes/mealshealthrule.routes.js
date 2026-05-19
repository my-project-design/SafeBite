const express = require("express");
const router = express.Router();

const mealsHealthRuleControllers = require("../controllers/mealshealthrule.controllers");
router.get("/", mealsHealthRuleControllers.getMealsHealthRuleAll);
router.get("/:id", mealsHealthRuleControllers.getMealsHealthRuleById);
router.post("/", mealsHealthRuleControllers.insertMealsHealthRule);
router.put("/:id", mealsHealthRuleControllers.updateMealsHealthRule);
router.delete("/:id", mealsHealthRuleControllers.deleteMealsHealthRule);

module.exports = router;