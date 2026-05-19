const express=require("express");
const router=express.Router();

const bControllers=require("../controllers/bmicategory.controllers");
console.log("BMI CONTROLLERS => ", bControllers);

router.get("/", bControllers.getAll);
router.get("/:id", bControllers.getBmiCategoryById);
router.post("/", bControllers.insertBmiCategory);
router.put("/:id", bControllers.updateBmiCategory);
router.delete("/:id",bControllers.removeBmiCategory);


module.exports=router;