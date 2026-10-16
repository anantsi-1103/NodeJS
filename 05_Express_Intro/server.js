require("dotenv").config({ quiet: true });
const app = require("./app");

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, HOST, () => {
    console.log(`Express server running on http://${HOST}:${PORT}`);
});