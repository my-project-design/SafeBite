const express=require("express");
const router=express.Router();
const aControllers=require("../controllers/mstadmin.controllers");

router.get('/', aControllers.getAll);
router.get('/:id', aControllers.getmstAdminById);
router.post('/check',aControllers.check);

module.exports=router;