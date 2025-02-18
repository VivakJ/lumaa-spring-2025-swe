const express = require("express");
const router = express.Router();
const taskModel = require("../models/taskModel");
const authenticateToken = require("../middleware/authMiddleware");

//get all the tasks
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.json(tasks);
  } catch(error) {
    res.status(500).json({ error: "Error fetching tasks" });
  }
});

//create a new task
router.post("/", authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  if(!title) return res.status(400).json({ error: "Title is required" });

  try {
    const task = await taskModel.createTask(title, description || "");
    console.log(task);
    res.status(201).json(task);
  } catch(error) {
    res.status(500).json({ error: "Error creating task" });
  }
});

//update the task with the id
router.put("/:id", authenticateToken, async (req, res) => {
  const { title, description, isComplete } = req.body;
  const { id } = req.params;

  try {
    const updatedTask = await taskModel.updateTask(id, title, description, isComplete);
    if(!updatedTask) return res.status(404).json({ error: "Task not found" });

    res.json(updatedTask);
  } catch(error) {
    res.status(500).json({ error: "Error updating task" });
  }
});

//delete a task with the id
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await taskModel.deleteTask(id);
    res.json(result);
  } catch(error) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;
