const pool = require("../../config/database");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const getCities = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { countryCode, stateCode } = request.params;
        try {
            const SQL = `SELECT id as value, name as label FROM cities WHERE countryCode="${countryCode}" AND stateCode="${stateCode}" ORDER BY name ASC`;
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
const getStates = async (request) => {
    const {countryCode}=request.params;
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
    try {
        const SQL = `SELECT stateCode as value, name as label FROM states WHERE countryCode="${countryCode}" ORDER BY name ASC`;
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
module.exports = { getCities, getStates }