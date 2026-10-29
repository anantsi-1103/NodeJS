// Logs every incoming request to the console
const logger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
    next(); // Pass control to the next middleware/route
};

module.exports = logger;