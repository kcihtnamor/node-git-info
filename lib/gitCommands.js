'use strict';

var exec = require('child-process-promise').exec;
var moment = require('moment');

exports.getCommitId = function() {
    return exec('git rev-parse master').then(function(result) {
        return result.stdout.trim();
    });
}

exports.getCommitTime = function() {
    return exec('git log -1 master --pretty=format:%ct').then(function(result) {
        return moment(result.stdout.trim()*1000).toISOString();
    });
}
