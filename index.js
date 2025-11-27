const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("express-error-handler");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));

var whitelist = ['http://localhost:5173',"http://127.0.0.1:5173/", "http://localhost:3306", "https://ecorner-admin-frontend.vercel.app", "https://bold-moon-180173.postman.co/", "http://portal.ecornertech.com"]
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (whitelist.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not " +
                    "allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);

const testRoutes = require('./api/v1/routes/test.routes');
app.use(testRoutes);

const allowanceRoutes = require('./api/v1/routes/allowance.routes')
app.use("/api/v1/employee/payroll-items/allowances", allowanceRoutes);

const deductionRoutes = require('./api/v1/routes/deduction.routes');
app.use("/api/v1/employee/payroll-items/deductions", deductionRoutes)

const overtimeRoutes = require("./api/v1/routes/overtime.routes");
app.use("/api/v1/employee/payroll-items/overtime", overtimeRoutes);

const departmentsRoutes = require("./api/v1/routes/departments.routes");
app.use("/api/v1/employee/department", departmentsRoutes)

const designationRoutes = require('./api/v1/routes/designation.routes');
app.use("/api/v1/employee/designation", designationRoutes);

const employeeRoutes = require("./api/v1/routes/employees.routes");
app.use("/api/v1/employee/employees", employeeRoutes);

const clientRoutes = require("./api/v1/routes/clients.routes");
app.use("/api/v1/projects/client", clientRoutes);

const employeeBankDetailRoute = require("./api/v1/routes/employeeBankDetails.routes");
app.use("/api/v1/employee/employee-bank-details", employeeBankDetailRoute)

const employeeAllowanceRoutes = require("./api/v1/routes/employeeAllowance.routes");
app.use("/api/v1/employee/employee-allowance", employeeAllowanceRoutes);

const employeeDocumentRoutes = require("./api/v1/routes/employeeDocument.routes");
app.use("/api/v1/employee/employee-document", employeeDocumentRoutes);

const clientContactRoutes = require("./api/v1/routes/clientContact.routes");
app.use("/api/v1/project/client/client-contact", clientContactRoutes);

const clientDocumentRoutes = require("./api/v1/routes/clientDocuments.routes");
app.use("/api/v1/projects/client/client-document", clientDocumentRoutes);

const projectsRoutes = require("./api/v1/routes/projects.routes");
app.use("/api/v1/projects", projectsRoutes);

const invoiceRoutes = require("./api/v1/routes/invoices.routes");
app.use("/api/v1/projects/invoices", invoiceRoutes);

const countryCityRoutes = require("./api/v1/routes/countryStatecity.routes");
app.use("/api/v1/country-city-state", countryCityRoutes);

const holidayRoutes = require("./api/v1/routes/holiday.routes");
app.use("/api/v1/holiday", holidayRoutes);

const leavesRoutes = require("./api/v1/routes/leaves.routes");
app.use("/api/v1/leaves", leavesRoutes);

const taskRoutes = require("./api/v1/routes/task.routes");
app.use("/api/v1/task", taskRoutes);

const salaryRoutes=require("./api/v1/routes/salary.routes");
app.use("/api/v1/employee/salary",salaryRoutes);

app.listen("3306", () => {
    console.info(`Server listening at 3306 `);
});