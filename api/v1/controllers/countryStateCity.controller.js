const { getCities, getStates } = require("../services/countryStateCity.service")
const getStatecontroller = async(request, response) => {
    try {
        const result = await getStates(request);

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
const getCitiesController = async(request, response) => {
    try {
        const result = await getCities(request);

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
module.exports = { getStatecontroller, getCitiesController }