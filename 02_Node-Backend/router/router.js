const { hello } = require("../controller/mainController")
const os = require('os');


function routeTraffic(req, res) {
    // routes -> 
    const { url, method } = req
    if (url === "/" && method === "GET") {
        res.end("hello from GET node Server!!!")
    }
    else if (url === "/" && method === "POST") {
        res.end("hello from POST node Server!!!")
    }
    else if (url === "/user") {
        // res.end("hello from USER node Server!!!")
        hello(req, res);
    }
    else if (url === "/os") {
        // console.log(os.platform())
        testOS();
        // res.end("Learning OS Module!!!")
        // console.log(os.platform())
        // console.log(os.arch())
        // console.log(os.cpus())
    }
    else {
        res.end("resource not found on server!!!")
    }
}

module.exports = routeTraffic