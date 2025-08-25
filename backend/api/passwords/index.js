import express from "express";
import Password from "../../models/Password.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const passwords = await Password.find({ userId });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new password
router.post("/", async (req, res) => {
  const { userId, description, password } = req.body;
  if (!userId || !description || !password) {
    return res.status(400).json({ message: "userId, description and password are required" });
  }

  try {
    const newPassword = new Password({ userId, description, password });
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
