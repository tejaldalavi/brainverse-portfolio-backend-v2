const { createTaskController, getAllTaskController, createSubTaskController, updateSubTaskController, deleteSubtaskController, updateTaskController } = require("../controllers/task.controller");
const router = require("express").Router();

router.get("/get-task", getAllTaskController);
router.post("/create-task", createTaskController);
router.post("/create-subtask", createSubTaskController);
router.patch("/update-task/:id", updateTaskController)
router.patch("/update-subtask/:id/:taskId", updateSubTaskController);
router.delete("/delete-subtask/:id/:taskId", deleteSubtaskController)
module.exports = router;