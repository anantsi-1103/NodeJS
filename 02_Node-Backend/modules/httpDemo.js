const http = require("http")
const { json } = require("stream/consumers")



const server = http.createServer((req,res)=>{
    if(req.url==="/check" && req.method==="GET"){
        res.end(JSON.stringify({status:"OK", message:"Server is Healthy"}))
    }
    else{
        res.end(JSON.stringify({message:"Welcome to the Server"}))

    }
})


const PORT = 9090

server.listen(PORT, ()=>{
    console.log("Server is running")
})

