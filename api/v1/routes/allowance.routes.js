const router = require("express").Router();
const { getAllowanceController, createAllowanceController, updateAllowanceController, deleteAllowanceController, getSelectAllowanceController } = require('../controllers/allowances.controller')

router.get("/get-allowances", getAllowanceController);
router.delete("/delete-allowances/:id", deleteAllowanceController);

router.post("/create-allowances", createAllowanceController);
router.put("/update-allowances", updateAllowanceController);
router.get("/get-select-allowances", getSelectAllowanceController);
module.exports = router;