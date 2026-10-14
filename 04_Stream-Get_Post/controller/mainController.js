const fs = require("fs"); // File System
const path = require("path");

// Server -> Data ko serve karo
const datafilePath = path.join(__dirname, "..", "data", "users.json");

// 1. GET ALL USERS
exports.getUsers = (req, res) => {

    fs.readFile(datafilePath, "utf8", (err, content) => {

        if (err) {
            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                error: "Failed to read data file"
            }));
        }

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(content);
    });
};

// 2. Get User by ID

exports.getUserByID = (req, res, id) => {
    readUsersFile((err, users) => {
        if (err) {
            res.writeHead(500, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                error: "Failed to read data file"
            }));
        }

        const user = users.find((u) => u.id === parseInt(id))

        if (!user) {
            res.writeHead(404, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                message: `User with ID ${id} not found`
            }));
        }
        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(user, null, 2));


    })
}


// 3. CREATE USER
exports.createUser = (req, res) => {

    let body = "";

    // Event 1: Incoming data chunks
    req.on("data", (chunk) => {

        console.log("Chunk received:", chunk);

        body += chunk.toString();
    });


    // Event 2: All chunks received
    req.on("end", () => {

        try {

            const newUser = JSON.parse(body);

            // Read existing users
            fs.readFile(datafilePath, "utf8", (err, fileData) => {

                let users = [];

                if (!err && fileData.trim() !== "") {
                    users = JSON.parse(fileData);
                }

                // Auto generate ID
                newUser.id =
                    users.length > 0
                        ? users[users.length - 1].id + 1
                        : 1;

                // Add new user
                users.push(newUser);

                // Write updated array
                fs.writeFile(
                    datafilePath,
                    JSON.stringify(users, null, 2),
                    "utf8",
                    (writeerr) => {

                        if (writeerr) {

                            res.writeHead(500, {
                                "Content-Type": "application/json"
                            });

                            return res.end(JSON.stringify({
                                error: "Failed to add user on server"
                            }));
                        }

                        res.writeHead(200, {
                            "Content-Type": "application/json"
                        });

                        return res.end(JSON.stringify({
                            message: "User Added Successfully",
                            user: newUser
                        }));
                    }
                );
            });

        } catch (error) {

            res.writeHead(400, {
                "Content-Type": "application/json"
            });

            return res.end(JSON.stringify({
                error: "Invalid JSON Format!!"
            }));
        }
    });
};