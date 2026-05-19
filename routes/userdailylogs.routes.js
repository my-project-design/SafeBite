const express = require("express");
const router = express.Router();
const udlcontrollers = require("../controllers/userdailylogs.controllers");

router.get("/", udlcontrollers.getAllUserDailyLogs);      // GET ALL
router.get("/:id",udlcontrollers. getUserDailyLogById);  // GET BY ID
router.post("/",udlcontrollers.insertUserDailyLog);
router.put("/:id",udlcontrollers.updateUserDailyLog);
router.delete("/:id",udlcontrollers.deleteUserDailyLog);

module.exports = router;