import express from "express";
import morgan from "morgan";
import cors from "cors";
import errorHandler from "express-error-handler";

const app = express();

app.use(express.json());
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: true }));

var whitelist = [
    "http://localhost:5173",
    "http://127.0.0.1:5173/",
    "http://localhost:3306",
    "http://localhost:3307",
    "https://ecorner-admin-frontend.vercel.app",
    "https://bold-moon-180173.postman.co/",
    "https://brainverse-portfolio-backend-v2.vercel.app"
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (whitelist.indexOf(origin) === -1) {
                const msg =
                    "The CORS policy for this site does not allow access from the specified Origin.";
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
    })
);

import sampleRoutes from "./api/v1/routes/samples.routes.js";
app.use("/ftp", sampleRoutes);

app.listen("3307", () => {
    console.info(`Server listening at 3307`);
});
