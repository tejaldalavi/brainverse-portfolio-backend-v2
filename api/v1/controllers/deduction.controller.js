const { createDeduction, getSelectDeduction, updateDeduction, deleteDeduction, getallDeduction } = require('../services/deduction.service');
const pool = require('../../config/database')

const createDeductionController = async(request, response) => {

    try {
        const result = await createDeduction(request);

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

const updateDeductionController = async(request, response) => {

    try {
        const result = await updateDeduction(request);

        if (typeof (result) != 'object') {
            response.status(500).json({ message: "Internal Server Error"+result });
        }
        else {
            response.status(200).json({ "Data Updated": result });
        }
    } catch (error) {
        response.status(500).json({ message: "Internal Server Error"+error });
    }
}

const deleteDeductionController = async(request, response) => {

    try {
        const result = await deleteDeduction(request);
        response.json({ message: result });
    } catch (error) {
        response.json({ message: 'Internal Server Error ' }).status(500);
    }
}

const getallDeductionController = async(request, response) => {
    try {
        const result = await getallDeduction(request);

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
const getSelectDeductionController = async(request, response) => {
    try {
        const result = await getSelectDeduction(request);

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
module.exports = { createDeductionController, getSelectDeductionController, deleteDeductionController, getallDeductionController, updateDeductionController }