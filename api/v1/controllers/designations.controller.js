// Table name designation
const { createDesignation, getSelectDesignation, updateDesignation, deleteDesignation, getDesignation } = require("../services/designation.service");
const createDesignationController = async(request, response) => {
    try {
        const result = await createDesignation(request);

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
const updateDesignationController = async(request, response) => {
    try {
        const result = await updateDesignation(request);

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
const deleteDesignationController = async(request, response) => {
    try {
        const result = await deleteDesignation(request);
            response.status(200).json({ message: result });
        
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
const getDesignationController = async(request, response) => {
    try {
        const result = await getDesignation(request);

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

const getSelectDesignationController = async(request, response) => {
    try {
        const result = await getSelectDesignation(request);

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
module.exports = { getSelectDesignationController, createDesignationController, deleteDesignationController, updateDesignationController, getDesignationController }