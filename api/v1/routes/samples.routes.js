import express from "express";
import { listFilesController } from "../controllers/samples.controller.js";

const router = express.Router();

// File operations
router.get("/list", listFilesController);


export default router;
