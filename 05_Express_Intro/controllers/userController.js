const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "..", "data", "users.json");

// Helper function to read users
const readUsers = () => {
    const data = fs.readFileSync(dataFilePath, "utf8");
    return data.trim() ? JSON.parse(data) : [];
};

// Helper function to write users
const writeUsers = (users) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), "utf8");
};

// 1. GET ALL USERS (with optional query filtering: ?role=developer)
exports.getAllUsers = (req, res) => {
    let users = readUsers();
    const { role } = req.query; // Query parameter

    if (role) {
        users = users.filter(u => u.role.toLowerCase() === role.toLowerCase());
    }

    res.status(200).json({ success: true, count: users.length, data: users });
};

// 2. GET SINGLE USER BY ID (:id parameter)
exports.getUserById = (req, res) => {
    const users = readUsers();
    const id = parseInt(req.params.id); // Route parameter
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }

    res.status(200).json({ success: true, data: user });
};

// 3. CREATE USER (POST)
exports.createUser = (req, res) => {
    const { name, role } = req.body; // Automatically parsed by express.json()

    if (!name || !role) {
        return res.status(400).json({ success: false, message: "Please provide both name and role" });
    }

    const users = readUsers();
    const newUser = {
        id: users.length > 0 ? users[users.length - 1].id + 1 : 1,
        name,
        role
    };

    users.push(newUser);
    writeUsers(users);

    res.status(201).json({ success: true, message: "User created", data: newUser });
};

// 4. UPDATE USER (PUT)
exports.updateUser = (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }

    users[userIndex] = { ...users[userIndex], ...req.body, id };
    writeUsers(users);

    res.status(200).json({ success: true, message: "User updated", data: users[userIndex] });
};

// 5. DELETE USER (DELETE)
exports.deleteUser = (req, res) => {
    const id = parseInt(req.params.id);
    const users = readUsers();
    const userExists = users.some(u => u.id === id);

    if (!userExists) {
        return res.status(404).json({ success: false, message: `User with ID ${id} not found` });
    }

    const filteredUsers = users.filter(u => u.id !== id);
    writeUsers(filteredUsers);

    res.status(200).json({ success: true, message: `User with ID ${id} deleted` });
};