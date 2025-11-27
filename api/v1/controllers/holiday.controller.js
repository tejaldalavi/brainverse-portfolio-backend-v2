const { createHoliday, updateHoliday, getHoliday, deleteHoliday } = require("../services/holiday.service")

const createHolidayController = async(request, response) => {
    try {
        const result = await createHoliday(request);

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
const updateHolidayController = async(request, response) => {
    try {
        const result = await updateHoliday(request);

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
const getHolidayController = async(request, response) => {
    try {
        const result = await getHoliday(request);

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
const deleteHolidayController = async(request, response) => {
 
    try {
        const result = await deleteHoliday(request);
        response.status(200).json({ data: result });

    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" })
    }
}
module.exports = { createHolidayController, updateHolidayController, deleteHolidayController, getHolidayController };