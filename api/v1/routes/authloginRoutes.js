import express from "express";
import jwt from "jsonwebtoken";
import db from "../../config/database.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body", req.body);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const user = rows[0];

    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    await db.query(
      "UPDATE users SET lastlogin = NOW() WHERE id = ?",
      [user.id]
    );


    const token = jwt.sign(
      { userId: user.id, name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [req.user.userId]   
    );

    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

export default router;
