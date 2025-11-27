const router = require("express").Router();
const { createDepartmentsController, deleteDepartmentsController, updateDepartmentsController, getDepartmentsControllers, getSelectDepartmentsControllers } = require('../controllers/departments.controller')

router.get("/get-select-departments", getSelectDepartmentsControllers);
router.get("/get-department", getDepartmentsControllers);
router.delete("/delete-department/:id", deleteDepartmentsController)
router.post("/create-department", createDepartmentsController)
router.put("/update-department", updateDepartmentsController)
module.exports = router;