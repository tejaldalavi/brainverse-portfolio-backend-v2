const { createAllowances } = require("../services/samples.service")
const getUserSamplesController = async(request, response) => {

    // try {
    //     const result = await createAllowances(request);

    //     if (typeof (result) != 'object') {
    //         response.status(500).json({ message: "Internal Server Error" });
    //     }
    //     else {
    //         response.status(200).json({ "Data Inserted": result });
    //     }
    // } catch (error) {
    //     response.status(500).json({ message: "Internal Server Error" });
    // }
    response.status(200).json({ "getUserSamplesController ": "result" });
}

module.exports = { getUserSamplesController }