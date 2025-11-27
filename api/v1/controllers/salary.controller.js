const { createSalary, getEmployeeSalaryByEmpId, getSalary, getSalarySlip, updateSalary, getSalaryById } = require("../services/salary.service")

const createSalaryController = async (request, response) => {
    try {
        const result = await createSalary(request);

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

const getSalaryController = async (request, response) => {
    try {
        const result = await getSalary(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error"  });
        }
        else {
            response.status(200).json({ data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error"  });
    }
}
const getSalaryByIdController = async (request, response) => {
    try {
        const result = await getSalaryById (request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error"  });
        }
        else {
            response.status(200).json({ data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" + error });
    }
}

const getEmployeeSalaryByEmpIdController = async (request, response) => {
    try {
        const result = await getEmployeeSalaryByEmpId(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error " + result });
        }
        else {
            response.status(200).json({ data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" + error });
    }

}

const getSalarySlipController = async (request, response) => {

    try {
        const result = await getSalarySlip(request);

        if (typeof result !== 'object') { // Fixed the comparison
            response.status(500).json({ message: "Internal Server Error" + result });
        } else {

            response.status(200).json({ data: result });
        }
    } catch (error) {

        response.status(500).json({ message: "Internal Server Error" }); // Fixed the typo
    }
}

const updateSalaryController = async (request, response) => {
    try {
        const result = await updateSalary(request);

        if (typeof result !== 'object') { // Fixed the comparison
            response.status(500).json({ message: "Internal Server Error" +result });
        } else {

            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {

        response.status(500).json({ message: "Internal Server Error"+error }); // Fixed the typo
    }
}


module.exports = { getEmployeeSalaryByEmpIdController,getSalaryByIdController, updateSalaryController, getSalaryController, createSalaryController, getSalarySlipController };