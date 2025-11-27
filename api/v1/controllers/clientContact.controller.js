const { updateClientContact, deleteClientContact } = require('../services/clientContact.service');
const updateClientContactController = async (request, response) => {
    try {
        const result = await updateClientContact(request);

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
const deleteClientContactController = async (request, response) => {
    try {
        const result = await deleteClientContact(request);
        response.status(200).json({ message: result });

    } catch (error) { 
        response.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = { deleteClientContactController, updateClientContactController };