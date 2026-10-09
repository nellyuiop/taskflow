import express from "express";
import {
  getPublicProjects,
  getPublicTasks,
} from "../controllers/publicController.js";

const router = express.Router();

router.get("/projects", getPublicProjects);
router.get("/tasks", getPublicTasks);

export default router;
