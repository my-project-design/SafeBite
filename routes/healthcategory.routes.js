const express=require("express");
const router=express.Router();

const hcControllers=require("../controllers/healthcategory.controllers");
//console.log("BMI CONTROLLERS => ", bControllers);

router.get("/", hcControllers.getAll);
router.get("/:id", hcControllers.getHealthCategoryById);
router.post("/", hcControllers.insertHealthCategory);
router.put("/:id", hcControllers.updateHealthCategory);
router.delete("/:id",hcControllers.removeHealthCategory);


module.exports=router;