const { createLeave, updateLeave, getAllLeave, getLeaveByEmpId } = require("../services/leaves.service");

const createLeaveController = async(request, response) => {
    try {
        const result = await createLeave(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ "Data inserted": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const updateLeaveController = async(request, response) => {
    try {
        const result = await updateLeave(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllLeaveController = async(request, response) => {
    try {
        const result = await getAllLeave(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({...result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getLeaveByEmpIdController = async(request, response) => {

    try {
        const result = await getLeaveByEmpId(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({...result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { getAllLeaveController, getLeaveByEmpIdController, createLeaveController, updateLeaveController };