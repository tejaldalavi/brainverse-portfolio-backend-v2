const { deleteEmployeeBankDetails, updateEmployeeBankDetails } = require("../services/employeeBankDetail.service")

const updateEmployeeBankDetailsController = async(request, response) => {

    const result = await updateEmployeeBankDetails(request.body)
    try {
        response.json({ "message": result }).status(202);
    } catch (err) {
        response.json({ message: "Internal Server Error" }).status(500)
    }
}
const deleteEmployeeBankDetailsController = async(request, response) => {
    const { id } = request.params;
    try {
        const result = await deleteEmployeeBankDetails(id);
        response.json({ message: result }).status(200);

    } catch (err) {
        response.json({ message: err.message }).status(500);
    }
}
module.exports = { deleteEmployeeBankDetailsController, updateEmployeeBankDetailsController };