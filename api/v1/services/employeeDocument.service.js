const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const updateEmployeeDocuments = async(data) => {
    const updatedAt = getCurrentDate();
    const { id, documentLink, documentName, required } = data;
    try {
        const SQL = `UPDATE employeeDocuments SET documentLink ="${documentLink}",documentName="${documentName}",required="${required}",updatedAt="${updatedAt}" WHERE id="${id}"`;
        const updateQuery = await pool.query(SQL);
        const getUpdate = `SELECT * FROM employeeDocuments WHERE id=${id}`;
        const result = await pool.query(getUpdate);
        return result[0];
    } catch (err) {
        return JSON.stringify(err);
    }

}
const deleteEmployeeDocuments = async(id) => {
    const SQL = `DELETE FROM  employeeDocuments WHERE id="${id}"`;

    try {
        await pool.query(SQL);
        return `id: ${id} Deleted Successfully`
    } catch (error) {
        return error
    }
}
module.exports = { updateEmployeeDocuments, deleteEmployeeDocuments };