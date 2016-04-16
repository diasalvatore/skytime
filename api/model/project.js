'use strict';

module.exports = function(sequelize, DataTypes) {
    var project = sequelize.define("project", 
        {
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            url: {
                type: DataTypes.STRING(255),
                allowNull: true
            }
        }, {
            classMethods: {

            },
            indexes: [

            ]
        });

    return project;
};