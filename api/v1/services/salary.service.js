const pool = require("../../config/database");
const JWT = require("jsonwebtoken");
const JWT_SECRET = "ecorner";
const moment = require("moment");
const { getCurrentDate } = require("../utils");
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const format = "YYYY-MM-DD";
const createSalary = async (request) => {
    const { empId, netSalary, month, grossSalary, salaryAllowances, salaryDeductions } = request.body;
    const { authorization } = request.headers;
    try {
        if (!empId || !netSalary || !month || !grossSalary) {
            return "All Field required ";
        }
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = `INSERT INTO salary (empId,month,netSalary,grossSalary,createdAt,updatedAt) 
          VALUES (${empId},"${month}","${netSalary}","${grossSalary}","${createdAt}","${updatedAt}")`
            const insert = await pool.query(SQL);
            const salaryId = insert[0].insertId

            salaryAllowances.map(async (e) => {
                const SQL = `INSERT INTO salaryAllowances (salaryId,allowanceId,name,amount,createdAt,updatedAt)
            VALUES (${salaryId},${e.allowanceId},"${e.label}","${e.amount}","${createdAt}","${updatedAt}")
            `
                await pool.query(SQL)
            });

            salaryDeductions.map(async (e) => {
                const SQL = `INSERT INTO salaryDeductions (salaryId,amount,name,createdAt,updatedAt)
            VALUES(${salaryId}, ${e.amount} ,"${e.label}","${createdAt}","${updatedAt}")
            `;
                await pool.query(SQL);
            })

            const getSalary = `SELECT * FROM salary WHERE id="${salaryId}"`;
            const salary = await pool.query(getSalary);

            const allowance = `SELECT * FROM salaryAllowances WHERE salaryId=${salaryId}`;
            const salaryAllowancesData = await pool.query(allowance);

            const deduction = `SELECT * FROM salaryDeductions WHERE salaryId=${salaryId}`;
            const salaryDeductionsData = await pool.query(deduction);

            return { ...salary[0][0], salaryAllowances: salaryAllowancesData[0], salaryDeductions: salaryDeductionsData[0] }
        }
        else {
            return "Invalid token";
        }
    } catch (error) {
        return `Error ${error}`;
    }
}

const getSalary = async (request) => {
    const { authorization } = request.headers;
    const { search, page, result_size, month } = request.query;
    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const start = (page * result_size) - result_size;
            const end = result_size;
            const SQL = `SELECT emp.id AS empId,CONCAT(emp.fName," ",emp.lName) AS name,emp.email,emp.phone,emp.joiningDate,des.name AS designation,emp.createdAt,emp.updatedAt FROM employees AS emp LEFT JOIN designation AS des ON emp.jobTitle=des.id  WHERE emp.isActive="true" ${search ? ` AND (emp.fName LIKE "%${search}%" OR emp.lName LIKE "%${search}%") OR (CONCAT(emp.fName," ",emp.lName)="${search}")` : ""} LIMIT ${start}, ${end} `;

            const employee = await pool.query(SQL);

            const getSalary = `SELECT * FROM salary WHERE month="${month}"`;
            const salary = await pool.query(getSalary);

            const finalData = employee[0].filter((e) => {
                const matchingSalaries = salary[0].filter((s) => s.empId == e.empId);
                e["id"] = matchingSalaries[0]?.id;

                e["isSalaryCreated"] = matchingSalaries.length;
                e["month"] = matchingSalaries[0]?.month
                e["netSalary"] = matchingSalaries[0]?.netSalary;
                e["grossSalary"] = matchingSalaries[0]?.grossSalary;

                return { ...e };
            });

            return finalData;
        }
        else {
            return "Invailid token"
        }
    } catch (error) {
        return `Error ${error}`;
    }
}

const getEmployeeSalaryByEmpId = async (request) => {
    const { authorization } = request.headers;
    let { empId, currentMonth } = request.params;

    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {

            const leaveQuery = `SELECT * FROM leaves WHERE empId="${empId}" AND status=2`;
            const allLeaves = await pool.query(leaveQuery);

            const currentDate = new Date();
            let today = currentDate.getDate();

            let currentYear = currentDate.getFullYear();
            function addMonths(dateString, months) {
                const date = new Date(dateString);
                date.setMonth(date.getMonth() + months);
                if (date.getDate() !== new Date(dateString).getDate()) {
                    date.setDate(0);
                }

                return date.toISOString().substr(0, 10);
            }
            const aprilDate = new Date(currentDate.getFullYear(), 3, 1);

            const firstDayOfMonth = moment((currentMonth + '-01'), format);
            // = moment(new Date(currentYear, currentMonth-1, 1),format)
            const firstDayOfNextMonth = moment(addMonths(firstDayOfMonth, 1), format)

            let totalLeaves = 0;

            let monthCount = currentDate.getMonth() - aprilDate.getMonth();
            monthCount += (currentDate.getFullYear() - aprilDate.getFullYear()) * 12;

            allLeaves[0].forEach((e) => {
                const startDate = moment(e.startDate, format);
                const endDate = moment(e.endDate, format);
                const dayCount = endDate.diff(startDate, "days");
                totalLeaves += dayCount;
            })

            currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth

            let leaves = monthCount - (totalLeaves + 1);
            leaves = leaves <= 0 ? 1 : leaves;

            const getSalary = `SELECT netSallary FROM employees WHERE id="${empId}"`;
            const netSallary = await pool.query(getSalary);
            const dateFilter = ` (startDate BETWEEN DATE("${firstDayOfMonth.format(format)}") AND "${firstDayOfNextMonth.format(format)}" OR endDate BETWEEN "${firstDayOfMonth.format(format)}" AND "${firstDayOfNextMonth.format(format)}")`;
            const SQL = `SELECT * FROM leaves WHERE empId=${empId} AND ${dateFilter}`;

            const currentMonthleave = await pool.query(SQL);

            const allowanceQuery = `SELECT employeeAllowances.amount,employeeAllowances.id,allowances.name AS label, employeeAllowances.allowanceId FROM employeeAllowances LEFT JOIN allowances ON employeeAllowances.allowanceId=allowances.id  WHERE empId=${empId}`;
            const employeeAllowances = await pool.query(allowanceQuery);
            const deductionQuery = `
            SELECT d.name AS label, d.id, d.amount, d.salaryId
            FROM salaryDeductions AS d
            LEFT JOIN salary ON salary.id = d.salaryId
            LEFT JOIN employees ON employees.id = salary.empId
            WHERE salary.empId = ${empId}
          `;
          
            const salaryDeductions =await pool.query(deductionQuery);
            return {salaryDeductions:salaryDeductions[0], availableLeaves: leaves, currentMonthLeave: currentMonthleave[0], employeeAllowances: employeeAllowances[0], netSalary: netSallary[0][0]?.netSallary }
        } else {

            return "Invalid token";
        }
    } catch (error) {
        return `Error ${error}`;
    }

}

const getSalaryById =async (request)=>{
    const { authorization } = request.headers;
    let { id } = request.params;

    try {
        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const salaryQuery=`SELECT * FROM salary WHERE id=${id}`;
            const allowanceQuery=`SELECT * FROM salaryAllowances WHERE salaryId=${id}`;
            const deductionQuery=`SELECT * FROM salaryDeductions WHERE salaryId=${id}`;

            const salary=await pool.query(salaryQuery);
            const salaryAllowances = await pool.query(allowanceQuery);
            const salaryDeductions =await pool.query(deductionQuery);
            return {...salary[0][0],salaryAllowances: salaryAllowances[0],salaryDeductions: salaryDeductions[0]}
        }
    } catch (error) {
       return "Internal Server Error" 
    }
}

const getSalarySlip = async (request) => {
    const { authorization } = request.headers;
    const { empId, month } = request.params;
    try {

        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            const SQL = `SELECT emp.id,CONCAT (emp.fName," ",emp.lName) AS name, des.name AS designation,sal.netSalary,sal.id AS salaryId,sal.grossSalary,sal.month FROM salary sal
         LEFT JOIN employees emp ON sal.empId=emp.Id 
         LEFT JOIN designation des ON  emp.jobTitle=des.id WHERE emp.id=${empId} AND sal.month="${month}"`;
            const slipData = await pool.query(SQL);
            if (slipData[0].length > 0) {
                const salaryId = slipData[0][0]?.salaryId
                const allowanceQuery = ` SELECT * FROM salaryAllowances WHERE salaryId=${salaryId}`;
                const deductionQuery = ` SELECT * FROM salaryDeductions  WHERE salaryId=${salaryId}`;
                const salaryAllowances = await pool.query(allowanceQuery);
                const salaryDeductions = await pool.query(deductionQuery);
                return { ...slipData[0][0], salaryAllowances: salaryAllowances[0], salaryDeductions: salaryDeductions[0] };
            }
            else {
                return { ...slipData[0][0] }
            }
        }
        else {
            return "Invailid token ";
        }
    } catch (error) {

        return `Error ${error}`;
    }
}

const updateSalary = async (request) => {
    const { authorization } = request.headers;

    try {

        const isVerified = JWT.verify(authorization, JWT_SECRET);
        if (isVerified) {
            console.log(request.body);
            const { id, empId, netSalary, month, grossSalary, salaryAllowances, salaryDeductions, deleteDeductions, deleteAllowances } = request.body;
            const SQL = `UPDATE salary SET netSalary="${netSalary}",month="${month}",grossSalary="${grossSalary}" WHERE id=${id}`;
            await pool.query(SQL);
            const empQuery = `UPDATE employees SET netSallary=${netSalary} WHERE id=${empId}`;
            await pool.query(empQuery);
            const getResp = `SELECT * FROM salary WHERE id=${id}`;
            const response = await pool.query(getResp);
            salaryAllowances.map(async (e) => {
                if (e.id) {
                    const SQL = `UPDATE employeeAllowances SET  amount="${e.amount}",updatedAt="${updatedAt}" WHERE id=${e.id}`
                    console.log(SQL);
                    await pool.query(SQL)
                }
                else {
                    const SQL = `INSERT INTO employeeAllowances (empId,allowanceId,amount,createdAt,updatedAt)
                    VALUES (${empId},${e.allowanceId},"${e.amount}","${createdAt}","${updatedAt}")
                    `
                    await pool.query(SQL);
                }
            });

            salaryDeductions.map(async (e) => {
                if (e.id) {
                    const SQL = `UPDATE salaryDeductions SET name="${e.label}", amount="${e.amount}",updatedAt="${updatedAt}" WHERE id=${e.id}`;
                    await pool.query(SQL);
                }
                else {
                    const SQL = `INSERT INTO salaryDeductions (salaryId,amount,name,createdAt,updatedAt)
                    VALUES(${id}, ${e.amount} ,"${e.label}","${createdAt}","${updatedAt}")
                    `;
                  
                    await pool.query(SQL);
                }
            })

            deleteDeductions.map(async (id, i) => {
                const query = `DELETE FROM salaryDeductions WHERE id=${id}`;
                await pool.query(query);
            })

            deleteAllowances.map(async (id, i) => {
                const query = `DELETE FROM employeeAllowances WHERE id=${id}`;
                await pool.query(query);
            })
            const allowance = `SELECT * FROM salaryAllowances WHERE salaryId=${id}`;
            const salaryAllowancesData = await pool.query(allowance);

            const deduction = `SELECT * FROM salaryDeductions WHERE salaryId=${id}`;
            const salaryDeductionsData = await pool.query(deduction);

            return { ...response[0][0], salaryAllowances: salaryAllowancesData[0], salaryDeductions: salaryDeductionsData[0] };
        }
        else {
            return "Invailid Token";
        }
    } catch (error) {

        return JSON.stringify(error);
    }
}
module.exports = { getSalaryById,createSalary, getSalary, getEmployeeSalaryByEmpId, getSalarySlip, updateSalary }