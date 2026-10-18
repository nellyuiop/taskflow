import Project from "../models/Project.js";
import Task from "../models/Task.js";

// @desc    Get all projects
// @route   GET /api/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await Project.create({ name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: "Invalid project data" });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Delete a project and all its tasks
// @route   DELETE /api/projects/:id
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // 1. Delete all tasks that belong to this project
    await Task.deleteMany({ projectId: req.params.id });

    // 2. Delete the project itself
    await Project.findByIdAndDelete(req.params.id);

    res
      .status(200)
      .json({ message: "Project and associated tasks deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
