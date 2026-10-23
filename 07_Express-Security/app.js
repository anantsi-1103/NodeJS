const express = require("express");
const logger = require("./middlewares/logger");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes")

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(express.json()); // Parses incoming application/json body
app.use(express.urlencoded({extended: true})); // Parses incoming form m data add 
app.use(logger);         // Custom logger middleware

// 2. MOUNT ROUTES
app.use("/api/users", userRoutes);
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