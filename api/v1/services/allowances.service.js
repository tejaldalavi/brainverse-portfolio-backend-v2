const pool = require('../../config/database');
const { getCurrentDate } = require('../utils');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createAllowances = async (request) => {
    const { name, category } = request.body;
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        if (!name || !category) {
            return "All fields are required";
        }
        try {
            const SQL = `INSERT INTO  allowances (name,category,createdAt,updatedAt) values("${name}","${category}","${createAt}","${updatedAt}");`;
            const createResult = await pool.query(SQL);

            const getSQL = `SELECT * FROM allowances WHERE id=${createResult[0].insertId}`;
            const result = await pool.query(getSQL);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getAllowances = async (request) => {

    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { page, result_size, sortByName, search, filterByCategory } = request.query;

        const start = (page * result_size) - result_size;
        const end = result_size;
        const SQL = `SELECT * FROM allowances ${search ? `WHERE name LIKE "%${search}%"  ` : ""} ${filterByCategory ? `WHERE category LIKE "${filterByCategory}"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt DESC, name ASC"} LIMIT ${start}, ${end} ;`;
        const getCount = `SELECT COUNT(*) AS total FROM allowances ${search ? `WHERE name LIKE "%${search}%"` : ""} ${filterByCategory ? `WHERE category LIKE "${filterByCategory}"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt, name ASC"} ;`;


        try {
            const result = await pool.query(SQL)
            const count = await pool.query(getCount);
            return {
                result: result[0],
                count: count[0][0]?.total
            }
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token"
    }
}

const deleteAllowances = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM allowances WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invailid token";
    }
}

const updateAllowances = async (request) => {

    const { authorization } = request.headers;
    const { name, category,id } = request.body; 
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `UPDATE allowances SET name ="${name}" , category = "${category}",updatedAt="${updatedAt}" WHERE id = ${id}`;
            const updateResult = await pool.query(SQL);
            const getUpdate = `SELECT * FROM allowances WHERE id=${id}`;
            const result = await pool.query(getUpdate);
            return result[0];
        }
        catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getSelectAllowance = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `SELECT id as value, name as label FROM allowances ORDER BY name ASC`;
        try {
            const result = await pool.query(SQL);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}
module.exports = { getSelectAllowance, createAllowances, getAllowances, deleteAllowances, updateAllowances };