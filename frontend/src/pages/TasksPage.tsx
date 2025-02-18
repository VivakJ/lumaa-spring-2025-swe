import { useEffect, useState } from "react";
import axios from "axios";

//this is the task page where it shows all the tasks in the management
const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [updateTitle, setUpdateTitle] = useState<string>("");
  const [updateDescription, setUpdateDescription] = useState<string>("");
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  //get the tasks when loaded in
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get("http://localhost:5000/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch(error) {
        console.error("Error fetching tasks", error);
      }
    };
    fetchTasks();
  }, []);

  //create a new task
  const handleCreateTask = async () => {
    if(!title) return; //ensure that the title is not empty. Should also return a warning
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/tasks",
        { title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      setTasks((prevTasks) => [...prevTasks, response.data]);
      setTitle("");
      setDescription("");
    } catch(error) {
      console.error("Error creating task", error);
    }
  };

  //update a task
  const handleUpdateTask = async (id: number, task: any) => {
    console.log(updateTitle);
    if(!updateTitle) return; //also should return a warning here too
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { title: updateTitle, description: updateDescription, isComplete: task.iscomplete }, // Assuming isComplete is false for update
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, title: updateTitle, description: updateDescription } : task
        )
      );
      setEditingTaskId(null);
      setTitle("");
      setDescription("");
      setUpdateDescription("");
      setUpdateTitle("");
    } catch(error) {
      console.error("Error updating task", error);
    }
  };

  //delete a task
  const handleDeleteTask = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch(error) {
      console.error("Error deleting task", error);
    }
  };

  const handleToggleComplete = async (id: number, task: any) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { title: task.title, description: task.description, isComplete: !task.iscomplete }, // Pass current `isComplete` value
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, iscomplete: !task.iscomplete } : task
        )
      );
  
    } catch(error) {
      console.error("Error updating task", error);
    }
  };
  
  
  return (
    <div>
      <h2>Tasks</h2>

      {/* Task Creation Form */}
      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleCreateTask}>Create Task</button>
      </div>

      {/* Task List */}
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <>
                <input
                  type="text"
                  value={updateTitle}
                  onChange={(e) => setUpdateTitle(e.target.value)}
                />
                <textarea
                  value={updateDescription}
                  onChange={(e) => setUpdateDescription(e.target.value)}
                />
                <button onClick={() => handleUpdateTask(task.id, task)}>Save</button>
                <button onClick={() => setEditingTaskId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <input type="checkbox" checked={task.iscomplete} onChange={() => handleToggleComplete(task.id, task)}/> <strong>{task.title}</strong>
                <p>{task.description}</p>
                <button onClick={() => setEditingTaskId(task.id)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  );
};

export default TasksPage;