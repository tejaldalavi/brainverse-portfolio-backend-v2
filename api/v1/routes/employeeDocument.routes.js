const router = require("express").Router();

const { deleteEmployeeDocumentsController, updateEmployeeDocumentsController } = require("../controllers/employeeDocument.controller");
router.delete("/delete-employee-documents/:id", deleteEmployeeDocumentsController);
router.put("/update-employee-documents", updateEmployeeDocumentsController);
module.exports = router;