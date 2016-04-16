'use strict';

module.exports = function(sequelize, DataTypes) {
    var user = sequelize.define("user", 
        {
            email: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            authCode: {
                type: DataTypes.STRING(64),
                allowNull: true
            }
        }, {
            classMethods: {

            },
            indexes: [

            ]
        });

    return user;
};