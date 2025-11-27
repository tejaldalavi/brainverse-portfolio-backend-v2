const { createInvoicesController, getInvoiceByIdController, getInvoicesController, updateInvoiceController, cencelInvoiceController } = require("../controllers/invoices.controller");

const router = require("express").Router();
router.post("/create-invoices", createInvoicesController);
router.get("/get-invoice-by-id/:id", getInvoiceByIdController);
router.get("/get-invoices", getInvoicesController);
router.patch("/update-invoice", updateInvoiceController);
router.delete("/cencel-invoice/:id",cencelInvoiceController);
module.exports = router;