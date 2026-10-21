require("dotenv").config({ quiet: true });
const app = require("./app");
const connectDB = require("./config/db")

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

connectDB().then(() => {
    app.listen(PORT, HOST, () => {
        console.log(`Express server running on http://${HOST}:${PORT}`);
    });
}
)