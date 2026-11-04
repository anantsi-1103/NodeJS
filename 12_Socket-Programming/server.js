require("dotenv").config({ quiet: true });
const express = require("express")
const http = require("http")
const path = require("path")
const { Server } = require("socket.io")


const app = express()

// 1. create a native http server
const server = http.createServer(app)

// 2. intialize that server into a socket io 
const io = new Server(server, {
    cors: {
        origin: "*", // allows req or the connection from the client
        methods: ["GET", "POST"]
    }
});

// 3. Serve static frontend file from the public folder
app.use(express.static(path.join(__dirname, "public")))

// Router to serve the chat page
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, "public", "chat.html"));
});

// 4. Realtime Socket.io Event Handling

let onlineUserCount = 0;

io.on("connection", (socket) => {
    onlineUserCount++;

    console.log(`New User Connected!! Socket ID : ${socket.id} (Online User Count : ${onlineUserCount})`)

    // Broadcast updated online user count to all clients
    io.emit("userCountUpdate", onlineUserCount);

    // Welcome the newly Connected User count to all
    socket.emit("systemMessage", "Welcome to the Realtime Chat Server!!");

    // Notify All Other Users that someone joined
    socket.broadcast.emit("systemMessage", "A New User Joined a Chat");

    // EventA : Listen for incoming chat message 
    socket.on("sendMessage", (data) => {
        const payload = {
            username: data.username || "Anonymous",
            message: data.message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        }

        // Broadcast the message to everyone(including the Sender)
        io.emit("receiveMessage", payload)
    })

    // EventB : User is Typing
    socket.on("typing", (username) => {
        // send to everyone except the person who is typing
        socket.broadcast.emit("userTyping", username)
    })

    // EventC : User Stopped Typing
    socket.on("stopTyping", (username) => {
        socket.broadcast.emit("user Stopped Typing")
    })

    // EventD : Triggerd When user closes tab or disconnects
    socket.on("disconnect", () => {
        onlineUserCount--;
        console.log(`User Disconnected : ${socket.id}, (Online User Count : ${onlineUserCount})`)

        io.emit("userCountUpdate", onlineUserCount)
        if(socket.username){
            io.emit(`systemMessage, ${socket.username} left the Chat`)
        }
    })

    socket.on("userjoined", (username)=>{
        socket.username = username

        socket.emit("systemMessage", `Welcome to the Chat, ${username}`)


        socket.broadcast.emit("systemMessage", `${username} joined the chat`)
    })


})

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, HOST, () => {
    console.log(`Express server running on http://${HOST}:${PORT}`);
});

