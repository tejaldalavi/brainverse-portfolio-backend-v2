const pool = require("../../config/database");
const { getCurrentDate } = require("../utils");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createAllowances = async (request) => {
  //   const { name, category } = request.body;
  //   const { authorization } = request.headers;
  //   const isVerified = JWT.verify(authorization, JWT_SECRET);
  //   if (isVerified) {
  //     if (!name || !category) {
  //       return "All fields are required";
  //     }
  //     try {
  //       const SQL = `INSERT INTO  allowances (name,category,createdAt,updatedAt) values("${name}","${category}","${createAt}","${updatedAt}");`;
  //       const createResult = await pool.query(SQL);

  //       const getSQL = `SELECT * FROM allowances WHERE id=${createResult[0].insertId}`;
  //       const result = await pool.query(getSQL);
  //       return result[0];
  //     } catch (error) {
  //       return JSON.stringify(error);
  //     }
  //   } else {
  //     return "Invalid token";
  //   }
  return "createAllowances returned successffully";
};

module.exports = { createAllowances };
