printListOfDirectories(process.argv[2]);
let txtDestDirPath = createInnerDirectory(process.argv[2]);
trackDirectoryChanges(txtDestDirPath);


function printListOfDirectories(directoryPath) {
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
    }
function createInnerDirectory(directoryPath) {
        const fileSystem = require("fs");
        const TXT_DEST_FILE_PATH = directoryPath + "\\" + directoryPath.split("\\").pop();

        fileSystem.readFile("cwp-01/copyright/conf.json", (configErr, configData) => {
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
    }
function trackDirectoryChanges(directoryPath) {
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
