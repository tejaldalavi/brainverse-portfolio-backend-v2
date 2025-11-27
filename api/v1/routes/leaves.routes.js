const router = require("express").Router();
const { getAllLeaveController, getLeaveByEmpIdController, createLeaveController, updateLeaveController, deleteLeaveController } = require("../controllers/leaves.controller");

router.get("/get-all-leaves", getAllLeaveController);
router.get("/get-leaves-by-employee-id/:empId/:startDate/:endDate", getLeaveByEmpIdController)
router.post("/create-leaves", createLeaveController);
router.patch("/update-leaves/:id", updateLeaveController);

module.exports = router;