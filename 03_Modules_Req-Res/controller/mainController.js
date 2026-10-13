const fs = require("fs") // file system
const path = require("path") // 

// 1. 

exports.hello = (req, res) => {
    res.writeHead(200, { "Content-type": "text/html" });
    res.end("Hiii from the Controller!!!!")
}

// Server -> Data ko serve kro to the html

exports.getHomePage = (req, res) => {
    const filePath = path.join(__dirname, "..", "views", "index.html")
    
    
    fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
            res.writeHead(500, { "Content-type": "text/plain" });
            res.end("Server Error : Unable to Load your HTML")
            return;
        }
        res.writeHead(200, { "Content-type": "text/html" });
        res.end(content);
        
    })
}

// 3. Server to Server JSON Data API

exports.getUsers = (req,res)=>{
    const filePath = path.join(__dirname, "..", "data", "users.json")
    
    fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
            res.writeHead(500, { "Content-type": "application/json" });
            res.end(JSON.stringify({error : "Unable to load users data"}))
            return;
        }
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(content);
        
    })

}

// 4th step

exports.getNotFound = (req,res)=>{
    const filePath = path.join(__dirname, "..", "views", "404.html")
    
    fs.readFile(filePath, "utf8", (err, content) => {
        if (err) {
            res.writeHead(404, { "Content-type": "text/plain" });
            res.end("404 , Not Found")
            return;
        }
        res.writeHead(404, { "Content-type": "text/html" });
        res.end(content);
        
    })

}