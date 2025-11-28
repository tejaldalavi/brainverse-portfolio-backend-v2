import { 
  listFiles, 
  getFileDetails, 

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