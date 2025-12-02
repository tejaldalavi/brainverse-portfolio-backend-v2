import pkg from "jsonwebtoken";
const { verify } = pkg;

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const JWT_SECRET = process.env.JWT_SECRET;

    const decoded = verify(token, JWT_SECRET);

    req.user = decoded;   

    next();
  } catch (err) {
    console.error("TOKEN ERROR:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
};
