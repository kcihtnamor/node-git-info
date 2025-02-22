'use strict';

var fs = require('fs');
var Promise = require('bluebird');
var gitCommand = require('./gitCommands');

module.exports = {


    /**
     * @param destinationPath   Directory to save git.properties file to (directory must already exist).
     * @param callback  Function to call when git.properties file has been written or when an error doing so occurs.
     */
    write: function (destinationPath, callback) {

        destinationPath = destinationPath || process.cwd(); // default location for saving the git.properties file
        // will be the current working directory of the Node.js process.

        var gitPromises = {
            branch: "master",
            commitId: gitCommand.getCommitId(),
            commitTime: gitCommand.getCommitTime()
        };

        Promise.props(gitPromises).then(function (git) {
            var gitProperties = {
                'git.commit.id.abbrev': git.commitId.substring(0, 7),
                'git.branch': git.branch,
                'git.commit.time': git.commitTime
            };

            var returnInfo = Object.keys(gitProperties).map(function (key) {
                return key + '=' + gitProperties[key] + '\n';
            })

            var gitPropertiesFormatted = returnInfo.join(''); // format git properties for marshalling to file

            var destinationPathCleaned = destinationPath.replace(/\/?$/, '/'); // make sure destination path ends
            // with '/'

            var writeSuccess; // placeholder for storing save operation success status

            // Generate git.properties file
            fs.writeFile(destinationPathCleaned + 'git.properties', gitPropertiesFormatted, function (err) {
                if (err) {
                    // error has occured saving git.properties
                    console.log('[node-git-info][ERROR]: can\'t create git.properties file.');
                    writeSuccess = false;
                }
                else {
                    // saving git.properties was a success
                    console.log('[node-git-info] git.properties has successfully created.');
                    writeSuccess = true;
                }

                if (callback){
                    callback(writeSuccess);
                }

            });
        });
    }
}
