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
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
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
        auth: false,
        validate: {
            payload: {
                email: Joi.string().email().required(),
                authCode: Joi.string().required()
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
                    id: user.id,
                    token: Jwt.sign(tokenData, app.config.auth.key)
                });

                // remove authCode
                user.update({ authCode: null });
            });
        }
    };

    return exports;
};