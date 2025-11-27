import { createPool } from "mysql2/promise";
const pool = createPool({
    host: "193.203.184.105",
    user: "u751920449_sample_portal",
    password: "8j:UeTfbTfHK",
    database: "u751920449_sample_portal",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log("MySQL Connected Successfully");

export default pool;


