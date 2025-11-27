const { deleteEmployeeAllowance, updateEmployeeAllowance } = require("../services/employeeAllowance.service")

const updateEmployeeAllowanceController = async(request, response) => {



    const result = await updateEmployeeAllowance(request.body)
    try {
        response.json({ "message": result }).status(202);
    } catch (err) {
        response.json({ message: "Internal Server Error" }).status(500)
    }
}
const deleteEmployeeAllowanceController = async(request, response) => {
    const { id } = request.params;
    try {
        const result = await deleteEmployeeAllowance(id);
        response.json({ message: result }).status(200);

    } catch (err) {
        response.json({ message: err.message }).status(500);
    }
}
module.exports = { deleteEmployeeAllowanceController, updateEmployeeAllowanceController };