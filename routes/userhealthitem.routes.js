const express = require("express");
const router = express.Router();

const userHealthControllers = require("../controllers/userhealthitem.controllers");

router.get("/", userHealthControllers.getUserHealthItemAll);
router.get("/:id", userHealthControllers.getUserHealthItemById);
router.post("/", userHealthControllers.insertUserHealthItem);
router.put("/:id", userHealthControllers.updateUserHealthItem);
router.delete("/:id", userHealthControllers.deleteUserHealthItem);

module.exports = router;