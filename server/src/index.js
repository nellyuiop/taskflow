import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// 1. Load environment var
dotenv.config();

// 2. Initialize Express
const app = express();

// 3. to read JSON data and accept requests
app.use(cors());
app.use(express.json());

// 4. basic test route
app.get("/", (req, res) => {
  res.send("TaskFlow API is running!");
});

// 5. Connect to MongoDB and Start the Server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("❌ Error connecting to MongoDB:", error.message);
  });
