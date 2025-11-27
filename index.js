const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("express-error-handler");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));

var whitelist = ['http://localhost:5173',"http://127.0.0.1:5173/", "http://localhost:3306", "https://ecorner-admin-frontend.vercel.app", "https://bold-moon-180173.postman.co/", "http://portal.ecornertech.com, https://brainverse-portfolio-backend-v2-qlvxf7ffo.vercel.app/"]
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

// const testRoutes = require('./api/v1/routes/test.routes');
// app.use(testRoutes);

const sampleRoutes = require('./api/v1/routes/samples.routes')
app.use("/", sampleRoutes);


app.listen("3306", () => {
    console.info(`Server listening at 3306 `);
});