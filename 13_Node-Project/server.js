
// lekr bhi ana hai and configure bhi krna hai
// quiet used to remove the suggestion
require("dotenv").config({ quiet: true })
// console.log("hello JSd")
const express = require("express")
const http = require("http");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);
const io = new Server(server)

app.set("socketio", io)


connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


// static folder
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// EJS View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Mount Routes
app.use("/", require("./routes/viewRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));


io.on("connection", (socket) => {
    console.log(`Client Connected via WebSocket : ${socket.id}`)
})

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";



server.listen(PORT, HOST, () => {
    console.log(`Express server running on http://${HOST}:${PORT}`);
});

