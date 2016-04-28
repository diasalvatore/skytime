'use strict';

module.exports = function (app) {
    var Joi    = require('joi');
    var Boom   = require('boom'); 
    var Jwt    = require('jsonwebtoken');
    var Crypto = require('crypto');
    var User   = app.models.user;

    var exports  = {}; // returned object
    exports.name = 'user';

    exports.create = {
        description: 'Create a new User',
        notes: 'Create a new User, it sends an email with a verification code',
        tags: [ 'api' ],
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required().description("User email"),
            }
        },
        plugins: {
            'hapi-swagger': {
                responses: {
                    '200': {
                        'description': 'Returns a message for the user',
                        'schema': Joi.object({
                            message: Joi.string().required(),
                        }).label('Result')
                    },
                    '400': { 'description': 'Invalid email' }
                }
            }
        },
        handler: (request, reply) => {
            User.upsert({
                email:    request.payload.email,
                authCode: (Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000)
            }).then(() => {
                reply({ 
                    message: "An email with auth code has been sent to " + request.payload.email
                });

                // sending authcode via email
                // I have to query the DB.. -.-    https://github.com/sequelize/sequelize/issues/3354
                User.findOne({ 'where': {
                    email:    request.payload.email,
                }}).then((user) => {
                    app.ctrls.mailer.sendAuthCode(user, (ok, err) => { if (err) console.log(err); } );
                });
            }).catch((e) => { 
                reply(Boom.badRequest(e)); 
            });
        }
    };

    exports.login = {
        description: 'Login',
        notes: 'Login, authCode should have been sent via email',
        tags: [ 'api' ],
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
                authCode: Joi.string().required()
            }
        },
        plugins: {
            'hapi-swagger': {
                responses: {
                    '200': {
                        'description': 'Returns a token valid for '+app.config.auth.ttl+' seconds',
                        'schema': Joi.object({
                            token: Joi.string().required(),
                        }).label('Result')
                    },
                    '400': { 'description': 'Invalid email/authCode' },
                    '403': { 'description': 'Wrong email/authCode' }
                }
            }
        },
        handler: function(request, reply) {
            User.findOne({ 'where': {
                email: request.payload.email,
                authCode: request.payload.authCode,
            }}).then((user) => {
                if (!user) return reply(Boom.forbidden("Invalid email/authCode")); 

                var now = new Date();

                var tokenData = {
                    id:       user.id,
                    agencyId: user.agencyId,
                    iat:      now.getTime(),
                    maxAge:   app.config.auth.maxAge,
                }

                reply({
                    token: Jwt.sign(tokenData, app.config.auth.key)
                });

                // remove authCode
                user.update({ authCode: null });
            });
        }
    };

    return exports;
};