const scriptGenerator = require("./utils/generator");
const fileManager = require("./utils/fileManager");
const fileSystem = require("fs");
const PATH_ARG_INDEX = 2;



if (process.argv.length <= PATH_ARG_INDEX) {
    console.log("There are no path argument");
    process.exit(1);
}

let directoryPath = process.argv[PATH_ARG_INDEX];
fileManager.checkDirectory(directoryPath);
fileManager.createScript(directoryPath, scriptGenerator.generateScript());

