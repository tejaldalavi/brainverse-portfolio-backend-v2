const { deleteClientContactController, updateClientContactController } = require("../controllers/clientContact.controller");

const router = require("express").Router();

router.delete("/delete-client-contact/:id", deleteClientContactController);
router.put("/update-client-contact", updateClientContactController);
module.exports = router;