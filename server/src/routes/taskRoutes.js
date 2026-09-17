import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// Note: This route will be mounted under /api/projects/:projectId/tasks in index.js
router.route("/:projectId/tasks").get(getTasks);

// Standard task routes
router.route("/tasks").post(createTask);
router.route("/tasks/:id").put(updateTask).delete(deleteTask);

export default router;
