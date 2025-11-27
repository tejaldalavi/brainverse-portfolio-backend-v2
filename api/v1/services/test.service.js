const pool = require('../../config/database');
const bcrypt = require('bcrypt')
const express = require('express');

const app = express();

const Test = async(request, response) => {
    const SQL = `
 DELETE FROM employeeDocuments 
 `;
    pool.query(SQL).then((res) => {
        response.json({ data: res[0] }).status(200);
    }).catch((err) => {
        response.json({ message: err })
    })


}

module.exports = Test