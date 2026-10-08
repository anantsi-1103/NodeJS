// import krna 
const os = require("os")


console.log("---- OS Module -----")

// 1. Platform
console.log("Platform : ", os.platform())
console.log("Architecture : ", os.arch())
console.log("OS type : ", os.type())
console.log("OS Release : ", os.release())

console.log("User Info : ", os.userInfo().username)
console.log("Home Directory : ", os.homedir())


const totalMemoGB = (os.totalmem()/ (1024 * 1024 * 1024)). toFixed(1)
console.log("Total RAM : ",totalMemoGB,"GB")
const totalFreeMemoGb = (os.freemem()/ (1024 * 1024 * 1024)). toFixed(1)
console.log("Total RAM : ",totalMemoGB,"GB")
console.log("Free RAM : ",totalFreeMemoGb,"GB")


console.log("CPU Cores : ", os.cpus().length)
console.log("CPU Model : ", os.cpus()[0].model)

console.log(`System UP time : ${(os.uptime()/3600).toFixed(2)} Hours`)

