const { hello, getHomePage, getNotFound, getUsers } = require("../controller/mainController")
const os = require('os');


function routeTraffic(req, res) {
    // routes -> 
    const { url, method } = req

    if (url === "/" && method === "GET") {
        getHomePage(req,res);
    }
    else if (url === "/api/users" && method === "GET") {
        getUsers(req,res)
    }
    else if (url === "/user" && method == "GET") {
        // res.end("hello from USER node Server!!!")
        hello(req, res);
    }
    else {
       getNotFound(req,res);
    }
}

module.exports = routeTraffic