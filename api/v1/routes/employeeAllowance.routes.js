const router = require("express").Router();

const { deleteEmployeeAllowanceController, updateEmployeeAllowanceController } = require("../controllers/employeeAllowance.controller");
router.delete("/delete-employee-allowance/:id", deleteEmployeeAllowanceController);
router.put("/update-employee-allowance", updateEmployeeAllowanceController);
module.exports = router;