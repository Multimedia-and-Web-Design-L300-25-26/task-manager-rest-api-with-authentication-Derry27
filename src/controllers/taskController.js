import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      description: req.body.description,
      owner: req.user._id, // Attach owner from auth middleware
    })
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  }
  catch (error) {
    res.status(500).json({ message: "Error creating task", error });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.json(tasks);
  }
  catch (error) {
    res.status(500).json({ message: "Error returning tasks", error });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  }
  catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};
