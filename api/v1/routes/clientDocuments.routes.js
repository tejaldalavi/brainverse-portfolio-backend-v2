const { updateClientDocumentController, deleteClientDocumentController } = require("../controllers/clientDocuments.controller");

const router = require("express").Router();

router.delete("/delete-client-document/:id", deleteClientDocumentController);
router.put("/update-client-document", updateClientDocumentController);
module.exports = router;