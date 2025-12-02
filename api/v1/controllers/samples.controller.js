import { 
  listFiles, 
  getFileDetails, 
  uploadFile,
  deleteFile,
  extractZip,
  uploadAndExtract,
  uploadToFTP,
  deleteFromFTP,
  createSample,
  getAllAdminSamples,
  deletecreatesample,
  updatesampledisplay,
  getUserSamples,
  createUsers,
  getAllUsers,
  deleteUser,
  updateUser,
} from "../services/samples.service.js";

// Base URL for constructing public links if needed
const BASE_PUBLIC_URL = process.env.SAMPLES_BASE_URL || "https://ecornertech.com/samples";

export const listFilesController = async (_req, res) => {
  try {
    const files = await listFiles();

    // Optionally, attach absolute URLs to files
    const filesWithUrls = files.map(file => ({
      ...file,
      url: `${BASE_PUBLIC_URL}/${file.name}`
    }));

    res.status(200).json({ success: true, files: filesWithUrls });
  } catch (err) {
    console.error("FTP listFilesController error:", err); // log to Vercel logs
    res.status(500).json({
      success: false,
      error: err.message || "Failed to fetch files from FTP server"
    });
  }
};

export const getFileController = async (req, res) => {
  try {
    const filename = req.query.name;
    if (!filename) throw new Error("Missing file name");
    const file = await getFileDetails(filename);
    res.json(file);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload a file (buffer) to FTP into "zip/" (or any folder you pass)
export const uploadController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    // buffer-based upload (no disk)
    const result = await uploadFile(file, file.originalname, "zip");
    // result.file is the remote path like "zip/filename.ext"

    res.json({
      success: true,
      message: "File uploaded successfully",
      path: result.file,
      url: `${BASE_PUBLIC_URL}/${result.file}`.replace(/\/{2,}/g, "/")
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteController = async (req, res) => {
  try {
    const filename = req.query.name;
    if (!filename) throw new Error("Missing file name");
    const result = await deleteFile(filename);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const extractController = async (req, res) => {
  try {
    const { zipName } = req.body;
    if (!zipName) throw new Error("Missing zipName");

    const result = await extractZip(zipName);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Upload a .zip (buffer) → trigger remote extract → list extracted files
export const uploadAndExtractController = async (req, res) => {
  try {
    const file = req.file;
    if (!file) throw new Error("No file uploaded");

    // Upload buffer then extract remotely (.zip required)
    const result = await uploadAndExtract(file, file.originalname, "zip");

    // After extraction, list extracted files under zip/<folderName>
    const folderName = file.originalname.replace(/\.zip$/i, "");
    const allFiles = await getFileDetails(`zip/${folderName}`);
    // basic-ftp returns type 1 for files; if your shape differs, adjust filter:
    const filteredFiles = (allFiles || []).filter((f) => f.type === 1);

    const filesWithUrl = filteredFiles.map((f) => {
      const rel = `zip/${folderName}/${f.name}`;
      return {
        name: f.name,
        size: f.size,
        path: rel,
        url: `${BASE_PUBLIC_URL}/${rel}`.replace(/\/{2,}/g, "/")
      };
    });

    res.json({
      success: true,
      message: "Uploaded → Extracted → ZIP Deleted → Files listed",
      upload: result.upload,
      extract: result.extract,
      deletedZip: result.deletedZip,
      files: filesWithUrl
    });
  } catch (err) {
    console.error("Upload and extract error:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Something went wrong during upload/extract"
    });
  }
};

// Simple generic upload to any folder (buffer-based)
export const uploadFileController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const folder = req.body?.folder || "uploads";
    const data = await uploadToFTP(req.file, folder);

    res.json({
      success: true,
      message: "File uploaded successfully",
      path: data.path,
      url: `${BASE_PUBLIC_URL}/${data.path}`.replace(/\/{2,}/g, "/")
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload file", details: err.message });
  }
};

// Delete a single thumbnail file on FTP
export const deleteThumbnailController = async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) {
      return res.status(400).json({ error: "Thumbnail path is required" });
    }
    const result = await deleteFromFTP({ path, type: "file" });

    res.json({
      success: true,
      message: "Thumbnail deleted successfully",
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete thumbnail", details: err.message });
  }
};

// Video upload: buffer → FTP/videos
export const uploadVideoController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded" });
    }

    const folder = "videos";
    const data = await uploadToFTP(req.file, folder);

    res.json({
      success: true,
      message: "Video uploaded successfully",
      path: data.path,
      url: `${BASE_PUBLIC_URL}/${data.path}`.replace(/\/{2,}/g, "/")
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to upload video", details: err.message });
  }
};

// Delete a single video file on FTP
export const deleteVideoController = async (req, res) => {
  try {
    const { path } = req.query; // expect ?path=videos/12345-name.mp4
    if (!path) return res.status(400).json({ error: "Video path is required" });

    const result = await deleteFromFTP({ path, type: "file" });
    res.json({
      success: true,
      message: "Video deleted successfully",
      ...result
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete video", details: err.message });
  }
};

// Delete any file or directory — expects JSON: { path, type: "file"|"dir" }
export const deleteFileController = async (req, res) => {
  try {
    const { path, type } = req.body || {};
    if (!path || !type) {
      return res.status(400).json({ error: "Body must include { path, type }" });
    }

    const result = await deleteFromFTP({ path, type });
    return res.json({
      success: true,
      message: type === "dir" ? "Folder deleted successfully" : "File deleted successfully",
      ...result
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to delete",
      details: err.message
    });
  }
};

// -------------------- Samples --------------------

export const createSampleController = async (req, res) => {
  try {
    const { sampleType, category, thumbnail, fileUrl, display } = req.body;
    const result = await createSample({ sampleType, category, thumbnail, fileUrl, display });

    res.status(200).json({
      success: true,
      message: "Sample saved successfully",
      saved: result
    });
  } catch (err) {
    console.error("Create Sample Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save sample",
      error: err.message
    });
  }
};

export const getAllAdminSamplesController = async (_req, res) => {
  try {
    const files = await getAllAdminSamples();
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletecreatesampleController = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await deletecreatesample(id);

    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updatesampledisplayController = async (req, res) => {
  try {
    const { id, display } = req.body || {};
    const result = await updatesampledisplay({ id, display });
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getUserSamplesController = async (_req, res) => {
  try {
    const files = await getUserSamples();
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// -------------------- Users --------------------

export const createUsersController = async (req, res) => {
  try {
    const { name, email, password, createdAt, lastlogin } = req.body;
    const result = await createUsers({ name, email, password, createdAt, lastlogin });

    res.status(200).json({
      success: true,
      message: "User saved successfully",
      saved: result
    });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save user",
      error: err.message
    });
  }
};

export const getAllUsersController = async (_req, res) => {
  try {
    const user = await getAllUsers();
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteUser(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserController = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    if (!name && !email && !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one field to update"
      });
    }

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (email) fieldsToUpdate.email = email;
    if (password) fieldsToUpdate.password = password;

    const result = await updateUser(userId, fieldsToUpdate);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User updated successfully" });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ success: false, message: "Error updating user" });
  }
};