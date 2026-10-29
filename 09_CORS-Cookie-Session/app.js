const express = require("express");
const logger = require("./middlewares/logger");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes")
const authRoutes = require("./routes/authRoutes")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const session = require("express-session")

const app = express();

// CORS - Configuration
// allow fronted like react 
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"], // allowed frontend urls 
        credentials: true // Crucial imp -> allows frontend to send and receive the data or cookies
    })
)

// access control allow origin -> Headers
// cookie parser -> Session ->






// 1. GLOBAL MIDDLEWARES
app.use(express.json()); // Parses incoming application/json body
app.use(express.urlencoded({ extended: true })) // form data -> parse url ke threw encode krlega
app.use(logger);         // Custom logger middleware

app.use(cookieParser())

// Session Management

app.use(
    session({
        secret: process.env.SESSION_SECRET || "mySecretSessionKey123",
        resave: false, // do not save session if modified,
        saveUninitialized: false, // do not create session until something is stored
        cookie: {
            httpOnly: true, // prevent client side js from reading the cookie
            maxAge: 1000 * 60 * 60  // 1 hrs m expire
        }
    })
)

// Session DEMO Part
app.get("/api/session-demo", (req, res) => {
    // req session automatically create as per your req
    if (req.session.pageViews) {
        req.session.pageViews++;
        res.json({
            message: `Welcome Back!!! You have Visited this route ${req.session.pageViews} times during the Session `
            , sessionId: req.sessionID
        });
    }
    else {
        req.session.pageViews = 1;
        res.json({
            message: `Welcome! This is Your First Visit During this Session`
            , sessionId: req.sessionID
        })
    }
})





// 2. MOUNT ROUTES
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes)
app.use("/api/auth", authRoutes)

// 3. 404 CATCH-ALL ROUTE
app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
});

// 4. GLOBAL ERROR-HANDLING MIDDLEWARE
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack);
    res.status(500).json({ success: false, message: "Internal Server Error" });
});

module.exports = app;