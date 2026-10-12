import express from "express";
import {
  getPublicProjects,
  getPublicTasks,
  getPublicProjectById,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/projects", getPublicProjects);
router.get("/projects/:id", getPublicProjectById); // <-- NEW
router.get("/tasks", getPublicTasks);

export default router;
