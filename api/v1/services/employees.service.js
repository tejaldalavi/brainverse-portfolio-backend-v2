const pool = require('../../config/database');

const JWT = require('jsonwebtoken');
const { getCurrentDate } = require("../../v1/utils")
const JWT_SECRET = "ecorner";
const createdAt = getCurrentDate();
const updatedAt = getCurrentDate();
const createEmployees = async (request) => {

    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const accessManagement = {
            projectRead: false,
            projectAction: false,
            clientRead: false,
            clientAction: false,
            employeeRead: false,
            employeeAction: false,
            payrollItemRead: false,
            payrollItemAction: false,
            accessRead: false,
            accessAction: false,
            invoiceRead: false,
            invoiceAction: false,
            dashboardRead: false,
            taskRead: false,
            taskAction: false,
            holidaysRead: false,
            leavesRead: false,
            leavesAction: false,
            departmentsRead: false,
            departmentsAction: false,
            designationRead: false,
            designationAction: false,
            salaryRead: false,
            salaryAction: false,
            holidaysAction: false
        }

        const { fName, lName, email, phone, profileImage, jobTitle, joiningDate, jobDescription, resumeLink, password, netSallary, employeeBankDetails, employeeAllowances, employeeDocuments } = request.body;
        const { projectAction, projectRead, clientAction, clientRead, employeeAction, employeeRead, accessAction, accessRead, dashboardRead, salaryAction, salaryRead, holidaysRead, holidaysAction, taskAction, taskRead, payrollItemAction, payrollItemRead, leavesAction, leavesRead, invoiceAction, invoiceRead, designationAction, designationRead, departmentsAction, departmentsRead } = accessManagement;
        const { bankName, name, accountNumber, ifsc } = employeeBankDetails;

        const saltRounds = 10;

        if (!fName || !lName || !email || !phone || !profileImage || !jobTitle || !joiningDate || !jobDescription || !resumeLink || !password || !netSallary) {
            return "please fill all field";
        }
        const InsertEmployee = `INSERT INTO employees (fName, lName, email, phone,isActive, profileImage, jobTitle, joiningDate, jobDescription, resumeLink, password, netSallary,createdAt,updatedAt) 
    values("${fName}","${lName}","${email}","${phone}","${true}","${profileImage}","${jobTitle}","${joiningDate}","${jobDescription}","${resumeLink}","${password}","${netSallary}","${createdAt}","${updatedAt}");`;

        try {
            const res = await pool.query(InsertEmployee);
            const insertId = res[0].insertId;

            const accessManagement = `INSERT INTO accessManagement (empId, projectAction, projectRead, clientAction, clientRead, employeeAction, employeeRead, accessAction, accessRead, dashboardRead, salaryAction, salaryRead, holidaysRead, holidaysAction, taskAction, taskRead, payrollItemAction, payrollItemRead, leavesAction, leavesRead, invoiceAction, invoiceRead, designationAction, designationRead, departmentsAction, departmentsRead)
        VALUES ("${insertId}", "${projectAction}", "${projectRead}", "${clientAction}", "${clientRead}", "${employeeAction}", "${employeeRead}", "${accessAction}", "${accessRead}", "${dashboardRead}", "${salaryAction}", "${salaryRead}", "${holidaysRead}", "${holidaysAction}", "${taskAction}", "${taskRead}", "${payrollItemAction}", "${payrollItemRead}", "${leavesAction}", "${leavesRead}", "${invoiceAction}", "${invoiceRead}", "${designationAction}", "${designationRead}", "${departmentsAction}", "${departmentsRead}")`;
            await pool.query(accessManagement);

            const users = `INSERT INTO users (empId,email,password) VALUES("${insertId}","${email}","${password}")`
            await pool.query(users);

            const bankDetail = `INSERT INTO employeeBankDetails (empId,bankName,name,accountNumber,ifsc,createdAt,updatedAt) values("${insertId}","${bankName}","${name}","${accountNumber}","${ifsc}","${createdAt}","${updatedAt}");`;
            await pool.query(bankDetail);


            employeeAllowances.map(async (e) => {

                const allowance = `INSERT INTO employeeAllowances (empId,allowanceId,amount,createdAt,updatedAt) values("${insertId}","${e.allowanceId}","${e.amount}","${createdAt}","${updatedAt}");`;
                await pool.query(allowance);
            })
            employeeDocuments.map(async (e) => {

                const document = `INSERT INTO employeeDocuments (empId,documentLink,documentName,required,createdAt,updatedAt) values("${insertId}","${e.documentLink}","${e.documentName}","${e.required}","${createdAt}","${updatedAt}");`;
                await pool.query(document);
            })
            const createResp = `SELECT * FROM employees WHERE id=${insertId}`;
            const result = await pool.query(createResp);
            const getEmpAllowance = `SELECT * FROM employeeAllowances WHERE empId=${insertId}`,
                getEmpBankDetails = `SELECT * FROM employeeBankDetails WHERE empId=${insertId}`,
                getEmpDocument = `SELECT * FROM employeeDocuments WHERE empId=${insertId}`;
            const getAllowance = await pool.query(getEmpAllowance);
            const getDocument = await pool.query(getEmpDocument);
            const getBankDetail = await pool.query(getEmpBankDetails);
            return {
                employee: {
                    ...result[0][0],
                    employeeBankDetails: getBankDetail[0],
                    employeeDocuments: getDocument[0],
                    employeeAllowances: getAllowance[0]
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

const updateEmployees = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id, fName, lName, email, phone, profileImage, jobTitle, joiningDate, jobDescription, resumeLink, password, netSallary, employeeBankDetails, employeeAllowances, employeeDocuments, deletedAllowances, deletedDocuments } = request.body;
        const empId = id;


        try {
            const SQL = `UPDATE employees SET fName="${fName}",lName="${lName}",email="${email}",phone="${phone}",profileImage="${profileImage}",jobTitle="${jobTitle}",
                     jobDescription="${jobDescription}",joiningDate="${joiningDate}",resumeLink="${resumeLink}",password="${password}",netSallary="${netSallary}",updatedAt="${updatedAt}" WHERE id="${empId}"`;
            const updateRes = await pool.query(SQL);

            const getUpdate = `SELECT * FROM employees WHERE id=${empId}`;
            const result = await pool.query(getUpdate);

            const { bankName, name, accountNumber, ifsc } = employeeBankDetails;

            const bankDetail = `UPDATE employeeBankDetails SET name ="${name}",bankName="${bankName}",accountNumber="${accountNumber}" , ifsc = "${ifsc}",updatedAt="${updatedAt}" WHERE empId = "${id}"`;
            await pool.query(bankDetail);



            deletedAllowances.map(async (e) => {
                const isDeleted = `DELETE FROM employeeAllowances WHERE id=${e}`;
                await pool.query(isDeleted);
            })
            employeeAllowances.map(async (e) => {

                if (e.id) {
                    const updateEmpAllowance = `UPDATE employeeAllowances SET amount ="${e.amount}",allowanceId="${e.allowanceId}",updatedAt="${updatedAt}" WHERE id=${e.id}`;
                    await pool.query(updateEmpAllowance);
                } else {
                    const allowance = `INSERT INTO employeeAllowances (empId,allowanceId,amount,createdAt,updatedAt) values("${empId}","${e.allowanceId}","${e.amount}","${createdAt}","${updatedAt}");`;
                    await pool.query(allowance);
                }
            })
            deletedDocuments.map(async (e) => {
                const isDeleted = `DELETE FROM employeeDocuments WHERE id=${e}`;
                await pool.query(isDeleted);
            })
            employeeDocuments.map(async (e) => {

                if (e.id) {
                    const updateEmpDocs = `UPDATE employeeDocuments SET documentLink ="${e.documentLink}",documentName="${e.documentName}",required="${e.required}",updatedAt="${updatedAt}" WHERE id="${e.id}"`;
                    await pool.query(updateEmpDocs);
                } else {
                    const document = `INSERT INTO employeeDocuments (empId,documentLink,documentName,required,createdAt,updatedAt) values("${empId}","${e.documentLink}","${e.documentName}","${e.required}","${createdAt}","${updatedAt}");`;
                    await pool.query(document);
                }
            })
            const updateUser = `UPDATE users SET email="${email}",password="${password}" WHERE empId=${id}`;
            const update = await pool.query(updateUser);

            const employeeBankDetailsRes = await pool.query(`SELECT * FROM employeeBankDetails WHERE empId=${empId}`);
            const employeeDocumentsRes = await pool.query(`SELECT * FROM employeeDocuments WHERE empId=${empId}`);
            const employeeAllowancesRes = await pool.query(`SELECT * FROM employeeAllowances WHERE empId=${empId}`);

            return {
                ...result[0][0],
                employeeBankDetails: employeeBankDetailsRes[0],
                employeeAllowances: employeeAllowancesRes[0],
                employeeDocuments: employeeDocumentsRes[0],

            };
        } catch (err) {
            return JSON.stringify(err);
        }
    }
    else {
        return "Invalid token";
    }
}

const deleteEmployees = async (request) => {

    const { authorization } = request.headers;
    const {id}=request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const employee = `DELETE FROM employees WHERE id="${id}" `;

        const bankDetail = `DELETE FROM employeeBankDetails where empId="${id}";`;

        const allowance = `DELETE FROM employeeAllowances where empId="${id}";`;

        const document = `DELETE FROM employeeDocuments where empId="${id}";`;
        try {
            await pool.query(employee)
            await pool.query(bankDetail);
            await pool.query(allowance);
            await pool.query(document);
            return `id: ${id} Deleted Successfully`

        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token: ";
    }
}

const getEmployees = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const {
            page,
            result_size,
            filterByJobTitle,
            search,
            sortBy,
            status
        } = request.query;

        const start = (page * result_size) - result_size;
        const end = result_size;
        const employee = `SELECT employees.id, employees.fName, employees.lName, employees.email, employees.phone, employees.profileImage, employees.joiningDate, employees.isActive, designation.name AS jobTitle, employees.jobDescription, employees.resumeLink, employees.password, employees.netSallary
        FROM employees
        LEFT JOIN designation ON employees.jobTitle = designation.id
        WHERE employees.isActive="${status}"  ${filterByJobTitle ? `AND employees.jobTitle IN (${filterByJobTitle})` : ""}  
          ${search ? `AND (employees.fName LIKE "%${search}%" OR employees.lName LIKE "%${search}%" OR CONCAT(employees.fName," ",employees.lName)="${search}")` : ""}
         
        ORDER BY
          ${sortBy == 1 ? "employees.fName ASC" : sortBy == 2 ? "employees.fName DESC" : sortBy == 3 ? "employees.joiningDate DESC" : sortBy == 4 ? "employees.joiningDate ASC" : "employees.createdAt DESC, fName ASC"}
        LIMIT ${start}, ${end};`;

        const getCount = `SELECT COUNT(employees.id) AS count, employees.fName, employees.lName, employees.email, employees.phone, employees.profileImage, employees.joiningDate, employees.isActive, designation.name AS jobTitle, employees.jobDescription, employees.resumeLink, employees.password, employees.netSallary
        FROM employees
        LEFT JOIN designation ON employees.jobTitle = designation.id
        WHERE employees.isActive = "${status}"
          ${search ? `AND (employees.fName LIKE "%${search}%" OR employees.lName LIKE "%${search}%")` : ""}
           ${filterByJobTitle ? `AND employees.jobTitle IN (${filterByJobTitle})` : ""}
        ORDER BY
          ${sortBy != "undefined" && sortBy == 1 ? "employees.fName ASC" : sortBy == 2 ? "employees.fName DESC" : sortBy == 3 ? "employees.joiningDate ASC" : sortBy == 4 ? "employees.joiningDate DESC" : "employees.createdAt DESC, fName ASC"}
        `;

        try {
            const result = await pool.query(employee);
            const count = await pool.query(getCount);

            return {
                employees: result[0],
                count: count[0][0]["count"],

            }
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }

}

const getSelectEmployees = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const SQL = `SELECT id ,CONCAT(fName ," ",lName) AS label  FROM employees WHERE isActive="true" ORDER BY fName,lName ASC`;
        try {
            const ans = await pool.query(SQL);

            return ans[0];
        } catch (error) {
            return error;
        }
    }
    else {
        return "invailid token";
    }
}

const getSelectEmployeeByDurationType = async (request) => {
    const { authorization } = request.headers;
    const {durationType}=request.params;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `SELECT id,fName,lName,netSallary FROM employees WHERE isActive="true" ORDER BY fName ASC`;
            const ans = await pool.query(SQL);


            const getAllowance = `SELECT empId,amount FROM employeeAllowances`;
            const allowance = await pool.query(getAllowance);
            const result = ans[0].map((e) => {
                const empAllowances = allowance[0].filter((data) => data.empId == e.id)

                const totalAllowances = empAllowances.reduce(
                    (a, b) => Number(a) + Number(b.amount), 0
                )
                const grossSallary = Number(e.netSallary) + Number(totalAllowances);

                return { value: e.id, label: `${e.fName} ${e.lName}`, ratePerDuration: durationType == "0" ? Math.round((grossSallary / 30) / 9) : grossSallary }
            });

            return await result;
        } catch (error) {
            return JSON.parse(error);
        }
    }
    else {
        return "invalid token";
    }
}

const getEmployeesById = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        const { id } = request.params;
        try {
            const SQL = `SELECT emp.id, emp.isActive, emp.fName, emp.lName, emp.email, emp.password, emp.phone, emp.profileImage, emp.joiningDate, emp.jobTitle, ds.name as jobTitleName, emp.jobDescription, emp.resumeLink, emp.netSallary
        FROM employees AS emp
        LEFT JOIN designation AS ds ON emp.jobTitle = ds.id
        WHERE emp.id = "${id}" ;
        `;

            const getAllowance = `SELECT employeeAllowances.allowanceId,employeeAllowances.id ,employeeAllowances.amount, allowances.name as label
        FROM employeeAllowances
        INNER JOIN allowances ON employeeAllowances.allowanceId = allowances.id
        WHERE employeeAllowances.empId = ${id};  `;

            const getDocuments = `SELECT * FROM employeeDocuments WHERE empId=${id}`;
            const getBankDetail = `SELECT * FROM employeeBankDetails WHERE empId=${id}`;

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
            function getFirstAndLastDateOfLastMonth() {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setDate(0);
                const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const first = formatDate(firstDayOfLastMonth);
                const last = formatDate(lastMonth);

                return {
                    first,
                    last,
                };
            }

            function formatDate(date) {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
                const day = String(date.getDate()).padStart(2, '0');

                return `${year}-${month}-${day}`;
            }
            const calculatePercentage = (part, whole) => {
                const percentage = (part / whole) * 100;
                return percentage.toFixed(2);
            };
            const firstDate = generateFirstDates();

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
            const graph = {};
            await Promise.all(
                firstDate.map(async (e, i) => {
                    const startDateCondition = `DATE(startDate) BETWEEN DATE("${firstDate[i]}") AND DATE("${firstDate[i + 1]}")`;
                    const endDateCondition = `DATE(dueDate) BETWEEN DATE("${firstDate[i]}") AND DATE("${firstDate[i + 1]}")`;

                    const SQL = `SELECT SUM(hoursPerDay) AS total FROM task WHERE empId=${id} AND (${startDateCondition} OR ${endDateCondition})`;
                    const hourCount = await pool.query(SQL);
                    const total = hourCount[0][0]?.total
                    const result = calculatePercentage(total, 200)
                    graph[month[e]] = Number(result);

                })
            );
            const { first, last } = getFirstAndLastDateOfLastMonth();
            const firstMonthDate = `DATE(startDate) BETWEEN DATE("${first}") AND DATE("${last}")`;
            const lastMonthDate = `DATE(dueDate) BETWEEN DATE("${first}") AND DATE("${last}")`;

            const getHour = `SELECT SUM (hoursPerDay) AS hour FROM task WHERE empId=${id} AND (${firstMonthDate} OR ${lastMonthDate})`
            const hour = await pool.query(getHour);
            const taskQuery = `SELECT COUNT(DISTINCT projectId) AS count FROM task WHERE empId=${id} AND projectId IS NOT NULL`;
            const task = await pool.query(taskQuery);
            const projectCount = task[0][0].count
            // const projectCount = task[0]?.filter((em) => em.empId == id);
            const workingHour = Number(hour[0][0]?.hour);

            const employeeData = await pool.query(SQL);
            const Document = await pool.query(getDocuments);
            const bankDetail = await pool.query(getBankDetail);
            const Allowances = await pool.query(getAllowance);
            const overtimeHours = workingHour > 200 ? workingHour - 200 : 0
            return {
                ...employeeData[0][0],
                employeeBankDetails: bankDetail[0][0],
                employeeAllowances: Allowances[0],
                employeeDocuments: Document[0],
                graph,
                projectCount,
                workingHour,
                overtimeHours
            }
        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const employeeLogin = async (request) => {
const data=request.body;
    try {

        const SQL = `SELECT * FROM users WHERE email="${data.email}" `;
        const emp = `SELECT id,email,fName,lName,profileImage FROM employees WHERE email="${data.email}"`;
        const employee = await pool.query(emp);
        const user = await pool.query(SQL);
        if (user[0].length == 0) {
            return 'Invalid Credentials';
        } else {
            const { id, empId, email, password } = user[0][0];
            if (password == data.password && email == data.email) {
                const getAccess = `SELECT * FROM accessManagement WHERE empId="${empId}"`;
                const result = await pool.query(getAccess);
                const token = JWT.sign({ email: data.email, password: data.password, empId: empId }, JWT_SECRET, { algorithm: 'HS256' }, {
                    expiresIn: '30d',
                });
                return {
                    accessManagement: result[0][0],
                    employee: {
                        ...employee[0][0],
                        token: token
                    }
                };
            } else {
                return 'Invalid Credentials';
            }
        }
    } catch (error) {
        return error;
    }
}

const verifyEmployeeToken = async (request) => {
    const { token } = request.body;
    try {
        const isVerified = JWT.verify(token, JWT_SECRET);

        if (isVerified) {
            const emp = `SELECT id,email,fName,lName,profileImage FROM employees WHERE email="${isVerified.email}"`;
            const getAccess = `SELECT * FROM accessManagement WHERE empId="${isVerified.empId}"`;
            const employee = await pool.query(emp);
            const accessManagement = await pool.query(getAccess);
            return {
                accessManagement: accessManagement[0][0],
                employee: {
                    ...employee[0][0],
                    token: token
                }
            }
        }
        else {
            return { token: false }
        }
    } catch (error) {
        return { token: false };
    }
}

const updateAccessManagement = async (request) => {
    const { authorization } = request.headers;
    const { empId } = request.body;
    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const SQL = `UPDATE accessManagement SET ?  WHERE empId=${empId}`;

            const query = await pool.query(SQL, [request.body]);
            const updatedAM = `SELECT * FROM accessManagement WHERE empId=${empId}`;
            const result = await pool.query(updatedAM);
            return result[0];
        } catch (error) {
            return JSON.stringify(error);

        }
    }
    else {
        return "Invalid token";
    }
}

const getAccessManagement = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const { page, result_size, search, module } = request.query;
            const start = (page * result_size) - result_size;
            const end = result_size;
            const SQL = `
        SELECT emp1.id AS empId, CONCAT(emp1.fName, " ", emp1.lName) AS name, emp1.profileImage ,designation.name AS designation,${module != 'dashboard' ? `am.${module}Action,` : ""}  am.${module}Read
        FROM employees emp1
        LEFT JOIN designation  ON emp1.jobTitle = designation.id
        LEFT JOIN accessManagement am   ON emp1.id = am.empId WHERE emp1.isActive="true"
        ${search ? `AND emp1.fName LIKE "%${search}%" OR emp1.lName LIKE "%${search}%" OR (CONCAT(emp1.fName," ",emp1.lName)="${search}")` : ""}
        LIMIT ${start}, ${end};
      `;
            const getCount = ` SELECT emp1.id AS empId, CONCAT(emp1.fName, " ", emp1.lName) AS name, designation.name AS designation,  am.${module}Read
      FROM employees emp1
      LEFT JOIN designation  ON emp1.jobTitle = designation.id
      LEFT JOIN accessManagement am   ON emp1.id = am.empId WHERE emp1.isActive="true"
      ${search ? `AND emp1.fName LIKE "%${search}%" OR emp1.lName LIKE "%${search}%"` : ""}`;

            const accessCount = await pool.query(getCount);

            const empData = await pool.query(SQL);
            const finalResult = empData[0].map((e) => {
                const read = `${module}Read`;
                const action = `${module}Action`;

                return { empId: e.empId, designation: e.designation, name: e.name, profileImage: e.profileImage, read: { fieldName: read, value: e[read] }, action: { fieldName: action, value: e[action] } }
            })
            return { result: finalResult, count: accessCount[0].length };

        } catch (error) {
            return JSON.stringify(error);
        }
    }
    else {
        return "Invalid token";
    }
}

const updateProfileImage = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const { empId, profileImage } = request.body;
            const SQL = `UPDATE employees SET profileImage="${profileImage}" WHERE id=${empId}`;
            await pool.query(SQL);
            const getQuery = `SELECT * FROM employees WHERE id=${empId}`;
            const response = await pool.query(getQuery);
            return { ...response[0][0] };
        } catch (error) {
            return `Error ${error}`;
        }
    }
    else {
        return "Invalid Token";
    }
}

const employeeOffBoarding = async (request) => {
    const { authorization } = request.headers;

    const isVerified = JWT.verify(authorization, JWT_SECRET);
    if (isVerified) {
        try {
            const { empId, employeeDocuments, reason } = request.body;
            const employeeQuery = `UPDATE employees SET isActive ="false" WHERE id=${empId}`;
            await pool.query(employeeQuery);

            employeeDocuments.forEach(async (e) => {
                const SQL = `INSERT INTO employeeDocuments (empId,documentLink,documentName,createdAt,updatedAt) values("${empId}","${e.documentLink}","${e.documentName}","${createdAt}","${updatedAt}")`;
                await pool.query(SQL);
            })
            const getoffboard = `INSERT INTO employeeOffBoarding (empId,reason ,createdAt,updatedAt) VALUES(${empId},"${reason}","${createdAt}","${updatedAt}")`;
            const emp = await pool.query(getoffboard);
            const offData = `SELECT * FROM employeeOffBoarding WHERE id=${emp[0].insertId} `;
            const res = await pool.query(offData);;
            return { ...res[0][0] };
        } catch (error) {
            return `Error : ${error}`;
        }
    }
    else {
        return "Invalid token";
    }
}

module.exports = { employeeOffBoarding, updateProfileImage, getAccessManagement, verifyEmployeeToken, updateAccessManagement, getSelectEmployeeByDurationType, employeeLogin, getEmployeesById, getSelectEmployees, createEmployees, updateEmployees, deleteEmployees, getEmployees };