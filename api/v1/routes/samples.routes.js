import express from "express";
import { 
    listFilesController, 
    getFileController,
    uploadController,
    deleteController,
    extractController,
    uploadAndExtractController,
    uploadFileController,
    deleteThumbnailController,
    uploadVideoController,
    deleteVideoController,
    deleteFileController,
    createSampleController,
    getAllAdminSamplesController,
    deletecreatesampleController,
    updatesampledisplayController,
    getUserSamplesController,
    createUsersController,
    getAllUsersController,
    deleteUserController,
    updateUserController,
} from "../controllers/samples.controller.js";

import { verifyToken, isAdmin } from "../middleware/authMiddleware.js";
import { memoryUpload } from "../middleware/upload.js"; // uses multer.memoryStorage()

const router = express.Router();

import ftp from "basic-ftp";
router.get("/ftp-root-test", async (req, res) => {
  const client = new ftp.Client();

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
    });

    const list = await client.list("/");
    res.json({ rootList: list });

  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.close();
  }
});

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
// already memory-based 👍
router.post("/upload-file", memoryUpload.single("file"), uploadFileController);
// thumbs
router.delete("/delete-thumbnail", deleteThumbnailController, (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file deleted" });
  res.status(200).json({ message: "Thumbnail deleted" });
});
// videos
router.post(
  "/upload-video",
  memoryUpload.single("video"),
  uploadVideoController,
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    res.status(200).json({ message: "Video uploaded" });
  }
);
router.delete("/delete-video", deleteVideoController, (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file deleted" });
  res.status(200).json({ message: "Video deleted" });
});

// bulk delete
router.post("/delete-files", deleteFileController);

//create samples
router.post("/create-sample", verifyToken, isAdmin, createSampleController);
router.get(
  "/get-admin-samples",
  verifyToken,
  isAdmin,
  getAllAdminSamplesController
);
router.get("/get-user-samples", getUserSamplesController);
router.delete("/samples/:id", deletecreatesampleController);
router.put("/update-sample-display/", updatesampledisplayController);

//create users
router.post("/create-user", verifyToken, isAdmin, createUsersController);
router.get("/get-users", verifyToken, isAdmin, getAllUsersController);
router.delete("/users/:id", deleteUserController);
router.put("/update/:id", verifyToken, updateUserController);

// misc
// router.get("/", verifyToken, getUserSamplesController);
// // router.get("/", (req, res) => res.json({ message: "Welcome User" }));

export default router;
