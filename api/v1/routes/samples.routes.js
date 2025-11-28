import express from "express";
import { 
    listFilesController, 
    getFileController,
    uploadController,
    deleteController,
    extractController,
    uploadAndExtractController,
} from "../controllers/samples.controller.js";

import { memoryUpload } from "../middleware/upload.js"; // uses multer.memoryStorage()

const router = express.Router();

// File operations
router.get("/list", listFilesController);
router.get("/file", getFileController);
//was: upload.single("file")
router.post("/upload", memoryUpload.single("file"), uploadController);
router.delete("/delete", deleteController, (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file deleted" });
  res.status(200).json({ message: "file deleted" });
});
// extract
router.post("/extract", extractController);
// ⬇️ was: upload.single("file")
router.post(
  "/upload-extract",
  memoryUpload.single("file"),
  uploadAndExtractController,
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res
      .status(200)
      .json({
        message: "upload+extract done",
        filename: req.file.originalname,
      });
  }
);

export default router;
