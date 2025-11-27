const router = require("express").Router();
const { deleteEmployeeBankDetailsController, updateEmployeeBankDetailsController } = require('../controllers/employeeBankDetails.controller')

router.delete("/delete-employee-bankdetails/:id", deleteEmployeeBankDetailsController);
router.put("/update-employee-bankdetails", updateEmployeeBankDetailsController)
module.exports = router;