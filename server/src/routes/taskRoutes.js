import express from "express";
import {
  getAllTasks,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = express.Router();

// 1. Get ALL tasks (NEW)
router.route("/tasks").get(getAllTasks).post(createTask);

// 2. Get tasks for a specific project (Existing Week 1 route)
router.route("/:projectId/tasks").get(getTasks);

// 3. Update and Delete tasks (Existing Week 1 routes)
router.route("/tasks/:id").put(updateTask).delete(deleteTask);

export default router;
