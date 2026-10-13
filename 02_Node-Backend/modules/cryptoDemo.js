const crypto = require("crypto")


const uniqueID = crypto.randomUUID();
console.log("Generated UUID : ", uniqueID)


const password = "mypassword1234"
const hash = crypto.createHash("sha256").update(password).digest("hex")
console.log(hash)

const randomToken = crypto.randomBytes(16).toString("hex")

console.log("Random 16 byte token : ", randomToken)