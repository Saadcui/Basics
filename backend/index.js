import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import signupRoute from "./api/auth/signup.js";
import loginRoute from "./api/auth/login.js";
import passwordRoutes from "./api/passwords/index.js";
import deletePasswordRoute from "./api/passwords/[id].js";

dotenv.config();

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());

if (process.env.MONGO_URI) {
  connectDB();
} else {
  console.error("MONGO_URI not found in environment variables");
}

// Routes
app.get("/", (req, res) => res.send("API is running..."));
app.use("/api/auth/signup", signupRoute);
app.use("/api/auth/login", loginRoute);
app.use("/api/passwords", passwordRoutes);
app.use("/api/passwords", deletePasswordRoute); // Handles DELETE /passwords/:id

app.use((req, res) => {
  console.log(`Unknown route: ${req.method} ${req.originalUrl}`);
  res.status(404).send("Route not found");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
