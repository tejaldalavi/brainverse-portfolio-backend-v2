const pool = require("../../config/database");
const { getCurrentDate } = require('../utils');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const updateClientDocument = async(data) => {
    const updatedAt = getCurrentDate();
    const { id, documentLink, documentName, description } = data;
    const SQL = `UPDATE clientDocuments SET documentLink="${documentLink}",documentName="${documentName}",description="${description}",updatedAt="${updatedAt}" WHERE id="${id}";`
    try {
        const updateQuery = await pool.query(SQL);
        const getUpdate = `SELECT * FROM clientDocuments WHERE id=${id}`;
        const result = await pool.query(getUpdate);
        return result[0];
    } catch (err) {
        return JSON.stringify(err);
    }
}
const deleteClientDocument = async(id) => {
    try {

        const sql = `DELETE FROM clientDocuments WHERE id=${id}`;

        const result = await pool.query(sql)
        return `id: ${id} Deleted Successfully`;
    } catch (error) {
        return JSON.stringify(error);
    }
}
module.exports = { deleteClientDocument, updateClientDocument };