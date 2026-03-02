const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 2000;
const DATA_FILE = path.join(__dirname, "sample.json");

app.use(express.json());

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeUsers = (users) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
};

const validateUserData = (data) => {
  const errors = [];
  if (!data.name || data.name.trim() === "") {
    errors.push("Name is required");
  }
  if (!data.age || data.age.toString().trim() === "") {
    errors.push("Age is required");
  }
  if (!data.city || data.city.trim() === "") {
    errors.push("City is required");
  }
  return errors;
};

app.get("/users", (req, res) => {
  try {
    const users = readUsers();
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.delete("/users/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let users = readUsers();
    const initialLength = users.length;
    users = users.filter((user) => user.id !== id);

    if (users.length === initialLength) {
      return res.status(404).json({ message: "User not found" });
    }

    writeUsers(users);
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ message: "Failed to delete user" });
  }
});

app.post("/users", (req, res) => {
  try {
    const { name, age, city } = req.body;
    const errors = validateUserData({ name, age, city });

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const users = readUsers();
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      age: age.toString().trim(),
      city: city.trim(),
    };

    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (err) {
    return res.status(500).json({ message: "Failed to add user" });
  }
});

app.patch("/users/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const { name, age, city } = req.body;
    const errors = validateUserData({ name, age, city });

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    let users = readUsers();
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
      return res.status(404).json({ message: "User not found" });
    }

    users[index] = {
      ...users[index],
      name: name.trim(),
      age: age.toString().trim(),
      city: city.trim(),
    };

    writeUsers(users);
    return res.json({ message: "User updated successfully", user: users[index] });
  } catch (err) {
    return res.status(500).json({ message: "Failed to update user" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
