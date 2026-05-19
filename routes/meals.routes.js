const express=require("express");
const router=express.Router();

const mControllers=require("../controllers/meals.controllers");
//console.log("BMI CONTROLLERS => ", bControllers);

router.get("/", mControllers.getAll);
router.get("/:id", mControllers.getMealsById);
router.post("/", mControllers.insertMeals);
router.put("/:id", mControllers.updateMeals);
router.delete("/:id",mControllers.removeMeals);


module.exports=router;