const { createDepartments, updateDepartments, deleteDepartments, getDepartments, getSelectDepartments } = require('../services/department.service')
const createDepartmentsController = async (request, response) => {
    try {
        const result = await createDepartments(request);

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
const updateDepartmentsController = async (request, response) => {
    try {
        const result = await updateDepartments(request);

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
const deleteDepartmentsController = async (request, response) => {

    try {
        const result = await deleteDepartments(request);
        response.json({ message: result });
    } catch (error) {
        response.json({ message: 'Internal Server Error ' }).status(500);
    }
}
const getDepartmentsControllers = async (request, response) => {
    try {
        const result = await getDepartments(request);

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

const getSelectDepartmentsControllers = async (request, response) => {
    try {
        const result = await getSelectDepartments(request);

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
module.exports = { createDepartmentsController, deleteDepartmentsController, updateDepartmentsController, getDepartmentsControllers, getSelectDepartmentsControllers };