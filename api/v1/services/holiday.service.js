const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createHoliday = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, date } = request.body;
        try {
            const SQL = `INSERT INTO holiday (name,date,createdAt,updatedAt) 
        VALUES ("${name}","${date}","${createdAt}","${updatedAt}")
        `;
            const create = await pool.query(SQL);
            const get = `SELECT * FROM holiday WHERE id=${create[0].insertId}`;
            const result = await pool.query(get);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getHoliday = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { page, result_size, search } = request.query;
        const start = (page * result_size) - result_size;
        const end = result_size;
        try {
            const SQL = `SELECT * FROM holiday ${search ? `WHERE name LIKE "%${search}%"` : ""} LIMIT ${start}, ${end}`;
            const getCount = `SELECT COUNT(*) FROM holiday ${search ? `WHERE name LIKE "%${search}%"` : ""}`;
            const count = await pool.query(getCount)
            const result = await pool.query(SQL);
            return {
                result: result[0],
                count: count[0][0]["COUNT(*)"]
            }
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateHoliday = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, name, date } = request.body;

        try {
            const SQL = `UPDATE holiday SET name="${name}",date="${date}",updatedAt="${updatedAt}" WHERE id=${id}`;
            await pool.query(SQL);
            const data = `SELECT * FROM holiday WHERE id=${id}`
            const result = await pool.query(data);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const deleteHoliday = async (request) => {
    const { id } = request.params;
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM holiday WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`;
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}
module.exports = { createHoliday, getHoliday, deleteHoliday, updateHoliday };