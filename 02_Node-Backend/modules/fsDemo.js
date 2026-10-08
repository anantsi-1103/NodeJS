const fs = require("fs")
const path = require("path")

console.log("----------- FS Module Demo ----------")

const folderPath = path.join(__dirname, "sample_dir");
const filePath = path.join(folderPath, "demo.txt");

// 1. create a folder

if (!fs.existsSync(folderPath)) {
    // create a folder -> mkdir -> make directory
    fs.mkdir(folderPath, (err) => {
        if (err) {
            return console.error("Error Creating a Folder : ", err)
        }
        console.log("1. Folder Created Successfully!!")
        runFileOperation()
    });
}
else {
    runFileOperation();
}




function runFileOperation() {
    fs.writeFile(filePath, "Now we will do append ", (err) => {
        if (err) return console.log("Write Error : ", err);
        console.log("2. File Written Successfully!!")
    })

    // Append add after
    fs.appendFile(filePath, "This is a Line 2 (Appended) \n", (err) => {
        if (err) return console.log("Append Error : ", err);
        console.log("3. Append Data Successfully!!")
    })

    // read a file data
    fs.readFile(filePath, (err, data) => {
        if (err) return console.log("Read Error : ", err);
        console.log("4. File Content Read: \n" + data)
    })
}