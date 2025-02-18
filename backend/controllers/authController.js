const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { insertUser, findUserByUsername } = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

//function to register user
const registerUser = async (req, res) => {
  const { username, password } = req.body;

  if(!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const existingUser = await findUserByUsername(username);
  if(existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await insertUser(username, hashedPassword);
  res.status(201).json({ message: "User registered successfully", user: newUser });
};

//login function
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await findUserByUsername(username);
  if(!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
};

module.exports = { registerUser, loginUser };
