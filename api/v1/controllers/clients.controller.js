const { createClients, updateClients, deleteClients, getClients, getClientById, getSelectClient } = require("../services/clients.service");

const createClientsController = async(request, response) => {
    try {
        const result = await createClients(request);

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
const updateClientsController = async(request, response) => {

    try {
        const result = await updateClients(request);

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
const deleteClientsController = async(request, response) => {

    try {
        const result = await deleteClients(request);
        response.json({ message: result })
    } catch (error) {
        response.json({ message: 'Internal Server Error ' }).status(500)
    }
}
const getClientsController = async(request, response) => {
    try {
        const result = await getClients(request);

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

const getClientByIdController = async(request, response) => {
    try {
        const result = await getClientById(request);

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
const getSelectClientController = async(request, response) => {
    try {
        const result = await getSelectClient(request);

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
module.exports = { getSelectClientController, getClientByIdController, createClientsController, deleteClientsController, updateClientsController, getClientsController }