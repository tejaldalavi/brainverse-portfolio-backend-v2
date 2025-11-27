const pool = require('../../config/database');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const { getCurrentDate } = require('../utils');
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createDeduction = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name } = request.body;

        if (!name) {
            return "All field required";
        }
        try {
            const SQL = `INSERT INTO deductions (name,createdAt,updatedAt) values("${name}","${createdAt}","${updatedAt}")`
            const createResult = await pool.query(SQL);
            const getQuery = `SELECT * FROM deductions WHERE id=${createResult[0].insertId}`
            const result = await pool.query(getQuery);
            return result[0];
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateDeduction = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, id } = request.body;
        try {
            const SQL = `UPDATE deductions SET name ="${name}" ,updatedAt="${updatedAt}" WHERE id =${id}`;
            const updateQuery = await pool.query(SQL);
            const getUpdate = `SELECT * FROM deductions WHERE id=${id}`;
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

const deleteDeduction = async (request) => {

    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM deductions WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getallDeduction = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { page, result_size, sortByName, search } = request.query;

        const start = (page * result_size) - result_size;
        const end = result_size;
        const SQL = `SELECT * FROM deductions ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt DESC"} LIMIT ${start}, ${end} ;`;

        const getCount = `SELECT COUNT(*) AS total FROM deductions ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt, name ASC"} ;`;
        try {
            const result = await pool.query(SQL);
            const count = await pool.query(getCount);
            return {
                result: result[0],
                count: count[0][0]?.total
            };
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "invailid token";
    }
}

const getSelectDeduction = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = "SELECT id as value,name as label FROM deductions ORDER BY name ASC";
            const result = await pool.query(SQL);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invailid token";
    }
}
module.exports = { getSelectDeduction, createDeduction, updateDeduction, deleteDeduction, getallDeduction }