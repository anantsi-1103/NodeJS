require("dotenv").config({ quiet: true });
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

// 1. Socket.io setup with CORS support
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }
});

// Share socket.io instance with Express controllers
app.set("socketio", io);

// 2. Connect Database
connectDB();

// 3. Middlewares
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 4. Static Folders
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 5. EJS View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 6. Mount Routes
app.use("/", require("./routes/viewRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// 7. Realtime Socket.io Connection & Presence
let onlineUsers = 0;
io.on("connection", (socket) => {
    onlineUsers++;
    io.emit("onlineCount", onlineUsers);
    console.log(`⚡ Client Connected via WebSocket: ${socket.id} (Online: ${onlineUsers})`);

    socket.on("disconnect", () => {
        onlineUsers = Math.max(0, onlineUsers - 1);
        io.emit("onlineCount", onlineUsers);
        console.log(`❌ Client Disconnected: ${socket.id} (Online: ${onlineUsers})`);
    });
});

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, () => {
    console.log(`🚀 Express server running on http://${HOST}:${PORT}`);
});
