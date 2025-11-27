const { updateClientDocument, deleteClientDocument } = require('../services/clientDocuments.service');
const updateClientDocumentController = async(request, response) => {

    try {
        const result = await updateClientDocument(request.body);
        response.json({ "Data Updated": result }).status(200)
    } catch (error) {
        response.json({ message: "Internal Server Error" }).status(500);
    }
}
const deleteClientDocumentController = async(request, response) => {
    const { id } = request.params;
    try {
        const result = await deleteClientDocument(id);
        response.json({ message: result }).status(200)
    } catch (error) {
        response.json({ message: "Internal Server Error" + error.message }).status(500);
    }
}
module.exports = { updateClientDocumentController, deleteClientDocumentController };