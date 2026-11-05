const multer = require("multer")
const path = require("path")

const storage = multer.diskStorage({
    destination : (req,file , cb) =>{
        cb(null , "uploads/")
    },

    filename : (req,file,cb) =>{
        const ext = path.extname(file.originalname);

        cb(null, `file-${Date.now()}${ext}`)
    }
});

const upload = multer({
    storage , 
    limits : {fileSize : 3 * 1024 * 1024} // 3mb 

})


module.exports = upload