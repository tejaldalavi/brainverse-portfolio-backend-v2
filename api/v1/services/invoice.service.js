const pool = require('../../config/database');
const { getCurrentDate } = require("../utils")
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const createInvoices = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const { id, name, invoiceTypeId, projectName, clientId, issuedDate, invoiceAmount, dueDate, projectId, subTotal, sgst, cgst, tds, igst, total, paymentStatus, gstStatus, partailRecieved, resourceOutsource, inhouseProjectModules, customInvoiceItems, invoiceStatus } = request.body;

            if (invoiceTypeId == 1) {

                const SQL = `INSERT INTO invoices (id, invoiceTypeId, issuedDate, dueDate, projectId, subTotal, sgst, cgst, tds, igst, total,invoiceAmount, paymentStatus, gstStatus,invoiceStatus ,partailRecieved,createdAt,updatedAt) 
            VALUES ("${id}","${invoiceTypeId}","${issuedDate}","${dueDate}","${projectId}","${subTotal}","${sgst}","${cgst}","${tds}","${igst}","${total}","${invoiceAmount}","1","${gstStatus}","1","${partailRecieved}","${createdAt}","${updatedAt}")`;

                const invoice = await pool.query(SQL);


                inhouseProjectModules.length > 0 ? inhouseProjectModules.map(async (e) => {
                    const value = Number(e.invoicedPerc) + Number(e.currentInvoicedPerc)
                    const projectModule = `UPDATE inhouseProjectModules SET invoicedPerc="${value}",updatedAt="${updatedAt}" WHERE id="${e.id}" `
                    await pool.query(projectModule)
                }) : ""

                inhouseProjectModules.length > 0 ? inhouseProjectModules.map(async (e) => {
                    const value = Number(e.quantity) * Number(e.ratePerUnit);
                    const insertQuery = `INSERT INTO projectInvoiceItem (invoiceId,projectId,description,total,ratePerUnit, invoicedPerc,quantity,discount,createdAt,updatedAt)
               VALUES ("${id}","${projectId}","${projectName} | ${e.moduleName}","${value}","${e.ratePerUnit}","${e.currentInvoicedPerc}" ,"${e.quantity}","${e.discount}","${createdAt}","${updatedAt}")
               `
                    await pool.query(insertQuery)
                }) : ""

                resourceOutsource.length > 0 ? resourceOutsource.map(async (e) => {
                    const value = Number(e.totalDays) * Number(e.clientCost);
                    const insertQuery = `INSERT INTO projectInvoiceItem (invoiceId,projectId,description,total,ratePerUnit,invoicedPerc,quantity,discount,createdAt,updatedAt)
               VALUES (${id},"${projectId}","${projectName} | ${e.resourceName}","${value}","${e.clientCost}","${e.currentInvoicedPerc}","${e.totalDays}","${e.discount}","${createdAt}","${updatedAt}")
               `
                    await pool.query(insertQuery)
                }) : ""

                resourceOutsource.length != 0 ? resourceOutsource.map(async (e) => {
                    const value = Number(e.invoicedPerc) + Number(e.currentInvoicedPerc)

                    const SQL = `UPDATE resourceOutsource SET invoicedPerc="${value}",updatedAt="${updatedAt}" WHERE id="${e.id}"`;
                    await pool.query(SQL);
                }) : ""
                const getInvoice = `SELECT * FROM invoices WHERE id=${id}`;
                const result = await pool.query(getInvoice);

                const getProjectModule = `SELECT * FROM inhouseProjectModules `;
                const getOutsource = `SELECT * FROM resourceOutsource `;


                const projectModule = await pool.query(getProjectModule);
                const outSource = await pool.query(getOutsource);

                return {
                    ...result[0][0]
                }
            }
            else if (invoiceTypeId == 2) {

                const customProject = `INSERT INTO customInvoiceProjects ( name, createdAt, updatedAt)
                       VALUES ( "${name}", "${createdAt}", "${updatedAt}")`;
                await pool.query(customProject);

                const SQL = `INSERT INTO invoices (id,clientId,customProjectName, invoiceTypeId, issuedDate, dueDate, projectId, subTotal, sgst, cgst, tds, igst, total, paymentStatus, gstStatus, invoiceStatus, partailRecieved,createdAt,updatedAt) 
                       VALUES ("${id}","${clientId}","${name}","${invoiceTypeId}","${issuedDate}","${dueDate}","${projectId}","${subTotal}","${sgst}","${cgst}","${tds}","${igst}","${total}","1","${gstStatus}","1","${partailRecieved}","${createdAt}","${updatedAt}")`
                const invoice = await pool.query(SQL);

                customInvoiceItems.map(async (e) => {
                    const total = Number(e.quantity) * Number(e.ratePerUnit)
                    const customInvoice = `INSERT INTO  customInvoiceItems (description,quantity,ratePerUnit,total,discount,invoicedPerc,invoiceId,customeInvoiceProjectId,createdAt,updatedAt) 
            VALUES ("${e.description}","${e.quantity}","${e.ratePerUnit}","${total}","${e.discount}","${e.invoicedPerc}","${invoice[0].insertId}","${id}","${createdAt}","${updatedAt}")`;

                    await pool.query(customInvoice);
                })

                const getCustomInvoice = `SELECT * FROM customInvoiceProjects WHERE id=${id}`;
                const result = await pool.query(getCustomInvoice);
                const invoiceItems = `SELECT * FROM customInvoiceItems WHERE customeInvoiceProjectId=${id}`
                const getItems = await pool.query(invoiceItems)


                const getInvoice = `SELECT * FROM invoices WHERE id=${id}`;
                const invoiceResult = await pool.query(getInvoice);
                return {
                    ...invoiceResult[0][0],
                    customInvoiceProjects: result[0],
                    customInvoiceItems: getItems[0]
                }
            }

        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid Token";
    }
}

const getInvoiceById = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `SELECT * FROM  invoices WHERE id=${id}`;
            const result = await pool.query(SQL);
            const project = `SELECT name FROM projects WHERE id=${result[0][0].projectId}`;

            const projectName = await pool.query(project);

            const invoiceTypeId = result[0][0]["invoiceTypeId"]
            if (invoiceTypeId == 1) {
                const moduleQuery = `SELECT * FROM projectInvoiceItem WHERE invoiceId=${id} `;

                const resourceData = await pool.query(moduleQuery);

                const projectId = result[0][0]['projectId'];
                const getClient = `SELECT c.name AS clientName,c.address,c.billingAddress,c.country,c.email,c.phone,c.gstNumber FROM clients c LEFT JOIN projects p ON c.id=p.clientId WHERE p.id=${projectId} `;
                const client = await pool.query(getClient);

                return {

                    ...result[0][0], ...client[0][0],
                    projectName: projectName[0][0]["name"],

                    projectInvoiceItem: resourceData[0]
                }
            }
            else if (invoiceTypeId == 2) {
                const customInvoice = `SELECT * FROM customInvoiceItems WHERE customeInvoiceProjectId=${id}`;
                const customData = await pool.query(customInvoice);
                const clientId = result[0][0]['clientId'];
                const getClient = `SELECT clients.name AS clientName,clients.address,clients.billingAddress,clients.country,clients.email,clients.phone,clients.gstNumber FROM clients WHERE id=${clientId} `;
                const client = await pool.query(getClient);

                return {
                    ...result[0][0],
                    ...client[0][0],
                    customInvoiceItems: customData[0]
                }
            }

        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getInvoices = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { filterByStatus, filterByPaymentStatus, sortBy, page, result_size, invoiceId } = request.query;

        try {
            const start = (page * result_size) - result_size;
            const end = result_size;

            const SQL = `
        SELECT invoices.id,invoices.customProjectName, invoices.invoiceTypeId, invoices.issuedDate, 
        invoices.dueDate, invoices.projectId, invoices.subTotal, invoices.sgst, invoices.cgst, invoices.igst,
         invoices.tds, invoices.paymentStatus, invoices.gstStatus, invoices.partailRecieved, invoices.total, 
         invoices.createdAt, invoices.updatedAt, invoices.invoiceStatus, invoices.invoiceAmount, projects.name AS projectName, 
         clients.name AS clientName, cls.name AS customClientName
        FROM invoices
        LEFT JOIN projects ON projects.id = invoices.projectId
        LEFT JOIN clients ON projects.clientId = clients.id 
        LEFT JOIN clients AS cls ON cls.id=invoices.clientId
        ${filterByPaymentStatus ? `WHERE invoices.paymentStatus LIKE '%${filterByPaymentStatus}%'` : ''}
        ${invoiceId ? `${filterByPaymentStatus ? 'AND' : 'WHERE'} invoices.id = '${invoiceId}'` : ''}
        ${filterByStatus ? `${filterByPaymentStatus || invoiceId ? 'AND' : 'WHERE'} invoices.invoiceStatus LIKE '%${filterByStatus}%'` : ''}
        ORDER BY
          ${sortBy == 1 ? 'invoices.issuedDate ASC' : sortBy == 2 ? 'invoices.issuedDate DESC' : sortBy == 3 ? 'invoices.dueDate ASC' : sortBy == 4 ? 'invoices.dueDate DESC' : 'invoices.createdAt DESC,invoices.id DESC'}
        LIMIT ${start}, ${end}`;

            const result = await pool.query(SQL);

            const getCount = `   SELECT invoices.id, invoices.invoiceTypeId, invoices.issuedDate, invoices.dueDate, invoices.projectId, invoices.subTotal, invoices.sgst, invoices.cgst, invoices.igst, invoices.tds, invoices.paymentStatus, invoices.gstStatus, invoices.partailRecieved, invoices.total, invoices.createdAt, invoices.updatedAt, invoices.invoiceStatus, invoices.invoiceAmount, projects.name AS projectName, clients.name AS clientName
      FROM invoices
      LEFT JOIN projects ON projects.id = invoices.projectId
      LEFT JOIN clients ON projects.clientId = clients.id
      ${filterByPaymentStatus ? `WHERE invoices.paymentStatus LIKE '%${filterByPaymentStatus}%'` : ''}
      ${invoiceId ? `${filterByPaymentStatus ? 'AND' : 'WHERE'} invoices.id = '${invoiceId}'` : ''}
      ${filterByStatus ? `${filterByPaymentStatus || invoiceId ? 'AND' : 'WHERE'} invoices.invoiceStatus LIKE '%${filterByStatus}%'` : ''}
      ORDER BY
        ${sortBy == 1 ? 'invoices.issuedDate ASC' : sortBy == 2 ? 'invoices.issuedDate DESC' : sortBy == 3 ? 'invoices.dueDate ASC' : sortBy == 4 ? 'invoices.dueDate DESC' : 'invoices.createdAt DESC'}
    `

            const count = await pool.query(getCount);
            return { data: result[0], count: count[0].length }
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateInvoice = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {

            const id = request.body.id;
            const SQL = `UPDATE invoices SET ? WHERE id=${id}`;
            const getId = await pool.query(SQL, request.body);
            const getUpdate = `SELECT * FROM invoices WHERE id=${id}`;
            const result = await pool.query(getUpdate);

            return result[0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const cencelInvoice = async (request) => {
    const { authorization } = request.headers;
    const {id}= request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `UPDATE invoices SET invoiceStatus=0 WHERE id =${id}`;
            await pool.query(SQL);

            return `id: ${id} Cancelled Successfully`
        } catch (error) {
            return `Error ${error}`;
        }
    }
    else { return "Invalid token"; }
}
module.exports = { createInvoices, getInvoiceById, getInvoices, updateInvoice, cencelInvoice }