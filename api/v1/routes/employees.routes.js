const router = require("express").Router();
const { getEmployeesController, createEmployeesController, updateEmployeesController, deleteEmployeesController,
     getSelectEmployeesControllers, getEmployeeByIdControllers, employeeLoginController, updateAccessManagementController,
      getSelectEmployeeByDurationTypeController, verifyEmployeeTokenController, getAccessManagementController,
       updateProfileImageController, employeeOffBoardingController } = require('../controllers/employees.controller')

router.get("/get-employees", getEmployeesController);
router.get("/get-select-employees", getSelectEmployeesControllers);
router.get("/get-select-employees-by-duration-type/:durationType", getSelectEmployeeByDurationTypeController)
router.get("/get-employee-by-id/:id", getEmployeeByIdControllers);
router.get("/get-access-management", getAccessManagementController)
router.post("/employee-login", employeeLoginController);
router.post("/create-employees", createEmployeesController);
router.post("/verify-employee-token", verifyEmployeeTokenController);
router.post("/employee-offboarding",employeeOffBoardingController);
router.put("/update-employees", updateEmployeesController);
router.put("/update-profile-image",updateProfileImageController);
router.patch("/update-access-management", updateAccessManagementController);
router.delete("/delete-employees/:id", deleteEmployeesController);
module.exports = router;