const { deleteEmployeeDocuments, updateEmployeeDocuments } = require("../services/employeeDocument.service")

const updateEmployeeDocumentsController = async(request, response) => {
    const result = await updateEmployeeDocuments(request.body)
    try {
        response.json({ "message": result }).status(202);
    } catch (err) {
        response.json({ message: "Internal Server Error" }).status(500)
    }
}
const deleteEmployeeDocumentsController = async(request, response) => {
    const { id } = request.params;
    try {
        const result = await deleteEmployeeDocuments(id);
        response.json({ message: result }).status(200);

    } catch (err) {
        response.json({ message: err.message }).status(500);
    }
}
module.exports = { deleteEmployeeDocumentsController, updateEmployeeDocumentsController };