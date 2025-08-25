import express from "express";
import bcrypt from "bcrypt";
import User from "../../models/User.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
