const FUNCTION_DEF = "function ";
const FUNCTION_PARAMETERS = "(process.argv[2]);";
const NEW_LINE = '\n';

module.exports = {

    generateScript : function () {
        let scriptText = this.printListOfDirectories.name + FUNCTION_PARAMETERS + NEW_LINE;
        scriptText += "let txtDestDirPath = " + this.createInnerDirectory.name + FUNCTION_PARAMETERS + NEW_LINE;
        scriptText += this.trackDirectoryChanges.name + "(txtDestDirPath);" + NEW_LINE;
        scriptText += NEW_LINE + NEW_LINE;


        scriptText += FUNCTION_DEF +
            this.printListOfDirectories.name +
            this.printListOfDirectories.toString().substring(FUNCTION_DEF.length) + NEW_LINE;

        scriptText += FUNCTION_DEF +
            this.createInnerDirectory.name +
            this.createInnerDirectory.toString().substring(FUNCTION_DEF.length) + NEW_LINE;

        scriptText += FUNCTION_DEF +
            this.trackDirectoryChanges.name +
            this.trackDirectoryChanges.toString().substring(FUNCTION_DEF.length) + NEW_LINE;

        return scriptText;
    },

    printListOfDirectories : function (directoryPath) {
        const fileSystem = require("fs");
        fileSystem.readdir(directoryPath, (err, files) => {
            if (err) {
                console.log(err.stack);
                process.exit(1);
            }
            files.forEach(item => {
                fileSystem.stat(directoryPath + '/' + item, (err, state) => {
                    if(state.isDirectory()){
                        printListOfDirectories(directoryPath + '/' + item);
                    } else {
                        console.log(directoryPath + '/' + item);
                    }
                });
            });
        });
    },

    createInnerDirectory : function (directoryPath) {
        const fileSystem = require("fs");
        const TXT_DEST_FILE_PATH = directoryPath + "\\" + directoryPath.split("\\").pop();

        fileSystem.readFile("../Copyright/config.json", (configErr, configData) => {
            if (configErr) {
                console.log("Cannot read such config file");
                process.exit(1);
            }
            let copyright = JSON.parse(configData.toString()).copyright;


            let copyTxtFunc = function(func, directoryPath) {
                fileSystem.readdir(directoryPath, (err, files) => {
                    if (err) {
                        console.log(err.stack);
                        process.exit(1);
                    }

                    files.forEach(item => {
                        let newPath = directoryPath + "/" + item;
                        fileSystem.stat(newPath, (statErr, stats) => {
                            if (stats.isDirectory()) {
                                func(func, newPath);
                            } else {
                                if (item.toLowerCase().endsWith(".txt")) {
                                    fileSystem.readFile(newPath, (readErr, data) => {
                                        if (readErr) {
                                            console.log("Unable to read file");
                                        } else {
                                            let newData = copyright + data + copyright;
                                            let fileCopyPath = TXT_DEST_FILE_PATH + "/" + item;
                                            fileSystem.writeFile(fileCopyPath, newData, err => {
                                                if (err) {
                                                    console.log("Invalid path");
                                                    process.exit(1);
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                        });
                    });
                });
            };

            fileSystem.mkdir(TXT_DEST_FILE_PATH, err => {
                if (err) {
                    console.log("Invalid directory path");
                    process.exit(1);
                }
            });

            copyTxtFunc(copyTxtFunc, directoryPath);
        });

        return TXT_DEST_FILE_PATH;
    },

    trackDirectoryChanges : function (directoryPath) {
        const fileSystem = require("fs");
        const TIME_WHILE_DIRS_CREATED = 2000;

        setTimeout(() => {
            fileSystem.watch(directoryPath, {encoding : "buffer"}, (eventType, filename) => {
                if (filename) {
                    console.log(filename.toString() + " has changed");
                }
            });
        }, TIME_WHILE_DIRS_CREATED);
    }
};