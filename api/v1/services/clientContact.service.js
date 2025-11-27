const pool = require("../../config/database");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";;
const { getCurrentDate } = require("../utils")
const updateClientContact = async (request) => {

    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, clientName, clientEmail, clientPhone, designation } = request.body;
        const updatedAt = getCurrentDate();
        const SQL = `UPDATE clientContacts SET name="${clientName}",email="${clientEmail}",phone="${clientPhone}",designation="${designation}", updatedAt="${updatedAt}" WHERE id="${id}";`
        try {
            const updateQuery = await pool.query(SQL);
            const getUpdate = `SELECT * FROM clientContacts WHERE id=${id}`;
            const result = await pool.query(getUpdate);
            return result[0];
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    else {
        return "Invalid token";
    }
}
const deleteClientContact = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM clientContacts WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token"
    }
}
module.exports = { deleteClientContact, updateClientContact };