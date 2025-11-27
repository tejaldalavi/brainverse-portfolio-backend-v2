const pool = require('../../config/database');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const { getCurrentDate } = require("../../v1/utils")
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createOvertime = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, rateType } = request.body;
        if (!name || !rateType) {
            return "All field required";
        }
        try {
            const SQL = `INSERT INTO overtime (id,name,rateType,createdAt,updatedAt) values(null,"${name}","${rateType}","${createdAt}","${updatedAt}")`

            const createResult = await pool.query(SQL);
            const getQuery = `SELECT * FROM overtime WHERE id=${createResult[0].insertId}`
            const result = await pool.query(getQuery);
            return result[0];
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    else {
        return "Invalid qtoken";
    }
}
const getOvertime = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { page, result_size, sortByName, search } = request.query;

        const start = (page * result_size) - result_size;
        const end = result_size;

        const SQL = `SELECT * FROM overtime ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt DESC, name ASC"} LIMIT ${start}, ${end} ;`;
        const getCount = `SELECT COUNT (*) AS count FROM overtime ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName == '1' ? "ORDER BY name ASC" : sortByName == '0' ? "ORDER BY name DESC" : "ORDER BY createdAt, name ASC"};`;
        try {
            const result = await pool.query(SQL);
            const count = await pool.query(getCount);

            return {
                result: result[0],
                count: count[0][0]["count"],
            };
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}
const deleteOverTime = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM overtime WHERE id="${id}";`;
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
const updateOvertime = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, rateType, id } = request.body;
        const updatedAt = getCurrentDate();
        try {
            const SQL = `UPDATE overtime SET name ="${name}",rateType="${rateType}" ,updatedAt="${updatedAt}" WHERE id = ${id}`;

            const updateQuery = await pool.query(SQL);
            const getUpdate = `SELECT * FROM overtime WHERE id=${id}`;
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
const getSelectOvertime = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = "SELECT id as value,name as label FROM overtime ORDER BY name ASC";
            const result = await pool.query(SQL);
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
module.exports = { getSelectOvertime, createOvertime, getOvertime, deleteOverTime, updateOvertime }