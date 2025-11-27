const { createOvertime, getOvertime, updateOvertime, deleteOverTime, getSelectOvertime } = require("../services/overtime.service");

const createOvertimeController = async(request, response) => {
    try {
        const result = await createOvertime(request);

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
const getOvertimeController = async(request, response) => {
    try {
        const result = await getOvertime(request);

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
const deleteOvertimeController = async(request, response) => {
    try {
        const result = await deleteOverTime(request);
        response.json({ message: result });
    } catch (error) {
        response.json({ message: 'Internal Server Error ' }).status(500);
    }
}
const updateOvertimeController = async(request, response) => {

    try {
        const result = await updateOvertime(request);

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
const getSelectOvertimeController = async(request, response) => {
    try {
        const result = await getSelectOvertime(request);

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
module.exports = { updateOvertimeController, getSelectOvertimeController, createOvertimeController, getOvertimeController, deleteOvertimeController };