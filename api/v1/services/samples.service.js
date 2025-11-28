import ftp from "basic-ftp";
// import db from "../config/db.js";
import axios from "axios";
// import dotenv from "dotenv";
import FormData from "form-data";
import { Readable } from "stream";

export const createFtpClient = async () => {
  const client = new ftp.Client(30000);
  client.ftp.verbose = true;
  try {
    await client.access({
      host: process.env.FTP_HOST,
      port: process.env.FTP_PORT ? Number(process.env.FTP_PORT) : 21,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false,
      secureOptions: undefined,
    });
    client.ftp.passive = true;
    return client;
  } catch (err) {
    throw new Error("FTP connection failed: " + err.message);
  }
};

export const listFiles = async () => {
  const client = await createFtpClient();
  try {
    const root = process.env.FTP_ROOT || "/";
    await client.cd(root);
    const list = await client.list(root);
    await client.close();
    return list.map((file) => ({
      name: file.name,
      type: file.isDirectory ? "directory" : "file",
      size: file.size,
      modifiedAt: file.modifiedAt,
    }));
  } catch (err) {
    await client.close();
    throw new Error("Failed to list files: " + err.message);
  }
};

/** Get details for files within a given path (relative to root) */
export const getFileDetails = async (pathRelativeToRoot) => {
  const client = await createFtpClient();
  try {
    const root = process.env.FTP_ROOT || "/";
    await client.ensureDir(root);
    const files = await client.list(`${pathRelativeToRoot}`);
    await client.close();
    return files;
  } catch (err) {
    await client.close();
    throw new Error("Error getting file info: " + err.message);
  }
};

/**
 * Upload a file buffer to FTP.
 * @param {Express.Multer.File} file - from memoryStorage (has .buffer, .originalname, .mimetype)
 * @param {string} remoteFileName - final filename on FTP (e.g., "my.zip")
 * @param {string} folder - subfolder under FTP_ROOT (default: "zip")
 */
export const uploadFile = async (file, remoteFileName, folder = "zip") => {
  const client = await createFtpClient();
  try {
    const root = process.env.FTP_ROOT || ""; 
    const targetFolder = `${root}/${folder}`;

    console.log("Ensuring folder:", targetFolder);

    // create folder if not exists
    await client.ensureDir(targetFolder);

    // list files in folder
    const existing = await client.list(targetFolder);

    if (existing.some(f => f.name === remoteFileName)) {
      throw new Error("File already exists on the server");
    }

    // upload buffer
    await client.uploadFrom(
      Readable.from(file.buffer),
      `${targetFolder}/${remoteFileName}`
    );

    return {
      success: true,
      message: "File uploaded successfully",
      file: `${folder}/${remoteFileName}`,
    };
  } catch (err) {
    throw new Error("Upload failed: " + err.message);
  } finally {
    client.close();
  }
};

/** Delete a file or directory under FTP_ROOT/zip */
export const deleteFile = async (filename) => {
  const client = await createFtpClient();
  try {
    const root = process.env.FTP_ROOT || "/";
    const remotePath = `${root}/zip/${filename}`.replace(/\/{2,}/g, "/");
    // Try deleting as file first; fallback to directory
    await client.remove(remotePath).catch(async () => {
      await client.removeDir(remotePath);
    });
    await client.close();
    return { success: true, message: "Deleted successfully" };
  } catch (err) {
    await client.close();
    throw new Error("Delete failed: " + err.message);
  }
};

/** Call your remote PHP unzipper to extract a zip already present on FTP */
export const extractZip = async (zipName) => {
  try {
    const phpUrl = process.env.EXTRACT_PHP_URL;
    const form = new FormData();
    form.append("zipName", zipName); // e.g., "my.zip"
    const response = await axios.post(phpUrl, form, { headers: form.getHeaders() });
    return response.data;
  } catch (err) {
    throw new Error("Extraction failed: " + err.message);
  }
};

/**
 * Upload a buffer and then trigger extraction on remote (zipName = remoteFileName)
 * @param {Express.Multer.File} file
 * @param {string} remoteFileName - must end with .zip for extraction to work
 * @param {string} folder - default "zip"
 */
export const uploadAndExtract = async (file, remoteFileName, folder = "zip") => {
  if (!/\.zip$/i.test(remoteFileName)) {
    throw new Error("uploadAndExtract expects a .zip file name");
  }

  const uploadResult = await uploadFile(file, remoteFileName, folder);
  const extractResult = await extractZip(remoteFileName); // your PHP expects just the filename
  const deleteResult = await deleteFile(remoteFileName);
  return { upload: uploadResult, extract: extractResult, deletedZip: deleteResult, };
};

