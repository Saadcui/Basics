import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Password from "./models/Password.js";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

// Signup
app.post("/api/auth/signup", async (req, res) => {
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

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get Passwords by userId (via query param)
app.get("/passwords", async (req, res) => {
  const { userId } = req.query;

  if (!userId) return res.status(400).json({ error: "userId is required" });

  try {
    const passwords = await Password.find({ userId });
    res.json(passwords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add Password
app.post("/passwords", async (req, res) => {
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

// Delete Password by ID
app.delete("/passwords/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
