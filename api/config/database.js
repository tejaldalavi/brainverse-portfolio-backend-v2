const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "193.203.184.105",
    user: "u751920449_sample_portal",
    password: "8j:UeTfbTfHK",
    database: "u751920449_sample_portal",
});

module.exports = pool;