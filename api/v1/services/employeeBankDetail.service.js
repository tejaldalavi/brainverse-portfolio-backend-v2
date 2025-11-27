const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";;
const updateEmployeeBankDetails = async(data) => {
    const updatedAt = getCurrentDate();
    const { id, bankName, name, accountNumber, ifsc } = data;
    try {
        const SQL = `UPDATE employeeBankDetails SET name ="${name}",bankName="${bankName}",accountNumber="${accountNumber}" , ifsc = "${ifsc}",updatedAt="${updatedAt}" WHERE id = "${id}"`;
        const updateQuery = await pool.query(SQL);
        const getUpdate = `SELECT * FROM employeeBankDetails WHERE id=${id}`;
        const result = await pool.query(getUpdate);
        return result[0];
    } catch (err) {
        return JSON.stringify(err);
    }
}
const deleteEmployeeBankDetails = async(id) => {
    const SQL = `DELETE FROM  employeeBankDetails WHERE id="${id}"`;
    try {
        await pool.query(SQL);
        return `id: ${id} Deleted Successfully`
    } catch (error) {
        return error
    }
}
module.exports = { updateEmployeeBankDetails, deleteEmployeeBankDetails };