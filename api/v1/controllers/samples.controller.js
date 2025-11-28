import { 
  listFiles, 
  getFileDetails, 
  uploadFile,
  deleteFile,
  extractZip,
  uploadAndExtract,
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