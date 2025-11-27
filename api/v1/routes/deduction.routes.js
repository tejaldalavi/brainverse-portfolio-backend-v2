const router = require('express').Router();
const { createDeductionController, updateDeductionController, deleteDeductionController, getallDeductionController, getSelectDeductionController } = require('../controllers/deduction.controller');
router.get("/get-deductions", getallDeductionController);
router.delete("/delete-deductions/:id", deleteDeductionController);
router.post("/create-deductions", createDeductionController);
router.put("/update-deductions", updateDeductionController);
router.get("/get-select-deduction", getSelectDeductionController);
module.exports = router;