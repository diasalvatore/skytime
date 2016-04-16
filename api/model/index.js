'use strict';

module.exports = function (app) {
  var fs        = require("fs");
  var path      = require("path");
  var Sequelize = require("sequelize");
  var sequelize = new Sequelize(app.config.db.database, app.config.db.username, app.config.db.password, app.config);
  var db        = {};

  fs
      .readdirSync(__dirname)
      .filter(function(file) {
          return (file.indexOf(".") !== 0) && (file !== "index.js");
      })
      .forEach(function(file) {
          var model = sequelize["import"](path.join(__dirname, file));
          db[model.name] = model;
      });

  Object.keys(db).forEach(function(modelName) {
      if ("associate" in db[modelName]) {
        db[modelName].associate(db);
      }
  });

  db.sequelize = sequelize;

  return db;
}