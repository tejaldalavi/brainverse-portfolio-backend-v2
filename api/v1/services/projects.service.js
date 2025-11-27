const pool = require("../../config/database");
const moment = require('moment');
const { getCurrentDate } = require("../utils");
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const todayDate = getCurrentDate();
const JWT_SECRET = "ecorner";
const JWT = require("jsonwebtoken");

const createProjects = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const { name, clientId, projectTypeId, clientCost, resourceCost, igst, sgst, tds, cgst, profit } = request.body;

            const SQL = `INSERT INTO  projects (name,clientId,projectTypeId,clientCost,resourceCost,tds,sgst,cgst,igst,profit,invoiceStatus,createdAt,updatedAt)
        values("${name}","${clientId}","${projectTypeId}","${clientCost}","${resourceCost}","${tds}","${sgst}","${cgst}","${igst}","${profit}","0","${createdAt}","${updatedAt}")`;
            const createResult = await pool.query(SQL);
            const getResult = `SELECT * FROM projects WHERE id=${createResult[0].insertId}`;
            const insertId = createResult[0].insertId;

            if (projectTypeId == 1) {

                const { inhouseProjectModules, inhouseProjectResource } = request.body;
                inhouseProjectModules.map(async (e) => {
                    const inhouseModule = `INSERT INTO inhouseProjectModules (moduleName,projectId,quantity,ratePerUnit,totalModulePrice,startDate,endDate,status,invoiceStatus,createdAt,updatedAt)
                 values("${e.moduleName}","${insertId}","${e.quantity}","${e.ratePerUnit}","${e.totalModulePrice}","${e.startDate}","${e.endDate}","0","0","${createdAt}","${updatedAt}")`
                    await pool.query(inhouseModule)
                })
                inhouseProjectResource.map(async (e) => {
                    const taskQuery = `INSERT INTO task (empId,projectId,name,hoursPerDay,startDate,dueDate,createdAt,updatedAt)
                VALUES ("${e.empId}","${insertId}","${name}","9","${e.startDate}","${e.endDate}","${createdAt}","${updatedAt}")`

                    const taskId = await pool.query(taskQuery)

                    const inhouseResource = `INSERT INTO inhouseProjectResource (projectId,empId,taskId,hoursPerDay,resourceCost,startDate,endDate,createdAt,updatedAt) 
                values(${insertId},"${e.empId}","${taskId[0].insertId}","${e.hoursPerDay}","${e.resourceCost}","${e.startDate}","${e.endDate}","${createdAt}","${updatedAt}")`;
                    await pool.query(inhouseResource);
                })

                const projectModule = `SELECT * FROM inhouseProjectModules WHERE projectId=${insertId}`;
                const projectResource = `SELECT * FROM inhouseProjectResource WHERE projectId=${insertId}`
                const taskQuery = `SELECT * FROM task WHERE projectId="${insertId}"`;
                const tasks = await pool.query(taskQuery);

                const result = await pool.query(getResult);
                const getModule = await pool.query(projectModule);
                const getResource = await pool.query(projectResource);

                return {
                    ...result[0][0],
                    tasks: tasks[0],
                    inhouseProjectModules: getModule[0],
                    inhouseProjectResource: getResource[0],
                }
            }
            if (projectTypeId == 2) {
                const { resourceOutsource } = request.body;
                resourceOutsource.map(async (e) => {
                    const taskQuery = `INSERT INTO task (empId,projectId,name,hoursPerDay,startDate,dueDate,createdAt,updatedAt)
                VALUES ("${e.empId}","${insertId}","${name}",9,"${e.startDate}","${e.endDate}","${createdAt}","${updatedAt}")`
                    const taskId = await pool.query(taskQuery)
                    const outsource = `INSERT INTO resourceOutsource (projectId,empId,taskId,durationType,clientCost,resourceCost,hoursPerDay,startDate,endDate,invoiceStatus,createdAt,updatedAt)
              values("${insertId}","${e.empId}", ${taskId[0].insertId},${e.durationType},"${e.clientCost}","${e.resourceCost}","${e.hoursPerDay}","${e.startDate}","${e.endDate}","0","${createdAt}","${updatedAt}")`;
                    await pool.query(outsource);

                })

                const outsource = `SELECT * FROM resourceOutsource WHERE projectId=${insertId}`;
                const result = await pool.query(getResult);
                const getOutsource = await pool.query(outsource);
                const taskQuery = `SELECT * FROM task WHERE projectId="${insertId}"`;
                const tasks = await pool.query(taskQuery);

                return {
                    ...result[0][0],
                    tasks: tasks[0],
                    resourceOutsource: getOutsource[0]
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

const updateResourceOutsource = async (resourceOutsource, insertId) => {
    try {

        resourceOutsource.map(async (e) => {
            const { id, projectId, empId, durationType, clientCost, resourceCost, hoursPerDay, startDate, endDate, invoiceStatus } = e;

            if (id) {
                const SQL = `UPDATE resourceOutsource SET empId="${empId}", durationType="${durationType}", clientCost="${clientCost}", resourceCost="${resourceCost}",  hoursPerDay="${hoursPerDay}", startDate="${startDate}", endDate="${endDate}", invoiceStatus="${invoiceStatus}",updatedAt="${updatedAt}" WHERE id="${id}";
                `;
                await pool.query(SQL);
            } else {

                const SQL = `INSERT INTO resourceOutsource (projectId, empId, durationType, clientCost, resourceCost, hoursPerDay, startDate, endDate, invoiceStatus, createdAt, updatedAt)
                VALUES ("${insertId}", "${empId}", "${durationType}", "${clientCost}", "${resourceCost}", "${hoursPerDay}", "${startDate}", "${endDate}", "${0}","${createdAt}", "${updatedAt}")`;

                await pool.query(SQL);
            }
        })
        const getResult = `SELECT * FROM resourceOutsource WHERE projectId=${insertId} `;
        const result = await pool.query(getResult);
        return result[0];
    } catch (error) {
        return JSON.stringify(error);
    }
}

const updateInhouseProjectModules = async (inhouseProjectModules, insertId) => {
    try {
        inhouseProjectModules.map(async (e) => {

            const { id, projectId, moduleName, quantity, ratePerUnit, totalModulePrice, startDate, endDate, status, invoiceStatus } = e;
            if (id) {
                const SQL = `UPDATE inhouseProjectModules SET moduleName="${moduleName}",quantity="${quantity}",ratePerUnit="${ratePerUnit}",totalModulePrice="${totalModulePrice}",startDate="${startDate}",endDate="${endDate}", status="${status}",invoiceStatus="${invoiceStatus}",updatedAt="${updatedAt}" WHERE id="${id}" `
                await pool.query(SQL)
            } else {
                const SQL = `INSERT INTO inhouseProjectModules (moduleName,projectId,quantity,ratePerUnit,totalModulePrice,startDate,endDate,status,invoiceStatus)
         values("${moduleName}","${insertId}","${quantity}","${ratePerUnit}","${totalModulePrice}","${startDate}","${endDate}","${status}","${0}")`
                await pool.query(SQL)

            }
        })
        const getResult = `SELECT * FROM inhouseProjectModules WHERE projectId=${insertId} `;
        const result = await pool.query(getResult);
        return result[0];
    } catch (error) {
        return JSON.stringify(error);
    }
}

const updateInhouseProjectResource = async (inhouseProjectResource, insertId) => {
    try {
        inhouseProjectResource.map(async (e) => {
            const { id, empId, hoursPerDay, startDate, endDate, resourceCost } = e;
            if (id) {
                const SQL = `UPDATE inhouseProjectResource SET empId="${empId}",hoursPerDay="${hoursPerDay}",resourceCost="${resourceCost}",startDate="${startDate}",endDate="${endDate}",updatedAt="${updatedAt}" WHERE id=${id}`
                await pool.query(SQL);
            } else {
                const SQL = `INSERT INTO inhouseProjectResource (projectId,empId,hoursPerDay,resourceCost,startDate,endDate,createdAt,updatedAt) 
            values(${insertId},"${empId}","${hoursPerDay}","${resourceCost}","${startDate}","${endDate}","${createdAt}","${updatedAt}")`;
                await pool.query(SQL);
            }
        })
        const getResult = `SELECT * FROM inhouseProjectResource WHERE projectId=${insertId}`;
        const result = await pool.query(getResult);
        return result[0];
    } catch (error) {
        return JSON.stringify(error);
    }
}

const updateProjects = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, name, clientId, projectTypeId, clientCost, resourceCost, igst, sgst, tds, cgst, profit, invoiceStatus } = request.body;
        const SQL = `UPDATE projects SET name="${name}",clientId="${clientId}",projectTypeId="${projectTypeId}",clientCost="${clientCost}", resourceCost="${resourceCost}", igst="${igst}", sgst="${sgst}", tds="${tds}", cgst="${cgst}", profit="${profit}", invoiceStatus="${invoiceStatus}",updatedAt="${updatedAt}" WHERE id=${id}`;

        try {
            if (projectTypeId == 2) {
                const { resourceOutsource } = request.body;

                const getResource = await updateResourceOutsource(resourceOutsource, id);
                const updateResult = await pool.query(SQL);



                const getResult = `SELECT * FROM projects WHERE id=${id}`;
                const result = await pool.query(getResult);
                return {
                    ...result[0][0],
                    resourceOutsource: getResource
                };
            }
            if (projectTypeId == 1) {
                const { inhouseProjectModules, inhouseProjectResource } = request.body;
                const projectModule = await updateInhouseProjectModules(inhouseProjectModules, id);
                const projectResource = await updateInhouseProjectResource(inhouseProjectResource, id);
                const updateResult = await pool.query(SQL);
                const getResult = `SELECT * FROM projects WHERE id=${id}`;
                const result = await pool.query(getResult);
                return {
                    ...result[0][0],
                    inhouseProjectModules: projectModule,
                    inhouseProjectResource: projectResource
                };
            }
        } catch (error) {
            return JSON.parse(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getProjects = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const currentDate = getCurrentDate();
        const { page, result_size, sortBy, search, filterByClient, filterByProjectType } = request.query;
        const start = (page * result_size) - result_size;
        const end = result_size;
        const SQL = `SELECT projects.id,projects.clientId, projects.name, clients.name as clientName, projects.projectTypeId, projects.createdAt
        FROM projects
        LEFT JOIN clients ON clients.id = projects.clientId 
        ${search ? `WHERE projects.name LIKE "%${search}%"` : ""}
        ${filterByClient ? `${search ? 'AND' : 'WHERE'} clients.id IN (${filterByClient})` : ""}
        ${filterByProjectType ? `${(search || filterByClient) ? 'AND' : 'WHERE'} projects.projectTypeId LIKE "%${filterByProjectType}%"` : ""}
        ORDER BY ${sortBy && sortBy == 1 ? "projects.name ASC" : sortBy == 2 ? "projects.name DESC" : sortBy == 3 ? "projects.createdAt ASC" : sortBy == 4 ? "projects.createdAt DESC" : "projects.createdAt DESC, projects.name ASC"}
        LIMIT ${start},${end}`;


        const getCount = `SELECT projects.id,projects.clientId, projects.name, clients.name as clientName, projects.projectTypeId, projects.createdAt
        FROM projects
        LEFT JOIN clients ON clients.id = projects.clientId 
        ${search ? `WHERE projects.name LIKE "%${search}%"` : ""}
        ${filterByClient ? `${search ? 'AND' : 'WHERE'} clients.id IN (${filterByClient})` : ""}
        ${filterByProjectType ? `${(search || filterByClient) ? 'AND' : 'WHERE'} projects.projectTypeId LIKE "%${filterByProjectType}%"` : ""}
        ORDER BY ${sortBy && sortBy == 1 ? "projects.name ASC" : sortBy == 2 ? "projects.name DESC" : sortBy == 3 ? "projects.createdAt ASC" : sortBy == 4 ? "projects.createdAt DESC" : "projects.createdAt DESC, projects.name ASC"}
        `;
        try {

            const result = await pool.query(SQL);
            const count = await pool.query(getCount);
            const projectIds = []

            result[0].map((project) => {
                projectIds.push(project.id)
            })
            const idS = projectIds.join(',');

            const getModule = `SELECT status, projectId FROM inhouseProjectModules ${projectIds.length > 0 ? ` WHERE projectId IN (${idS}) ` : ""}`;
            const module = await pool.query(getModule);
            const outsource = `SELECT * FROM resourceOutsource ${projectIds.length > 0 ? ` WHERE projectId IN (${idS}) ` : ""}`;
            const getOutsource = await pool.query(outsource);

            const finalResult = [];
            result[0].map((project) => {
                const projectModules = module[0].filter((mod) => mod.projectId == project.id)
                let finalStatus = 0;
                if (project.projectTypeId == 1) {
                    const notStarted = projectModules.filter((e) => {
                        return e.status == 0;
                    }).length
                    const inProgress = projectModules.filter((e) => {
                        return e.status == 1;
                    }).length
                    const isCompleted = projectModules.filter((e) => {
                        return e.status == 2;
                    }).length
                    const cancelled = projectModules.filter((e) => {
                        return e.status == 3;
                    }).length
                    if (notStarted == projectModules.length) {

                        finalStatus = 0;
                    }
                    else if (isCompleted == projectModules.length) {

                        finalStatus = 2;
                    }
                    else if (inProgress > 0) {

                        finalStatus = 1;
                    }
                    else if (cancelled == projectModules.length) {

                        finalStatus = 3
                    }
                    else if (inProgress == 0 && isCompleted == 0 && cancelled > 0) {

                        finalStatus = 0;
                    }
                    else if (isCompleted == 0 && cancelled > 0) {

                        finalStatus = 0;
                    }
                    else if (isCompleted > 0 && cancelled > 0 && notStarted == 0 && inProgress == 0) {

                        finalStatus = 2;
                    }
                }
                if (project.projectTypeId == 2) {
                    const formatStr = 'YYYY-MM-DD';

                    const current = moment(currentDate, formatStr)

                    const projectResources = getOutsource[0].filter((resource) => resource.projectId == project.id);

                    const isCompleted = projectResources.filter((e) => {
                        const start = moment(e.startDate, formatStr);
                        const end = moment(e.endDate, formatStr);
                        return current.isSameOrAfter(end);
                    }).length;

                    const notStarted = projectResources.filter((e) => {
                        const start = moment(e.startDate, formatStr);

                        return current.isBefore(start);
                    }).length

                    const inProgress = projectResources.filter((e) => {
                        const start = moment(e.startDate, formatStr);
                        const end = moment(e.endDate, formatStr);

                        return end.isAfter(current) || start.isAfter(current);
                    }).length

                    if (isCompleted == projectResources.length) {
                        finalStatus = 2;
                    }
                    else if (notStarted == projectResources.length) {
                        finalStatus = 0;
                    }
                    else if (inProgress > 0) {
                        finalStatus = 1;
                    }
                    else if (isCompleted > 0 && notStarted > 0) {
                        finalStatus = 1;
                    }

                }
                finalResult.push({ id: project.id, name: project.name, clientName: project.clientName, projectTypeId: project.projectTypeId, createdAt: project.createdAt, status: finalStatus });
            })

            return {
                data: finalResult,
                count: count[0].length
            }

        } catch (error) {

            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const deleteProjects = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `DELETE FROM projects WHERE id="${id}";`;
        try {
            await pool.query(SQL);
            return `id: ${id} Deleted Successfully`;
        } catch (error) {
            return error
        }
    }
    else {
        return "Invalid token";
    }
}

const getSelectProject = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `SELECT id as value,name as label,projectTypeId FROM projects ORDER BY name ASC`;
        try {
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

const getProjectById = async (request) => {
    const { authorization } = request.headers;
    const { id } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `SELECT projects.id, projects.name, projects.clientId, clients.name as clientName, projects.projectTypeId, projects.clientCost, 
            projects.resourceCost, projects.tds, projects.sgst, projects.cgst, projects.igst, 
            projects.profit, projects.invoiceStatus, projects.createdAt, projects.updatedAt
            FROM projects
            LEFT JOIN clients ON clients.id = projects.clientId  WHERE projects.id=${id}`;
            const result = await pool.query(SQL);
            const projectTypeid = result[0][0]?.projectTypeId;
            if (projectTypeid == 1) {
                const getResource = `SELECT inhouseProjectResource.id, inhouseProjectResource.projectId, inhouseProjectResource.empId,CONCAT(employees.fName," ",employees.lName) AS label,
            inhouseProjectResource.hoursPerDay,inhouseProjectResource.resourceCost, inhouseProjectResource.startDate, inhouseProjectResource.endDate,
            inhouseProjectResource.createdAt, inhouseProjectResource.updatedAt
            FROM inhouseProjectResource
            LEFT JOIN employees ON inhouseProjectResource.empId = employees.id WHERE inhouseProjectResource.projectId="${id}"`;
                const getModule = `SELECT * FROM inhouseProjectModules WHERE projectId="${id}"`;
                const inhouseProjectResource = await pool.query(getResource);
                const inhouseProjectModules = await pool.query(getModule);
                return {
                    ...result[0][0],
                    inhouseProjectResource: inhouseProjectResource[0],
                    inhouseProjectModules: inhouseProjectModules[0]
                }
            }
            if (projectTypeid == 2) {
                const outsource = `SELECT resourceOutsource.id, resourceOutsource.projectId, resourceOutsource.empId,CONCAT(employees.fName, " " ,employees.lName) AS label, resourceOutsource.durationType, resourceOutsource.clientCost,
            resourceOutsource.resourceCost, resourceOutsource.startDate, resourceOutsource.endDate, resourceOutsource.invoiceStatus,
            resourceOutsource.hoursPerDay,  resourceOutsource.createdAt, resourceOutsource.updatedAt
            
            FROM resourceOutsource
            LEFT JOIN employees ON resourceOutsource.empId = employees.id WHERE resourceOutsource.projectId="${id}"`;
                const resourceOutsource = await pool.query(outsource);
                return {
                    ...result[0][0],
                    resourceOutsource: resourceOutsource[0]
                }
            }
        } catch (error) {
            console.log(error);
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateModulesStatus = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, status, phase } = request.body;
        const SQL = `UPDATE inhouseProjectModules SET status=${status}, phase=${phase} WHERE id="${id}"`;
        try {
            const update = await pool.query(SQL);
            const getUpdate = `SELECT * FROM  inhouseProjectModules WHERE id="${id}"`;
            const result = await pool.query(getUpdate);

            return result[0][0];
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const getSelectModuleByProjectId = async (request) => {
    const { authorization } = request.headers;
    const { projectId } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `SELECT id AS value, moduleName as label FROM  inhouseProjectModules WHERE projectId=${projectId}`;
            const getModule = await pool.query(SQL);
            return getModule[0];
        } catch (error) {
            return `Error: ${error}`;
        }
    }
    else {
        return "Invalid token";
    }
}

const getInvoiceProjectDetailByProjectId = async (request) => {
    const { authorization } = request.headers;
    const { projectId } = request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {

            const SQL = `SELECT projects.id,projects.name AS projectName,projects.projectTypeId, projects.sgst,projects.cgst,projects.igst,projects.tds,clients.id AS clientId,clients.name AS clientName, clients.companyName,clients.email,clients.phone,clients.gstNumber,
                        clients.logo,clients.clientSource,clients.country,clients.state,clients.district,clients.city,clients.address,clients.billingAddress  FROM projects
                        LEFT JOIN clients ON clients.id = projects.clientId  WHERE projects.id=${projectId}`;

            const getModule = `SELECT id, moduleName, projectId, quantity, ratePerUnit, totalModulePrice, startDate, endDate, status, invoiceStatus, createdAt, updatedAt, invoicedPerc, (100 - invoicedPerc) as currentInvoicedPerc   FROM inhouseProjectModules WHERE projectId=${projectId};`;
            const getResource = `SELECT 
        resourceOutsource.id,
        (100 - resourceOutsource.invoicedPerc) as currentInvoicedPerc,
        resourceOutsource.invoicedPerc,
        resourceOutsource.projectId,
        resourceOutsource.empId,
        resourceOutsource.durationType,
        resourceOutsource.clientCost,
        resourceOutsource.resourceCost,
        resourceOutsource.startDate,
        resourceOutsource.endDate,
        resourceOutsource.invoiceStatus,
        resourceOutsource.hoursPerDay,
      
       
        resourceOutsource.createdAt,
        resourceOutsource.updatedAt,
       CONCAT(employees.fName," ",employees.lName) AS resourceName, 
        resourceOutsource.taskId
    FROM 
    employees 
    LEFT JOIN 
    resourceOutsource ON employees.id = resourceOutsource.empId 
    WHERE 
        projectId=${projectId}`;
            const inhouseProjectModules = await pool.query(getModule);
            const resourceOutsource = await pool.query(getResource);
            const updatedData = resourceOutsource[0].map((e) => {
                let s = moment(e.startDate);
                let ed = moment(e.endDate);
                return { ...e, totalDays: ed.diff(s, "days") + 1 }
            })

            const data = await pool.query(SQL);
            return { ...data[0][0], inhouseProjectModules: inhouseProjectModules[0], resourceOutsource: updatedData };
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const dashboard = async (request) => {
    const { authorization } = request.headers;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const modelInprogress = `SELECT COUNT(*)  AS count FROM inhouseProjectModules WHERE status <> 2 AND status <> 0 AND status<>3 `;
            const resInProgress = `SELECT COUNT(*)  AS count FROM resourceOutsource WHERE startDate<"${todayDate}"  `;
            const getModelCount = await pool.query(modelInprogress);
            const res = await pool.query(resInProgress);
            const inProgress = Number(getModelCount[0][0]?.count) + Number(res[0][0]?.count)

            const modelComplete = `SELECT COUNT(*) AS count FROM inhouseProjectModules WHERE status = 2 `;
            const resComplete = `SELECT COUNT(*)  AS count FROM resourceOutsource WHERE endDate>="${todayDate}"`;
            const models = await pool.query(modelComplete);
            const resp = await pool.query(resComplete);
            const completed = Number(models[0][0]?.count) + Number(resp[0][0]?.count);

            const inProgressSum = `SELECT SUM (totalModulePrice) AS total FROM inhouseProjectModules  WHERE status = 1 OR status = 0 `;
            const totalInProgress = await pool.query(inProgressSum);
            const inprogressRes = `SELECT startDate,endDate,clientCost FROM resourceOutsource  WHERE startDate<"${todayDate}" AND endDate>"${todayDate}"`
            const inprogressResSum = await pool.query(inprogressRes);
            let progressSum = 0;

            inprogressResSum[0].map((e) => {
                let s = moment(e.startDate);
                let ed = moment(e.endDate);
                let day = ed.diff(s, "days") + 1;
                progressSum = Number(day) * Number(e.clientCost);
            })
            const totalInprogressSum = Number(totalInProgress[0][0]["total"]) + Number(progressSum);

            const completeSum = `SELECT SUM (totalModulePrice) AS total FROM inhouseProjectModules  WHERE status= 2`;
            const totalCompleteModel = await pool.query(completeSum);
            const completeRes = `SELECT startDate,endDate,clientCost FROM resourceOutsource  WHERE endDate<"${todayDate}" `;
            const completeResSum = await pool.query(completeRes);

            const resSum = completeResSum[0].reduce((acc, e) => {
                const s = moment(e.startDate);
                const ed = moment(e.endDate);
                const day = ed.diff(s, "days") + 1;
                return acc + Number(day) * Number(e.clientCost);
            }, 0);

            const completeSumTotal = Number(totalCompleteModel[0][0]["total"]) + Number(resSum);

            const empActive = `SELECT COUNT(*)  AS count FROM employees WHERE isActive="true"`;
            const empUnactive = `SELECT COUNT(*)  AS count FROM employees WHERE isActive="false"`;
            const active = await pool.query(empActive);
            const unActive = await pool.query(empUnactive);

            const client = `SELECT COUNT(*)  AS count FROM clients`;
            const clientCount = await pool.query(client);

            const invoiceQuery = `SELECT SUM (subTotal) AS total FROM invoices WHERE paymentStatus=2 `;
            const invoiceCost = await pool.query(invoiceQuery);

            const dueQuery = `SELECT SUM(subTotal) AS total FROM invoices  WHERE paymentStatus<>2 `
            const dueCount = await pool.query(dueQuery);

            const dueGstQuery = `SELECT SUM (subTotal) AS total FROM invoices WHERE gstStatus=0`;
            const dueGst = await pool.query(dueGstQuery);

            const profitQuery = `SELECT SUM(clientCost-resourceCost) AS total FROM projects`;
            const profit = await pool.query(profitQuery);


            const currentDate = new Date();

            const march31CurrentYear = new Date(currentDate.getFullYear() + 1, 2, 31);
            const march = `${march31CurrentYear.getFullYear()}-${(march31CurrentYear.getMonth() + 1).toString().padStart(2, '0')}-${march31CurrentYear.getDate().toString().padStart(2, '0')}`;

            const firstOfAprilCurrentYear = new Date(currentDate.getFullYear(), 3, 1);
            const april = `${firstOfAprilCurrentYear.getFullYear()}-${(firstOfAprilCurrentYear.getMonth() + 1).toString().padStart(2, '0')}-${firstOfAprilCurrentYear.getDate().toString().padStart(2, '0')}`;

            const modelDate = ` (DATE(startDate) BETWEEN DATE("${april}") AND DATE("${march}")) OR (DATE(endDate) BETWEEN DATE("${april}") AND DATE("${march}"))`
            const inProgressSumFinance = `SELECT SUM (ratePerUnit*quantity) AS total FROM inhouseProjectModules  WHERE status <> 2 AND ${modelDate}`;
            const totalInProgressFinance = await pool.query(inProgressSumFinance);

            const resourceDate = ` (DATE(startDate) BETWEEN DATE("${april}") AND DATE("${march}")) OR (DATE(endDate) BETWEEN DATE("${april}") AND DATE("${march}"))`
            const inprogressResFinance = `SELECT SUM (resourceCost) AS total FROM resourceOutsource  WHERE startDate<"${todayDate}" AND ${resourceDate}`
            const inprogressResSumFinance = await pool.query(inprogressResFinance);

            const totalInprogressSumFinance = Number(totalInProgressFinance[0][0]["total"]) + Number(inprogressResSumFinance[0][0]["total"]);



            const completeSumFinance = `SELECT SUM (totalModulePrice) AS total FROM inhouseProjectModules  WHERE status=2 AND  (startDate BETWEEN "${april}" AND "${march}" OR endDate BETWEEN "${april}" AND "${march}")`;
            const totalCompleteModelFinance = await pool.query(completeSumFinance);
            const completeResFinance = `SELECT startDate,endDate,clientCost FROM resourceOutsource  WHERE  endDate<"${todayDate}" AND (startDate BETWEEN "${april}" AND "${march}" OR endDate BETWEEN "${april}" AND "${march}")  `
            const completeResSumFinance = await pool.query(completeResFinance);


            const financeSum = completeResSum[0].reduce((acc, e) => {
                const s = moment(e.startDate);
                const ed = moment(e.endDate);
                const day = ed.diff(s, "days") + 1;
                return acc + Number(day) * Number(e.clientCost);
            }, 0);

            const completeSumTotalFinance = Number(totalCompleteModelFinance[0][0]["total"]) + Number(financeSum);


            function generateFirstDates() {
                const currentDate = new Date(); // Get the current date
                const currentYear = currentDate.getFullYear(); // Get the current year
                const firstDates = [];

                for (let month = 0; month < 12; month++) {

                    const firstDate = new Date(currentYear, month, 1);

                    const year = firstDate.getFullYear();
                    const monthFormatted = String(firstDate.getMonth() + 1).padStart(2, '0');
                    const day = '01';

                    const formattedDate = `${year}-${monthFormatted}-${day}`;
                    firstDates.push(formattedDate);
                }

                return firstDates;
            }
            const firstDate = generateFirstDates();

            const amount = {};
            const profitAmount = {};
            const month = {
                "2023-01-01": "Jan",
                "2023-02-01": "Feb",
                "2023-03-01": "March",
                "2023-04-01": "Apr",
                "2023-05-01": "May",
                "2023-06-01": "June",
                "2023-07-01": "July",
                "2023-08-01": "Aug",
                "2023-09-01": "Sept",
                "2023-10-01": "Oct",
                "2023-11-01": "Nov",
                "2023-12-01": "Dec"
            }
            await Promise.all(
                firstDate.map(async (e, i) => {
                    const startDateCondition = `DATE(startDate) BETWEEN DATE("${firstDate[i]}") AND DATE("${firstDate[i + 1]}")`;
                    const endDateCondition = `DATE(endDate) BETWEEN DATE("${firstDate[i]}") AND DATE("${firstDate[i + 1]}")`;

                    const totalQuery = `SELECT SUM(totalModulePrice) AS total FROM inhouseProjectModules WHERE (${startDateCondition} OR ${endDateCondition})AND status=2`;
                    const total = await pool.query(totalQuery);
                    const sum = Number(total[0][0]?.total ?? "0");

                    const costQuery = `SELECT SUM(resourceCost) AS cost FROM resourceOutsource WHERE (${startDateCondition} OR ${endDateCondition})`;
                    const cost = await pool.query(costQuery);
                    const costSum = Number(cost[0][0]?.cost ?? "0");

                    const finalSum = Number(sum - costSum);
                    profitAmount[month[e]] = finalSum;
                })
            );
            await Promise.all(
                firstDate.map(async (e, i) => {
                    const startDateCondition = `startDate BETWEEN "${firstDate[i]}" AND "${firstDate[i + 1]}"`;
                    const endDateCondition = `endDate BETWEEN "${firstDate[i]}" AND "${firstDate[i + 1]}"`;

                    const totalQuery = `SELECT SUM(totalModulePrice) AS total FROM inhouseProjectModules WHERE  status<>0 AND (${startDateCondition} OR ${endDateCondition}) `;
                    const total = await pool.query(totalQuery);
                    const moduleSum = Number(total[0][0]?.total ?? "0");
                    amount[month[e]] = Number(moduleSum);
                })
            );
            const finalResult = {

                project: {
                    inProgress,
                    completed
                },
                sales: {
                    inProgress: totalInprogressSum,
                    completed: completeSumTotal,
                    total: totalInprogressSum + completeSumTotal
                },
                financialYear: {
                    inProgress: totalInprogressSumFinance,
                    completed: completeSumTotalFinance
                },
                employee: {
                    active: active[0][0]?.count,
                    unActive: unActive[0][0]?.count
                },
                client: clientCount[0][0]?.count,
                invoice: {
                    paid: (invoiceCost[0][0]["total"]),
                    due: (dueCount[0][0]["total"]),
                    gstDue: dueGst[0][0]["total"]
                },
                profit: profit[0][0]["total"],
                amount,
                profitAmount,
            };

            return finalResult;
        }
        else {
            return "Invalid Token";
        }
    } catch (error) {
        return `Error : ${error}`;
    }
}

module.exports = { updateModulesStatus, dashboard, getSelectModuleByProjectId, getInvoiceProjectDetailByProjectId, getProjectById, createProjects, updateProjects, getProjects, deleteProjects, getSelectProject };
