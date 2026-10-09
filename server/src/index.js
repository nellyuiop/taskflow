import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import publicRoutes from "./routes/publicRoutes.js"; // <-- NEW
import { protect } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// --- PUBLIC ROUTES (No token required) ---
app.use("/api/public", publicRoutes); // <-- NEW

// --- PROTECTED ROUTES (Token required) ---
app.use("/api/auth", authRoutes);
app.use("/api/projects", protect, projectRoutes);
app.use("/api", protect, taskRoutes);

app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) =>
    console.log("❌ Error connecting to MongoDB:", error.message),
  );
