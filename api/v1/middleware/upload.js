import multer from "multer";

// Store in memory — perfect for small files like thumbnails
const storage = multer.memoryStorage();

export const memoryUpload = multer({ storage: multer.memoryStorage() });
