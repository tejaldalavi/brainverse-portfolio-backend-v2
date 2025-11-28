import ftp from "basic-ftp";

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

