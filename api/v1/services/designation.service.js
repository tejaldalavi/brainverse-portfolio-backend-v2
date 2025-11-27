const pool = require('../../config/database');
const { getCurrentDate } = require('../utils');
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createDesignation = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, departmentId } = request.body;

        if (!name || !departmentId) {
            return 'please fill all field';
        }
        try {
            const SQL = `INSERT INTO designation (name,departmentId,createdAt,updatedAt) values("${name}","${departmentId}","${createdAt}","${updatedAt}");`;
            const createResult = await pool.query(SQL);
            const getQuery = `SELECT * FROM designation WHERE id=${createResult[0].insertId}`
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
const updateDesignation = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {

        const { name, departmentId, id } = request.body;

        const updatedAt = getCurrentDate();
        try {
            const SQL = `UPDATE designation SET name ="${name}" ,departmentId="${departmentId}", updatedAt="${updatedAt}" WHERE id = "${id}"`;

            const updateQuery = await pool.query(SQL);
            const getUpdate = `SELECT * FROM designation WHERE id=${id}`;
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
const deleteDesignation = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM designation WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return error
        }
    }
    else{
        return "Invalid token";
    }
}

const getDesignation = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
    const { page, result_size, sortByName, search, filterByDepartment } = request.query;
    const start = (page * result_size) - result_size;
    const end = result_size;

    const SQL = `SELECT ds.id, ds.name, ds.departmentId, ds.createdAt, dp.name as departmentName FROM designation ds INNER JOIN departments dp ON ds.departmentId = dp.id ${filterByDepartment ? `WHERE departmentId IN (${filterByDepartment})` : ""} ${filterByDepartment && search ? "AND" : search ? "WHERE" : ""} ${search ? `ds.name LIKE "%${search}%"` : ""} ${sortByName && sortByName == 1 ? "ORDER BY ds.name ASC" : sortByName == 0 ? "ORDER BY ds.name DESC" : "ORDER BY ds.createdAt, ds.name ASC"}  LIMIT ${start}, ${end} ;`;
    const getCount = `SELECT COUNT(ds.id) AS count, ds.name, ds.departmentId, ds.createdAt, dp.name as departmentName FROM designation ds INNER JOIN departments dp ON ds.departmentId = dp.id ${filterByDepartment ? `WHERE departmentId IN (${filterByDepartment})` : ""} ${filterByDepartment && search ? "AND" : search ? "WHERE" : ""} ${search ? `ds.name LIKE "%${search}%"` : ""} ${sortByName && sortByName == 1 ? "ORDER BY ds.name ASC" : sortByName == 0 ? "ORDER BY ds.name DESC" : "ORDER BY ds.createdAt, ds.name ASC"} ;`;
    try {
        const getEmp = `SELECT jobTitle FROM employees WHERE isActive="true"`;
        const Emp = await pool.query(getEmp);
        const result = await pool.query(SQL);
      
       
       
        const finalResult = result[0].map((des) => {
            const count = Emp[0].filter((e) => {
              return des.id == e.jobTitle; 
            });
            return { ...des, number_of_employee: count.length };
          });

        const count = await pool.query(getCount);

        return {
            result: finalResult,
            count: count[0][0]["count"],
        };
    } catch (error) {
        return error
    }
    }
    else{
        return "Invalid token";
    }
}
const getSelectDesignation = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
    try {
        const SQL = `SELECT id as value, name as label FROM designation ORDER BY name ASC`;
        const result = await pool.query(SQL);
        return result[0];
    } catch (error) {
        return JSON.stringify(error);
    }
}
else{
    return "Invalid token";
}
}
module.exports = { getSelectDesignation, createDesignation, updateDesignation, deleteDesignation, getDesignation };