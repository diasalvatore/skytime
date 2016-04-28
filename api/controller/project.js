'use strict';

module.exports = function (app) {
    var Joi     = require('joi');
    var Boom    = require('boom'); 
    var Project = app.models.project;

    var exports  = {}; // returned object
    exports.name = 'project';

    exports.query = {
        description: 'Get Projects',
        notes: 'Get list of projects available for current user',
        tags: [ 'api' ],
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).unknown()
        },
        plugins: {
            'hapi-swagger': {
                responses: {
                    '200': {
                        'description': 'Returns a token valid for '+app.config.auth.ttl+' seconds',
                        'schema': Joi.array(Joi.object({
                            token: Joi.string().required(),
                        })).label('Result')
                    },
                    '400': {
                        'description': 'Bad Request (invalid email/authCode)'
                    }
                }
            }
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