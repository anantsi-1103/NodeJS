const jwt = require("jsonwebtoken")
const User = require("../model/User")


// 1. protect middleware -> verifies if user is logged in 
exports.protect = async(req,res,next)=>{
    let token;

    // check if auth exist and starts wit bearer
    if(req.headers.authorization && req.headers.authorization.startWith("Bearer")){
        try{
            // extract bearer from the token
            token = req.headers.authorization.split(" ")[1]

            // verify token using secret key
            const decoded = jwt.verify(token, process.env.JWT_Secret)

            // fetch

        }
        catch(error){

        }
    }
}



// authorize role -> // restriction acess to the specific roles only