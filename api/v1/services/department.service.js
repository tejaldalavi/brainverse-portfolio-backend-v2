const pool = require('../../config/database');
const { getCurrentDate } = require('../utils');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createDepartments = async (request) => {
    const { name, number_of_employee } = request.body;
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        if (!name || !number_of_employee) {
            return 'please fill all field';
        } else {
            try {
                const SQL = `INSERT INTO departments (name,number_of_employee,createdAt, updatedAt) values("${name}","${number_of_employee}","${createdAt}","${updatedAt}");`;
                const createResult = await pool.query(SQL)
                const getSQL = `SELECT * FROM departments WHERE id = ${createResult[0].insertId};`;
                const result = await pool.query(getSQL)
                return result[0];
            } catch (error) {
                return JSON.stringify(error);
            }
        }
    }
    else {
        return "Invalid token";
    }
}

const getDepartments = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { page, result_size, sortByName, search } = request.query;
        const start = (page * result_size) - result_size;
        const end = result_size;
        const SQL = `SELECT * FROM departments ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName && sortByName == 1 ? "ORDER BY name ASC,createdAt DESC" : sortByName == 0 ? "ORDER BY name DESC,createdAt DESC" : "ORDER BY createdAt DESC, name ASC"}  LIMIT ${start}, ${end} ;`;
        const getCount = `SELECT COUNT(*) AS total FROM departments ${search ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName && sortByName == 1 ? "ORDER BY name ASC" : sortByName == 0 ? "ORDER BY name DESC" : "ORDER BY createdAt DESC, name ASC"}  ;`
        //    const getNOE=`SELECT jobTitle FROM employees`;
        try {
            const NumberOfEmployee = `SELECT id,departmentId FROM designation`;
            const depId = await pool.query(NumberOfEmployee);
            const getEmp = `SELECT jobTitle FROM employees WHERE isActive="true"`;
            const emp = await pool.query(getEmp);
            const result = await pool.query(SQL);
            const count = await pool.query(getCount);
            const response = result[0].map((e) => {
                const getDesById = depId[0].filter((event) => e.id == event.departmentId);
                // const jobTitle=emp[0].filter((em,i)=>em.jobTitle==getEmpCount)
                let count = 0;

                getDesById.map((des) => {
                    emp[0].map((em) => {
                        if (des.id == em.jobTitle) {
                            count++;

                        }
                    })
                })
                return { id: e.id, name: e.name, createdAt: e.createdAt, number_of_employee: count, updatedAt: e.updatedAt }
            })

            return {
                data: response,
                count: count[0][0]?.total,
            }
        } catch (error) {
            return error
        }
    }
    else {
        return "Invalid token";
    }
}

const getSelectDepartments = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `SELECT id as value, name as label FROM departments ORDER BY name ASC`;
        try {
            const result = await pool.query(SQL);
            return result[0];
        } catch (error) {
            return error
        }
    }
    else {
        return "Invalid token";
    }
}

const updateDepartments = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, name, number_of_employee } = request.body;

        const updatedAt = getCurrentDate();
        const SQL = `UPDATE departments SET name ="${name}", number_of_employee="${number_of_employee}", updatedAt="${updatedAt}" WHERE id = "${id}"`;
        try {
            await pool.query(SQL);
            const getSQL = `SELECT * FROM departments WHERE id = ${id};`;
            const result = await pool.query(getSQL)
            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const deleteDepartments = async (request) => {
    const { authorization } = request.headers;
    const {id}=request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM departments WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return error
        }
    }
    else {
        return "Invalid token";
    }
}

module.exports = { createDepartments, getDepartments, getSelectDepartments, updateDepartments, deleteDepartments };