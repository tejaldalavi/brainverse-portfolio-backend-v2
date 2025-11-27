const mysql = require("mysql2/promise");
const pool = mysql.createPool({
    host: "ec-admin-panel.cmhf16rklpnh.eu-north-1.rds.amazonaws.com",
    user: "ecadmin",
    password: "EcAdminDB321",
    database: "ecAdminPanel",
});

module.exports = pool;