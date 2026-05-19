const express=require("express")
const router=express.Router();
const uControllers=require("../controllers/mstuser.controllers");

router.get('/',uControllers.getAll);
router.get('/:id',uControllers.getmstuserById);
router.post('/register', uControllers.registerUser);
router.post('/login', uControllers.loginUser);
router.post('/register',uControllers.registerUser);
module.exports=router;