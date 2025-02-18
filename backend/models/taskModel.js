const pool = require("../config/db");

async function createTaskTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      isComplete BOOLEAN DEFAULT false,
      userId INTEGER REFERENCES users(id) ON DELETE CASCADE
    )
  `);
}

createTaskTable().catch(console.error);

module.exports = {
  //get tasks
  async getAllTasks() {
    const result = await pool.query("SELECT * FROM tasks");
    return result.rows;
  },

  //get id task
  async getTaskById(id) {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1", [id]);
    return result.rows[0];
  },

  //make new task
  async createTask(title, description, userId) {
    const result = await pool.query(
      "INSERT INTO tasks (title, description, userId) VALUES ($1, $2, $3) RETURNING *",
      [title, description, userId] //this is $1 $2 $3
    );
    return result.rows[0];
  },

  //update task function
  async updateTask(id, title, description, isComplete) {
    const result = await pool.query(
      "UPDATE tasks SET title = $1, description = $2, isComplete = $3 WHERE id = $4 RETURNING *",
      [title, description, isComplete, id]
    );
    return result.rows[0];
  },

  //delete a task with an id
  async deleteTask(id) {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 RETURNING id", [id]);
    return result.rows[0];
  },
};
