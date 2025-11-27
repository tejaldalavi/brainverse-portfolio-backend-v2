const router = require("express").Router();

const { createPorjectController, updatePorjectController, deletePorjectController, getPorjectController, getSelectProjectController, getProjectByIdController, updateModulesStatusController, getSelectModuleByProjectIdController, getInvoiceProjectDetailByProjectIdController, dashboardController } = require("../controllers/projects.controller");

router.get("/get-projects", getPorjectController);
router .get("/get-dashboard",dashboardController);
router.get("/get-select-project", getSelectProjectController);
router.get("/get-project-by-id/:id", getProjectByIdController);
router.get("/get-module-by-project-id/:projectId", getSelectModuleByProjectIdController)
router.get("/get-invoice-project-detail-by-project-id/:projectId", getInvoiceProjectDetailByProjectIdController)
router.post("/create-projects", createPorjectController);
router.put("/update-projects", updatePorjectController);
router.put("/update-module-status", updateModulesStatusController);
router.delete("/delete-projects/:id", deletePorjectController);
module.exports = router;