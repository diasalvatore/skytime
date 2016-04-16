'use strict';

module.exports = function (app) {
    var fs        = require("fs");
    var path      = require("path");
    var ctrls     = {};

    fs
        .readdirSync(__dirname)
        .filter(function(file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function(file) {
            var ctrl = require(path.join(__dirname, file))(app);
            ctrls[ctrl.name] = ctrl;
        });

    return ctrls;
}