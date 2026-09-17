import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js"; // NEW
import { protect } from "./middleware/authMiddleware.js"; // NEW

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Debug logger
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// --- ROUTES ---
app.use("/api/auth", authRoutes); // NEW
app.use("/api/projects", protect, projectRoutes); // ADDED "protect"
app.use("/api", protect, taskRoutes); // ADDED "protect"

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
