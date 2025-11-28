import express from "express";
import { 
    listFilesController, 
    getFileController,
    uploadController,
} from "../controllers/samples.controller.js";

import { memoryUpload } from "../middleware/upload.js"; // uses multer.memoryStorage()

const router = express.Router();

// File operations
router.get("/list", listFilesController);
router.get("/file", getFileController);
//was: upload.single("file")
router.post("/upload", memoryUpload.single("file"), uploadController);


export default router;
