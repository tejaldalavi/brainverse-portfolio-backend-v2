const router = require("express").Router();
const { getClientsController, createClientsController, updateClientsController, deleteClientsController, getClientByIdController, getSelectClientController } = require('../controllers/clients.controller')

router.get("/get-clients", getClientsController);
router.delete("/delete-clients/:id", deleteClientsController);
router.post("/create-clients", createClientsController);
router.put("/update-clients", updateClientsController);
router.get("/get-client-by-id/:id", getClientByIdController);
router.get("/get-select-clients", getSelectClientController)
module.exports = router;