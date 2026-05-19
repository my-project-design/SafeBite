const express=require("express");
const router=express.Router();

const pControllers=require("../controllers/product.controllers");
//console.log=("BRAND CONTROLLERS =>", brControllers);

router.get("/",pControllers.getAllProducts);
router.get("/:id",pControllers.getProductById);
router.post("/",pControllers.upload.single("logo"),pControllers.insertProduct);
router.put("/:id",pControllers.upload.single("logo"),pControllers.updateProduct);
router.delete("/:id",pControllers.deleteProduct);


module.exports=router;