const pool = require('../../config/database');
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const { getCurrentDate } = require("../../v1/utils")
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();

const createClients = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { name, companyName, email, phone, gstNumber, logo, clientSource, country, state, district, city, address, billingAddress, clientDocuments, clientContacts } = request.body;
        if (!name || !companyName || !email || !phone || !gstNumber || !logo || !clientSource || !country || !state || !district || !city || !address || !billingAddress) {
            return "All field required"
        }
        try {
            const SQL = `INSERT INTO  clients (name,companyName,email,phone,gstNumber,logo,clientSource,country,state,district,city,address,billingAddress,createdAt,updatedAt)
        values("${name}","${companyName}","${email}","${phone}","${gstNumber}","${logo}","${clientSource}","${country}","${state}","${district}","${city}","${address}","${billingAddress}","${createdAt}","${updatedAt}");`;
            const createResult = await pool.query(SQL);
            clientDocuments.map(async (e) => {
                const insertDocument = `INSERT INTO clientDocuments (clientId,documentLink,documentName,description,createdAt,updatedAt)
            values ("${createResult[0].insertId}","${e.documentLink}","${e.documentName}","${e.description}","${createdAt}","${updatedAt}");`;
                await pool.query(insertDocument);
            })
            clientContacts.map(async (e) => {
                const insertContact = `INSERT INTO clientContacts (clientId,name,email,phone,designation,createdAt,updatedAt) 
            values("${createResult[0].insertId}","${e.name}","${e.email}","${e.phone}","${e.designation}","${createdAt}","${updatedAt}");`
                await pool.query(insertContact);
            })
            const insertId = createResult[0].insertId;
            const getResult = `SELECT * FROM clients WHERE id=${insertId}`;
            const Contacts = `SELECT * FROM clientContacts WHERE clientId=${insertId} `;
            const Documents = `SELECT * FROM clientDocuments WHERE clientId=${insertId}`;

            const result = await pool.query(getResult);
            const getContact = await pool.query(Contacts);
            const getDocuments = await pool.query(Documents);
            return {
                ...result[0][0],
                clientContacts: getContact[0],
                clientDocuments: getDocuments[0]
            };
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }

}

const getClients = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { result_size, page, sortByName, search } = request.query;
        const start = (page * result_size) - result_size;
        const end = result_size;
        const SQL = `SELECT id,name,companyName,email,phone,gstNumber,logo  FROM clients ${search ? `WHERE name LIKE "%${search}%"` : ""} ORDER BY  ${sortByName == 1 ? "name ASC" : sortByName == 0 ? " name DESC" : " createdAt DESC"} LIMIT ${start}, ${end} ;`;

        const getCount = `SELECT COUNT(*) AS total FROM clients ${search && search != 'null' ? `WHERE name LIKE "%${search}%"` : ""} ${sortByName && sortByName == 1 ? "ORDER BY name ASC" : sortByName == 0 ? "ORDER BY name DESC" : "ORDER BY createdAt"};`;
        try {
            const result = await pool.query(SQL)
            const ans = result[0]

            const finalData = await Promise.all(result[0].map(async (e) => {
                const SQL = `SELECT SUM (inp.ratePerUnit * inp.quantity) AS total, COUNT(inp.id) AS count  FROM  inhouseProjectModules inp LEFT JOIN projects p ON inp.projectId = p.id   WHERE p.clientId = ${e.id} AND inp.status = 2 AND inp.status<>3`;
                const data = await pool.query(SQL);
                const SQLprogress = `SELECT SUM (inp.ratePerUnit * inp.quantity) AS total, COUNT(inp.id) AS count  FROM inhouseProjectModules inp LEFT JOIN projects p ON inp.projectId = p.id   WHERE p.clientId = ${e.id} AND inp.status <> 2 AND inp.status<>3`;
                const dataProgress = await pool.query(SQLprogress);
                return {
                    ...e,
                    completedSales: data[0][0]["total"],
                    completedProjects: data[0][0]["count"],
                    inProgressSales: dataProgress[0][0]["total"],
                    inProgressProjects: dataProgress[0][0]["count"]
                };
            }));


            const count = await pool.query(getCount);
            return {
                client: finalData,
                count: count[0][0].total
            };
        } catch (error) {

            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const deleteClients = async (request) => {
    const { authorization } = request.headers;
const {id} =request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {

        const deleteClient = `DELETE FROM clients WHERE id="${id}";`;
        const deleteDocument = `DELETE FROM clientDocuments where clientId="${id}";`;
        const deleteAllowance = `DELETE FROM clientContacts where clientId="${id}";`;

        try {
            await pool.query(deleteClient);
            await pool.query(deleteDocument);
            await pool.query(deleteAllowance);
            return `id: ${id} Deleted Successfully`
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateClients = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
    const { id, name, companyName, email, phone, gstNumber, logo, clientSource, country, state, district, city, address, billingAddress, clientDocuments, clientContacts, deletedContacts, deletedDocuments } = request.body;
    try {

        const SQL = `UPDATE clients SET name ="${name}" , companyName = "${companyName}",email="${email}",phone="${phone}",gstNumber="${gstNumber}",logo="${logo}",clientSource="${clientSource}",country="${country}",state="${state}",district="${district}",billingAddress="${billingAddress}",address="${address}",city="${city}",updatedAt="${updatedAt}" WHERE id=${id}`;
        const updateQuery = await pool.query(SQL);
        const getUpdate = `SELECT * FROM clients WHERE id=${id}`;
        const result = await pool.query(getUpdate);

        //Delete Document 
        deletedDocuments.map(async (e) => {
            const isDeleted = `DELETE FROM clientDocuments WHERE id=${e}`;
            await pool.query(isDeleted);
        })
        clientDocuments.map(async (e) => {

            if (e.id) {
                const updateDocs = `UPDATE clientDocuments SET documentLink="${e.documentLink}",documentName="${e.documentName}",description="${e.description}",updatedAt="${updatedAt}"WHERE id="${e.id}";`
                await pool.query(updateDocs);
            }
            else {
                const insertDocument = `INSERT INTO clientDocuments (clientId,documentLink,documentName,description,createdAt,updatedAt)
            values ("${id}","${e.documentLink}","${e.documentName}","${e.description}","${createdAt}","${updatedAt}");`;
                await pool.query(insertDocument);
            }
        })

        //Delete Contacts
        deletedContacts.map(async (e) => {
            const isDeleted = `DELETE FROM clientContacts WHERE id=${e}`;
            await pool.query(isDeleted);
        })
        clientContacts.map(async (e) => {

            if (e.id == undefined) {
                const insertContact = `INSERT INTO clientContacts (clientId,name,email,phone,designation,createdAt,updatedAt) 
            values("${id}","${e.name}","${e.email}","${e.phone}","${e.designation}","${createdAt}","${updatedAt}");`
                await pool.query(insertContact);
            }
            else {
                const updateContact = `UPDATE clientContacts SET name="${e.name}",email="${e.email}",phone="${e.phone}",designation="${e.designation}", updatedAt="${updatedAt}" WHERE id="${e.id}";`;
                await pool.query(updateContact);
            }
        })
        const getContact = `SELECT * FROM clientContacts WHERE clientId=${id}`;
        const getDocs = `SELECT * FROM clientDocuments WHERE clientId=${id}`;
        const Contact = await pool.query(getContact);
        const Document = await pool.query(getDocs);

        return {
            ...result[0][0],
            clientContacts: Contact[0],
            clientDocuments: Document[0]
        }

    } catch (error) {
        return JSON.stringify(error);
    }
}
else{
    return "Invalid token";
}
}

const getClientById = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    const {id}=request.params;
    if (isVerified) {
    const SQL = `SELECT * FROM clients WHERE id=${id}`;
    try {
        const clientData = await pool.query(SQL);
        const getDocuments = `SELECT * FROM clientDocuments WHERE clientId=${id}`;
        const getContact = `SELECT * FROM clientContacts WHERE clientId=${id}`;

        const clientDocument = await pool.query(getDocuments);
        const clientContact = await pool.query(getContact);
        return {
            ...clientData[0][0],
            clientDocuments: clientDocument[0],
            clientContacts: clientContact[0]
        }
    } catch (error) {
        return JSON.stringify(error);
    }
}
else{
    return "Invalid token";
}
}

const getSelectClient = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
    try {
        const SQL = `SELECT id as value,name as label FROM clients ORDER BY name `;
        const result = await pool.query(SQL);
        return result[0];
    }
    catch (error) { return JSON.stringify(error); }
}
else{
    return "Invalid token";
}
}

module.exports = { createClients, getClients, deleteClients, updateClients, getClientById, getSelectClient };