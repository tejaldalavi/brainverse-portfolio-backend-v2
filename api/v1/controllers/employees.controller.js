const { createEmployees,updateProfileImage, updateEmployees, deleteEmployees, getEmployees, getSelectEmployees, getEmployeesById, employeeLogin, updateAccessManagement, getSelectEmployeeByDurationType, verifyEmployeeToken, getAccessManagement, employeeOffBoarding } = require("../services/employees.service");

const createEmployeesController = async(request, response) => {
    try {
        const result = await createEmployees(request);

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

const updateEmployeesController = async(request, response) => {

    try {
        const result = await updateEmployees(request);

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

const deleteEmployeesController = async(request, response) => {
    try {
        const result = await deleteEmployees(request);
            response.status(200).json({ message: result });
        
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const getEmployeesController = async(request, response) => {
    try {
        const result = await getEmployees(request);

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

const getSelectEmployeeByDurationTypeController = async(request, response) => {
   
    try {
        const result = await getSelectEmployeeByDurationType(request);

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

const getSelectEmployeesControllers = async(request, response) => {
    try {
        const result = await getSelectEmployees(request);

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

const getEmployeeByIdControllers = async(request, response) => {
    try {
        const result = await getEmployeesById(request);

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

const employeeLoginController = async(request, response) => {
    try {
        const result = await employeeLogin(request);

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

const updateAccessManagementController = async(request, response) => {
    try {
        const result = await updateAccessManagement(request);

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

const verifyEmployeeTokenController = async(request, response) => {
    try {
        const result = await verifyEmployeeToken(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ result: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const getAccessManagementController = async(request, response) => {
    try {
        const result = await getAccessManagement(request);

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

const updateProfileImageController =async(request,response)=>{
    try {
        const result = await updateProfileImage(request);

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

const employeeOffBoardingController =async(request,response)=>{
    try {
        const result = await employeeOffBoarding(request);

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
module.exports = { employeeOffBoardingController,updateProfileImageController, verifyEmployeeTokenController, getAccessManagementController, getSelectEmployeeByDurationTypeController, updateAccessManagementController, getEmployeeByIdControllers, employeeLoginController, getSelectEmployeesControllers, createEmployeesController, deleteEmployeesController, updateEmployeesController, getEmployeesController }