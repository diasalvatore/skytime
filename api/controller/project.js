'use strict';

module.exports = function (app) {
    var Joi     = require('joi');
    var Boom    = require('boom'); 
    var Project = app.models.project;

    var exports  = {}; // returned object
    exports.name = 'project';

    exports.query = {
        validate: {
        },
        handler: (request, reply) => {
            Project.findAll()
                .then(reply)
                .catch((e) => { 
                    reply(Boom.badRequest(e)); 
                });
        }
    };

    return exports;
};