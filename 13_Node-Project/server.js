// console.log("hello JSd")
const http = require("http");
const routeTraffic = require("./router/router");

// lekr bhi ana hai and configure bhi krna hai
// quiet used to remove the suggestion
require("dotenv").config({quiet:true})

const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "localhost";

const server = http.createServer((req, res) => {
    // user req -> get,post,put,patch,delete
    const {url , method }= req
    console.log(`user request : ${url} with ${method}`)

    routeTraffic(req,res) // saari routing isske threw puchna ki 
    // res.end("Server is up and running")
})


server.listen(PORT, HOST, () => {
    console.log(`listening on http: // ${HOST}: ${PORT}`)
})