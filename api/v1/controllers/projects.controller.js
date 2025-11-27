const { createProjects, updateModulesStatus, getProjectById, updateProjects, deleteProjects, getProjects, getSelectProject, getSelectModuleByProjectId, getInvoiceProjectDetailByProjectId, dashboard } = require("../services/projects.service")

const createPorjectController = async(request, response) => {
    try {
        const result = await createProjects(request);

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

const updatePorjectController = async(request, response) => {
    try {
        const result = await updateProjects(request);

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

const deletePorjectController = async(request, response) => {

    try {
        const result = await deleteProjects(request);

        response.json({ message: result }).status(202);
    } catch (error) {
        response.json({ message: "Internal Server Error" }).status(500)
    }
}

const getPorjectController = async(request, response) => {
    try {
        const result = await getProjects(request);

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

const getSelectProjectController = async(request, response) => {
    try {
        const result = await getSelectProject(request);

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

const getProjectByIdController = async(request, response) => {
    try {
        const result = await getProjectById(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const updateModulesStatusController = async(request, response) => {
    try {
        const result = await updateModulesStatus(request);

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

const getSelectModuleByProjectIdController = async(request, response) => {
    try {
        const result = await getSelectModuleByProjectId(request);

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

const getInvoiceProjectDetailByProjectIdController = async(request, response) => {
    try {
        const result = await getInvoiceProjectDetailByProjectId(request);

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

const dashboardController =async(request,response)=>{
    try {
        const result = await dashboard(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error" });
        }
        else {
            response.status(200).json({ data: [result] });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = { getSelectProjectController, dashboardController,getInvoiceProjectDetailByProjectIdController, getSelectModuleByProjectIdController, updateModulesStatusController, getProjectByIdController, createPorjectController, updatePorjectController, deletePorjectController, getPorjectController }