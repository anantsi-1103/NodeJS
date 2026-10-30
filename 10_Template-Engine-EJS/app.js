const express = require("express");
const logger = require("./middlewares/logger");
const path = require("path")
const app = express();

// EJS Configuration

app.set("view engine","ejs") // tell express we are using EJS
app.set("views", path.join(__dirname, "views"))  // express ko ki ejs ki jo files banai hai woh kaha hai or kaha chl rhi hai

// Body Parser -> data submit form usko read krle
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// CSS , Images
app.use(express.static(path.join(__dirname, "public")))
app.use("/uploads", express.static(path.join(__dirname, "uploads")))


// 2. MOUNT ROUTES
const viewRoutes = require("./routes/viewRoutes")
app.use("/", viewRoutes)

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