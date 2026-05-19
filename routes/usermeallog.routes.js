const express = require("express");
const router = express.Router();
const umlcontrollers = require("../controllers/usermeallog.controllers");

router.get("/", umlcontrollers.getAllUserMealLogs);      // GET ALL
router.get("/:id",umlcontrollers.getUserMealLogById);  // GET BY ID
router.post("/",umlcontrollers.insertUserMealLog);
router.put("/:id",umlcontrollers.updateUserMealLog);
router.delete("/:id",umlcontrollers.deleteUserMealLog);

module.exports = router;