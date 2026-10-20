import Project from "../models/Project.js";
import Task from "../models/Task.js";

// @desc    Get all projects (Public - no login required)
// @route   GET /api/public/projects
export const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find().select("name description createdAt");
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get all tasks (Public - no login required)
// @route   GET /api/public/tasks
export const getPublicTasks = async (req, res) => {
  try {
    const tasks = await Task.find().select(
      "title description status projectId",
    );
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
// @route   GET /api/public/projects/:id
export const getPublicProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
