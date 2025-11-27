const pool = require("../../config/database");
const { getCurrentDate, updateDate } = require("../utils");
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const moment = require('moment')
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";

const createTask = async (request) => {
    const { name, empId, projectId, moduleId, hoursPerDay, subTask } = request.body;

    const { authorization } = request.headers;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {


            let startDate = moment(subTask[0].startDate);
            let dueDate = moment(subTask[0].dueDate);
            const strFormat = "YYYY-MM-DD"
            subTask.forEach(e => {
                const currentStartDate = moment(e.startDate, strFormat);
                const currentDueDate = moment(e.dueDate, strFormat);

                if (currentStartDate.isBefore(startDate)) {
                    startDate = currentStartDate;
                }

                if (currentDueDate.isAfter(dueDate)) {
                    dueDate = currentDueDate;
                }
            });

            // inhouseProjectResource
            const resourceQuery = `SELECT * FROM inhouseProjectResource WHERE empId=${empId}`;
            const resource = await pool.query(resourceQuery);
            const format = "YYYY-MM-DD"
            if (resource[0].length != 0) {
                let resourceStartDate = moment(resource[0][0].startDate, format);
                let resourceEndDate = moment(resource[0][0].endDate, format);

                if (startDate.diff(resourceEndDate, 'days') >= 2 && dueDate.isAfter(resourceEndDate)) {

                    const { hoursPerDay, resourceCost } = resource[0][0];
                    const totalDay = dueDate.diff(startDate, "days");

                    const createTask = `INSERT INTO task (name,projectId ,empId, moduleId, hoursPerDay,createdAt, updatedAt,startDate, dueDate)
                                VALUES("${name}","${resource[0][0].projectId}","${empId}","${moduleId}","${hoursPerDay}","${createdAt}","${updatedAt}","${startDate.format(format)}","${dueDate.format(format)}")`
                    const taskData = await pool.query(createTask);

                    const resourceTotalCost = hoursPerDay * totalDay * resourceCost;
                    const inhouseResource = `INSERT INTO inhouseProjectResource (projectId,empId,taskId,hoursPerDay,resourceCost,startDate,endDate,createdAt,updatedAt) 
                values(${resource[0][0].projectId},"${empId}","${taskData[0].insertId}" ,"${hoursPerDay}","${resourceTotalCost}","${startDate.format(format)}","${dueDate.format(format)}","${createdAt}","${updatedAt}")`;
                    await pool.query(inhouseResource);

                } else if (startDate.isSameOrAfter(resourceStartDate) || startDate.diff(resourceStartDate, 'days') == 1) {

                    const updateRes = `UPDATE inhouseProjectResource SET endDate="${dueDate.format(format)}" WHERE empId=${empId}`;
                    await pool.query(updateRes);
                }
            }

            let SQL;
            moduleId && projectId ? SQL = `INSERT INTO task ( name,projectId ,empId, moduleId, hoursPerDay,createdAt, updatedAt,startDate, dueDate)
            VALUES ("${name}", "${projectId}", "${empId}","${moduleId}", "${hoursPerDay}", "${createdAt}", "${updatedAt}","${startDate.format(format)}","${dueDate.format(format)}")` :
                SQL = `INSERT INTO task ( name ,empId, hoursPerDay,createdAt, updatedAt,startDate, dueDate)
            VALUES ("${name}", "${empId}", "${hoursPerDay}", "${createdAt}", "${updatedAt}","${startDate.format(format)}","${dueDate.format(format)}")`;


            const getResult = await pool.query(SQL);
            const taskId = getResult[0].insertId
            const getTask = `SELECT * FROM task WHERE id=${taskId}`;

            subTask.map(async (e) => {
                const SQL = `INSERT INTO subTask (taskId,title,description,startDate,dueDate,status,priority,remark,updatedBy,createdAt,updatedAt)
              VALUES(${taskId},"${e.title}","${e.description}","${e.startDate}","${e.dueDate}","${e.status}","${e.priority}","NA","${e.updatedBy}","${createdAt}","${updatedAt}")
              `
                await pool.query(SQL);
            })
            const getSubtask = `SELECT * FROM subTask WHERE taskId=${taskId}`
            const getAllSubTask = await pool.query(getSubtask);
            const result = await pool.query(getTask);
            return {
                ...result[0][0],
                subTask: getAllSubTask[0]
            };
        } else {
            return "Invalid Token";
        }
    } catch (error) {

        return `Error: ${error}`;
    }
}

const createSubTask = async (request) => {
    try {
        const { authorization } = request.headers;
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {

            const { taskId, title, description, startDate, dueDate, status, priority, updatedBy } = request.body;
            if (!taskId || !title || !description || !startDate || !dueDate || !status || !priority || !updatedBy) {
                return "All field required";
            }
            const SQL = `INSERT INTO subTask (taskId,title,description,startDate,dueDate,status,priority,remark,updatedBy,createdAt,updatedAt)
                VALUES (${taskId},"${title}","${description}","${startDate}","${dueDate}","${status}","${priority}","NA","${updatedBy}","${createdAt}","${updatedAt}" )
               `
            const insert = await pool.query(SQL);
            const getQuery = `SELECT * FROM subTask WHERE id=${insert[0].insertId}`
            const result = await pool.query(getQuery);
            return result[0][0]
        } else {
            return "Invailid Token";
        }
    } catch (error) {
        return `Error ${error}`;
    }
}

const getAllTask = async (request) => {
    const { authorization } = request.headers;
    const { startDate, dueDate, search, page, result_size } = request.query;
    const pageStart = (page * result_size) - result_size;
    const pageEnd = result_size;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const start = new Date(startDate);
            const end = new Date(dueDate);
           const startMoment=moment(startDate).format("YYYY-MM-DD")
           const endMoment=moment(dueDate).format("YYYY-MM-DD")
            const dates = [];
            let currentDate = start;

            while (start <= end) {
                dates.push(currentDate.toISOString().split('T')[0]);
                currentDate.setDate(currentDate.getDate() + 1);
            }
            const empQuery = `SELECT emp.id, CONCAT (emp.fName," ",emp.lName) AS name,des.name as designation 
            FROM employees as emp LEFT JOIN designation as des ON emp.jobTitle=des.id WHERE emp.isActive="true" ${search ? `AND emp.fName LIKE "%${search}%" OR emp.lName LIKE "%${search}%" OR (CONCAT(emp.fName," ",emp.lName)="${search}") ` : ""} LIMIT ${pageStart},${pageEnd} `
            const employee = await pool.query(empQuery);

            const countQuery = `SELECT COUNT(*) AS total FROM employees WHERE isActive="true" ${search ? `AND fName LIKE "%${search}%" OR lName LIKE "%${search}%" ` : ""}`;
            const getCount = await pool.query(countQuery);

            const taskQuery = `SELECT task.id,task.empId,task.moduleId,task.projectId,task.name,projects.name as projectName,projects.projectTypeId ,task.hoursPerDay,task.createdAt,task.updatedAt,
          task.startDate,task.dueDate FROM task LEFT JOIN projects ON task.projectId=projects.id WHERE (DATE(task.startDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}")) OR (DATE(task.dueDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}"))`;

            const tasks = await pool.query(taskQuery);


            const subTaskQuery = `SELECT * FROM subTask WHERE (DATE(startDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}")) OR (DATE(dueDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}"))`;
            const subTask = await pool.query(subTaskQuery);
            
            const leaveQuery=`SELECT * FROM leaves WHERE (DATE(startDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}")) OR (DATE(endDate) BETWEEN DATE("${startDate}") AND DATE("${dueDate}"))`;
            const leavesData=await pool.query(leaveQuery)

            const holidayQuery=`SELECT * FROM holiday WHERE (DATE(date) BETWEEN DATE("${startDate}") AND DATE("${dueDate}"))`;
            const holidayData=await pool.query(holidayQuery)
            

            const finalData = employee[0].map((emp) => {
                let allTasks = {}
                dates.map((date) => {
                    allTasks[date] = tasks[0].filter((task) => task.empId == emp.id && date >= task.startDate && task.dueDate >= date)
                })

                Object.keys(allTasks).forEach(function (key) {
                    allTasks[key] = allTasks[key].map((task,e) => {
                    const isLeave=leavesData[0].filter((event)=>(event.startDate)<=key&& (event.endDate)>=key).length;
                    const isHoliday=holidayData[0].filter((event)=>(event.date)==key).length;
                        return { ...task,leave:isLeave>=1,holiday:isHoliday>=1, subTask: subTask[0].filter((sub) => task.id == sub.taskId && key >= sub.startDate && sub.dueDate >= key) }
                    })
                });

                return {
                    ...emp, tasks: allTasks
                }

            })

            return { data: finalData, count: getCount[0][0].total };

        } else {
            return "invalid Token"
        }
    } catch (error) {
        return `Error: ${error}`;
    }


}

const updateSubTask = async (request) => {
    const { authorization } = request.headers;
    const { id, taskId } = request.params;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = `UPDATE subTask SET ? WHERE id=${id}`;
            await pool.query(SQL, request.body);
            await updateDate(taskId);
            const getData = `SELECT * FROM subTask WHERE id=${id}`;
            const result = await pool.query(getData);

            return result[0][0];
        } else {
            return "invalid Token"
        }
    } catch (error) {
        return `Error: ${error}`;
    }
}

const deleteSubtask = async (request) => {
    try {
        const { authorization } = request.headers;
        const { id, taskId } = request.params;
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = `DELETE FROM subTask WHERE id=${id}`;
            await pool.query(SQL);

            const subTaskQuery = `SELECT * FROM subTask WHERE taskId=${taskId} `;
            const subTasks = await pool.query(subTaskQuery);

            const taskQuery = `SELECT * FROM task WHERE id=${taskId}`;
            const tasks = await pool.query(taskQuery);

            if (subTasks[0].length == 0 && tasks[0][0].projectId == null && tasks[0][0].moduleId == null) {
                const deleteTask = `DELETE FROM task WHERE id=${taskId}`;
                await pool.query(deleteTask);
                return `id: ${id} Deleted Successfully`
            }
            await updateDate(taskId);
            return `id: ${id} Deleted Successfully`
        }
    } catch (error) {
        return error
    }
}

const updateTask = async (request) => {
    try {
        const { authorization } = request.headers;
        const { id } = request.params;
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const updateQuery = `UPDATE task SET ? WHERE id=${id}`;
            await pool.query(updateQuery, request.body);
            const getQuery = `SELECT * FROM task WHERE id=${id}`;
            const result = await pool.query(getQuery);
            return result[0][0];
        }
        else {
            return "Invalid Token"
        }
    } catch (error) {
        return `Error ${error}`;
    }
}
module.exports = { getAllTask, createTask, updateSubTask, updateTask, deleteSubtask, createSubTask };