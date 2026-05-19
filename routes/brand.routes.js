const express=require("express");
const router=express.Router();

const brControllers=require("../controllers/brand.controllers");
//console.log=("BRAND CONTROLLERS =>", brControllers);

router.get("/",brControllers.getAll);
router.get("/:id",brControllers.getBrandById);
router.post("/",brControllers.insertBrand);
router.put("/:id",brControllers.updateBrand );
router.delete("/:id",brControllers.deleteBrand);


module.exports=router;