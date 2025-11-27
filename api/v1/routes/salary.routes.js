const router =require("express").Router();
const {createSalaryController,getEmployeeSalaryByEmpIdController,getSalaryController, getSalarySlipController, updateSalaryController, getSalaryByIdController}=require("../controllers/salary.controller");


router.post("/create-salary",createSalaryController);
router.put("/update-salary",updateSalaryController);
router.get("/get-salary-slip/:empId/:month",getSalarySlipController)
router.get("/get-salary-by-id/:id",getSalaryByIdController)
router.get("/get-salary",getSalaryController);
router.get("/get-employee-salary-by-emp-id/:empId/:currentMonth",getEmployeeSalaryByEmpIdController);
module.exports =router;