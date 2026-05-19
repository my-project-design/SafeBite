const express = require("express");
const router = express.Router();
const cControllers = require("../controllers/category.controllers");

router.get("/",        cControllers.getcatAll);
router.get("/:id",     cControllers.getcatById);
router.post("/",       cControllers.insertCategory);
router.put("/:id",     cControllers.updateCategory);
router.delete("/:id",  cControllers.removeCategory);

module.exports = router;