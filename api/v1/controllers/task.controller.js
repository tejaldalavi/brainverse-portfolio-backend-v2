const { createTask, getAllTask, updateSubTask, createSubTask, deleteSubtask, updateTask } = require("../services/task.service");

const createTaskController = async(request, response) => {
    try {
        const result = await createTask(request);
    
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
    
            response.status(200).json({ "Data inserted": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const createSubTaskController = async(request, response) => {
    try {
        const result = await createSubTask(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ "Data inserted": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });
    }
}

const getAllTaskController = async(request, response) => {
    try {
        const result = await getAllTask(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ data: result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });

    }
}

const updateSubTaskController = async(request, response) => {
    try {
        const result = await updateSubTask(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" });

    }
}

const updateTaskController = async(request, response) => {
    try {
        const result = await updateTask(request);
        if (typeof(result) != 'object') {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error" })
    }
}

const deleteSubtaskController = async(request, response) => {
    try {
        const result = await deleteSubtask(request);
        if (typeof(result) != "string") {
            response.status(500).json({ message: result });
        } else {
            response.status(200).json({ message: result });
        }
    } catch (error) {

        response.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { createTaskController, updateTaskController, createSubTaskController, getAllTaskController, updateSubTaskController, deleteSubtaskController };