const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const updateEmployeeAllowance = async(data) => {
    const updatedAt = getCurrentDate();
    const { id, amount, allowanceId } = data;

    try {
        const SQL = `UPDATE employeeAllowances SET amount ="${amount}",allowanceId="${allowanceId}",updatedAt="${updatedAt}" WHERE id=${id}`;
        const updateQuery = await pool.query(SQL);
        const getUpdate = `SELECT * FROM employeeAllowances WHERE id=${id}`;
        const result = await pool.query(getUpdate);
        return result[0];
    } catch (err) {
        return JSON.stringify(err);
    }
}
const deleteEmployeeAllowance = async(id) => {
    const SQL = `DELETE FROM  employeeAllowances WHERE id="${id}"`;
    try {
        await pool.query(SQL);
        return `id: ${id} Deleted Successfully`
    } catch (error) {
        return error
    }
}
module.exports = { updateEmployeeAllowance, deleteEmployeeAllowance };