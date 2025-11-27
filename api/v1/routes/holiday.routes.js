const router = require("express").Router();
const { createHolidayController, getHolidayController, deleteHolidayController, updateHolidayController } = require("../controllers/holiday.controller");

router.get("/get-holiday", getHolidayController);
router.post("/create-holiday", createHolidayController);
router.put("/update-holiday", updateHolidayController);
router.delete("/delete-holiday/:id", deleteHolidayController);

module.exports = router;