const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const { createUserTable } = require("./models/user");

const app = express();

app.use(cors());
app.use(express.json());

//this is the end part of the api so
//auth for the user register and login
//tasks for the user tasks
app.use("/auth", authRoutes);
app.use("/tasks", tasksRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  await createUserTable(); //create the user table before fully starting
  console.log(`Server running on port ${PORT}`);
});
