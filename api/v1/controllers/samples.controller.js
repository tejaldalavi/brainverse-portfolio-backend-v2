import {
  listFiles,
} from "../services/samples.service.js";

// If you want to expose absolute URLs for returned FTP paths, set a base here:
const BASE_PUBLIC_URL = process.env.SAMPLES_BASE_URL || "https://ecornertech.com/samples";

export const listFilesController = async (_req, res) => {
  try {
    const files = await listFiles();
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};