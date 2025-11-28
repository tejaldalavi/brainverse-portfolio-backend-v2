import express from "express";
import { 
    listFilesController, 
    getFileController,

} from "../controllers/samples.controller.js";

const router = express.Router();

// File operations
router.get("/list", listFilesController);
router.get("/file", getFileController);


export default router;
