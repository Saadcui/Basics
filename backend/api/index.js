import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import serverless from "serverless-http"; 

import bcrypt from "bcrypt";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Password from "./models/Password.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(bodyParser.json());

if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.error("MONGO_URI not found in environment variables");
}


// Signup
app.get("/api/", (req, res) => {
  res.send("API is running...");
});

app.post("/api/signup", async (req, res) => {
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
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Logina
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid email or password" });

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

// Get Passwords by userId
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
    return res
      .status(400)
      .json({ message: "userId, description and password are required" });
  }

  try {
    const newPassword = new Password({ userId, description, password });
    await newPassword.save();
    res.status(201).json(newPassword);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Password
app.delete("/passwords/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



app.use((req, res) => {
  console.log(`Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route not found');
});



export default serverless(app);
