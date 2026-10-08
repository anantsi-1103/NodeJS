const EventEmitter = require("events")

// instance ko call krliya 
const myEmitter = new EventEmitter();


// 1. Register -> 

myEmitter.on("userLoggedIn", (username, role) => {
    console.log(`Event Triggered : User '${username}' logged in with role : ${role}`)
})
myEmitter.on("orderPlaced", (orderId, amt) => {
    console.log(`Order Notification  : Order '#${orderId}' for amount : ${amt} received`)
})

// trigger your custom events

myEmitter.emit("userLoggedIn", "anantsi", "admin")
myEmitter.emit("orderPlaced", 101, 5000)

