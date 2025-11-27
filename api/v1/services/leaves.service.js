const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const JWT_SECRET = "ecorner";
const JWT = require("jsonwebtoken");
const createLeave = async(request) => {
    const { empId, subject, description, startDate, endDate } = request.body;
    const { authorization } = request.headers;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            if (!empId || !subject || !description || !startDate || !endDate) {
                return "All field Required";
            }
            const SQL = `INSERT INTO leaves (empId, subject, description, startDate, endDate, status, approvedBy, createdAt, updatedAt)
            VALUES (${empId}, "${subject}", "${description}", "${startDate}", "${endDate}", 0, "any", "${createdAt}", "${updatedAt}")`;
            const getResult = await pool.query(SQL);
            const getLeaves = `SELECT * FROM leaves WHERE id=${getResult[0].insertId}`;
            const result = await pool.query(getLeaves);
            return result[0];
        } else {
            return "Invalid Token";
        }
    } catch (error) {
        return "Invalid Token";
    }
}

const updateLeave = async(request) => {
    const { id } = request.params;
    const { authorization } = request.headers;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = 'UPDATE leaves SET ? WHERE id = ?';
            await pool.query(SQL, [request.body, id]);
            const getResult = `SELECT * FROM leaves WHERE id=${id}`;
            const result = await pool.query(getResult, request.body);
          
            return result[0];
        } else {
            return "Invailid Token"
        }
    } catch (error) {
        return error.message;
    }
}

const getAllLeave = async(request) => {
        const { authorization } = request.headers;
        const { page, result_size, search, startDate, endDate } = request.query;
        const pageStart = (page * result_size) - result_size;
        const pageEnd = result_size;
       
        try {
            const isVerified = JWT.verify(authorization, JWT_SECRET);
            if (isVerified) {
                const SQL = `SELECT l.id,l.empId,l.subject,l.description,l.startDate,l.endDate,l.status,l.approvedBy,l.createdAt,l.updatedAt,l.remark,CONCAT(emp.fName," ",emp.lName) AS name FROM leaves l LEFT JOIN employees emp ON l.empId=emp.id WHERE ((DATE(l.startDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}"))
                OR (DATE(l.endDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}")))
                ${search ? `AND (l.subject LIKE "%${search}%" OR l.description LIKE "%${search}%" OR l.status LIKE "%${search}%" OR l.approvedBy LIKE "%${search}%")` : ""}
                LIMIT ${pageStart}, ${pageEnd}`;
                const result = await pool.query(SQL);
             
                const getCount=`SELECT COUNT(*) FROM leaves WHERE ((DATE(startDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}"))
                 OR (DATE(endDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}")))
                 ${search ? `AND (subject LIKE "%${search}%" OR description LIKE "%${search}%" OR status LIKE "%${search}%" OR approvedBy LIKE "%${search}%")` : ""}` 
                const count=await pool.query(getCount);

                 return {data:result[0],count:count[0][0]["COUNT(*)"]};
        } else {
            return "Invalid token ";
        }
    } catch (error) {
        return error.message;
    }
}
const getLeaveByEmpId = async(request) => {
    const { authorization } = request.headers;
    const { empId , startDate, endDate} = request.params
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = `SELECT * FROM leaves WHERE ((DATE(startDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}"))
            OR (DATE(endDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}"))) AND empId=${empId}`;
            const result = await pool.query(SQL);

            const getCount=`SELECT COUNT(*) FROM leaves WHERE ((DATE(startDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}"))
                 OR (DATE(endDate) BETWEEN DATE("${startDate}") AND DATE("${endDate}")))
                 `
                const count=await pool.query(getCount);

            return {data:result[0],count:count[0][0]["COUNT(*)"]};
        } else {
            return "Invalid token ";
        }
    } catch (error) {
        return error.message; 
    }
}
module.exports = { getAllLeave, createLeave, updateLeave, getLeaveByEmpId };