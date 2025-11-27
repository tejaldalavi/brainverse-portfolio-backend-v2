const { createOvertimeController, getOvertimeController, updateOvertimeController, deleteOvertimeController, getSelectOvertimeController } = require('../controllers/overtime.controller');

const router = require('express').Router();

router.post("/create-overtime", createOvertimeController);
router.put("/update-overtime", updateOvertimeController);
router.get("/get-overtime", getOvertimeController);
router.delete("/delete-overtime/:id", deleteOvertimeController);
router.get("/get-select-overtime", getSelectOvertimeController)
module.exports = router;