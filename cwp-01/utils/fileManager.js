const fileSystem = require("fs");

module.exports = {
    checkDirectory : function (path) {
        fileSystem.access(path, fileSystem.F_OK, err => {
            if (err) {
                console.log(err.stack);
                process.exit(1);
            }
        });
    },
        createScript(path, scriptText) {
            fileSystem.writeFile(path + "/summary.js",scriptText,err => {
                if(err) {
                    console.log(err.stack);
                    process.exit(1);
                }
            });
        },
    };