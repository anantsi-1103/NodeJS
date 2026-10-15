const fs = require("fs"); // File System
const path = require("path");



// Server -> Data ko serve karo
const datafilePath = path.join(__dirname, "..", "data", "users.json");


// helper function which help to read the json file safely
const readUserFile = (callback) => {
    fs.readFile(datafilePath, "utf8", (err, data) => {
        if (err) return callback(err, null);

        try {
            const users = data.trim() ? JSON.parse(data) : [];
            callback(null, users);
        }
        catch (parseErr) {
            callback(parseErr, null)
        }
    })
}

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
    readUserFile((err, users) => {
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


// 4. Delete Data by ID
exports.deleteUser = (req, res, id) => {
    readUserFile((err, users) => {
        if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Failed to read the data" }))
        }

        const userExists = users.some((u) => u.id === parseInt(id))

        if (!userExists) {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: `User with ID ${id} not found` }))
        }

        // us id ke data ko chor kr baaki data ko updateduser ke andr dal do
        const updatedUser = users.filter((u) => u.id !== parseInt(id));

        fs.writeFile(datafilePath, JSON.stringify(updatedUser, null, 2), "utf8", (writeErr) => {
            if (writeErr) {
                res.writeHead(500, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: "Failed to Delete the User" }))
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: `User with ID ${id} is deleted Successfully!!!` }))
        })


    })
}

// 5. Update Data by ID
exports.updateUser = (req, res, id) => {
    let body = "";


    // 1. receive updated in chunks

    req.on("data", (chunk) => {
        body += chunk.toString();
    })


    // 2. entire data or body is received

    req.on("end", () => {
        try {
            // Input(body) ka data -> JSON
            const updatedData = JSON.parse(body)

            readUserFile((err, users) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Failed to read the data" }))
                }

                // find the index of the user
                const userIndex = users.findIndex((u) => u.id === parseInt(id))


                if (userIndex === -1) {
                    res.writeHead(404, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ message: `User with ID : ${id} not found!!!!` }))
                }

                // Merge the updated field with the original id

                users[userIndex] = {
                    // data update -> precent id from being changed
                    ...users[userIndex], ...updatedData, id: parseInt(id)
                }

                // write this updated data into a orignal array
                fs.writeFile(datafilePath, JSON.stringify(users, null, 2), "utf8", (writeErr) => {
                    if (writeErr) {
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "Failed to Delete the User" }))
                    }

                    res.writeHead(200, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({
                        message: `User with ID ${id} is updated Successfully!!!`,
                        user: users[userIndex]
                    }))

                })
            })
        }
        catch {
            res.writeHead(404, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Invalid JSON Format in Request Body" }))
        }
    })
}