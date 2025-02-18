const pool = require("../config/db");

//create the user table which stores username and passwords
const createUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);
};

//add a user and put them into the table
const insertUser = async (username, password) => {
  const result = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, password]
  );
  return result.rows[0];
};

//find a user from a table with the username
const findUserByUsername = async (username) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0];
};

module.exports = { createUserTable, insertUser, findUserByUsername };
