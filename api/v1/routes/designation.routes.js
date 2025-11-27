const router = require("express").Router();
const { getDesignationController, createDesignationController, updateDesignationController, deleteDesignationController, getSelectDesignationController } = require('../controllers/designations.controller')

router.get("/get-designation", getDesignationController);
router.get("/get-select-designation", getSelectDesignationController)
router.delete("/delete-designation/:id", deleteDesignationController)
router.post("/create-designation", createDesignationController)
router.put("/update-designation", updateDesignationController)
module.exports = router;