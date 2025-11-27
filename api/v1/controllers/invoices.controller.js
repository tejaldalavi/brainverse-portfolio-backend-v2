const { createInvoices, getInvoiceById, getInvoices, updateInvoice, cencelInvoice } = require("../services/invoice.service");

const createInvoicesController = async (request, response) => {
    try {
        const result = await createInvoices(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ "Data Inserted ": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getInvoiceByIdController = async (request, response) => {
    try {
        const result = await getInvoiceById(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getInvoicesController = async (request, response) => {

    try {
        const result = await getInvoices(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json( result );
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const updateInvoiceController = async (request, response) => {
    try {
        const result = await updateInvoice(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const cencelInvoiceController = async (request, response) => {
    try {
        const result = await cencelInvoice(request);
        response.status(200).json({ data: result });
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = { createInvoicesController, cencelInvoiceController, getInvoiceByIdController, getInvoicesController, updateInvoiceController };