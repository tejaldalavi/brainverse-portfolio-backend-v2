const { getAllowances, createAllowances, deleteAllowances, updateAllowances, getSelectAllowance } = require("../services/allowances.service")
const createAllowanceController = async(request, response) => {

    try {
        const result = await createAllowances(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ "Data Inserted": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getAllowanceController = async(request, response) => {

    try {
        const result = await getAllowances(request);

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
const updateAllowanceController = async(request, response) => {

    try {
        const result = await updateAllowances(request);

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
const deleteAllowanceController = async(request, response) => {
    
    try {
        const result = await deleteAllowances(request);
            response.status(200).json({ message: result });
        
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getSelectAllowanceController = async(request, response) => {
    try {
        const result = await getSelectAllowance(request);

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
module.exports = { getSelectAllowanceController, createAllowanceController, getAllowanceController, deleteAllowanceController, updateAllowanceController }