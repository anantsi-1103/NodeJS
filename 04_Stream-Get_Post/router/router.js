const { getUsers, createUser, getUserByID, deleteUser, updateUser } = require("../controller/mainController")
const os = require('os');


function routeTraffic(req, res) {

    const parseUrl = new URL(req.url, `http://${req.headers.host}`)
    const pathName = parseUrl.pathname
    const method = req.method
    const id = parseUrl.searchParams.get("id") // eg - ?id=2


    // routes -> 
    // const { url, method } = req

    // 1. get all users
    // if(url === "/api/users" && method === "GET"){
    if (pathName === "/api/users" && method === "GET") {
        // api -> 

        if (id) {
            getUserByID(req, res, id)
        }
        else {
            getUsers(req, res)
        }
    }

    // else if(url === "/api/users" && method === "POST"){
    else if (pathName === "/api/users" && method === "POST") {
        createUser(req, res);
    }

    else if (pathName === "/api/users" && method === "PUT") {
        // api -> 
        if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Please Provide a User ID (?id=...)" }))
        }
        updateUser(req, res, id)
    }
    else if (pathName === "/api/users" && method === "DELETE") {
        // api -> 

        if (!id) {
            res.writeHead(400, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Please Provide a User ID (?id=...)" }))
        }
        deleteUser(req, res, id)
    }

    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }


}

module.exports = routeTraffic