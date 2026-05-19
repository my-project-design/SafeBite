const express = require("express");
const router = express.Router();
const hicontrollers = require("../controllers/healthitems.controllers");

router.get("/", hicontrollers.getHealthItemAll);      // GET ALL
router.get("/:id", hicontrollers.getHealthItemById);  // GET BY ID
router.post("/", hicontrollers.insertHealthItem);     // INSERT
router.put("/:id",hicontrollers.updateHealthItem);   // UPDATE
router.delete("/:id",hicontrollers.deleteHealthItem);

module.exports = router;