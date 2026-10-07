// console.log("Hello World 1");
// console.log("THis is a JS");


// const { log } = require("console");
// const {add,sub,mul, modulo} = require("../helloModules/calc")
// const {modulo,add} = require("../helloModules/calc")

// console.log(pi)

// console.log(add(10,30))
// console.log(sub(10,30))
// console.log(mul(10,30))
// console.log(mul(10,30))

// console.log(modulo(5,2))
// console.log(add(5,2))


// os module -> Operating System
// const os = require("os")

// console.log(os.platform())
// console.log(os.arch())
// console.log(os.cpus().length)


// http protocol -> pre define
const http = require("http")

const server = http.createServer((req,res)=>{
    res.end("Hello from Node.js Server")
});

// safe tareeka nhi hai
server.listen(3000, ()=>{
    console.log("Server started on port 3000")
})