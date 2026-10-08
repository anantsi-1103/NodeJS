// import 
const path = require("path")

console.log("----- Path -----")

// global declaration

console.log("Current Directory (__dirname) : ", __dirname)
console.log("Current File (__filename) : ", __filename)

// Sample Path

const samplePath = "/Users/anantsi/Desktop/Ducat/WEEK DAY/WD NodeJS @9.00/02_Node-Backend/report.pdf";


// base file name
console.log("Base Name : ", path.basename(samplePath)) // filename
console.log("Base Name without extension : ", path.basename(samplePath, ".pdf")) // filename except extension

// get directory
console.log("DirName : ", path.dirname(samplePath))

// File extension
console.log("Extension : ", path.extname(samplePath))

const parsed = path.parse(samplePath)
console.log("Parsed Object : ", parsed)


console.log("Formatted Path : ", path.format(parsed))

// join
// relative -> wahi se jaha pr last bana hai
const joinPath = path.join(__dirname, "uploads","images","logo.png");
console.log(joinPath)

// resolve
// absolute - Parent
const resolvedPath = path.resolve("uploads","images","logo.png");
console.log(resolvedPath)