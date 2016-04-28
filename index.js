'use strict';

const Hapi        = require('hapi');
const Moment      = require('moment');
const fs          = require('fs');
const Inert       = require('inert');
const Vision      = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack        = require('./package');
const env         = process.env.NODE_ENV || "development";
const configPath  = './config/'+env+'.js';


// Config
try { // checking if configPath is accessible
    fs.accessSync(configPath, fs.F_OK);
} catch (e) {
    console.log("ERROR(?): "+configPath+" is not accessible!"+e);
    configPath = './config/default.js';    
}

var app = { // app will contain everything
    start:   new Date(),
    config:  require(configPath),
};
app.models = require('./api/model')(app);
app.ctrls  = require('./api/controller')(app); 


// starting server
var server = new Hapi.Server();
server.connection({ port: app.config.server.port });

server.register(require('hapi-auth-jwt2'), (err) => {
    if (err) console.log(err);

    // setting security - JWT
    server.auth.strategy('jwt', 'jwt', { 
        key: app.config.auth.key,  
        validateFunc: (decoded, request, cb) => { return cb(null, true); },
        verifyOptions: { 
            ignoreExpiration: false,
            algorithms: [ 'HS256' ] 
        } 
    });
    server.auth.default('jwt');    


    // setting up docs
    server.register([
        Inert,
        Vision,
        {
            register: HapiSwagger,
            options: {
                info: {
                    title:    app.config.name + ' Documentation',
                    version:  app.config.version,
                    contact:  app.config.authorContact,
                },
                pathPrefixSize: 2,
                basePath: '/api'
            }
        }],  (err) => {
            if (err) console.log(err);

            // routes
            server.route((require('./api/routes')(app)).endpoints);

            server.start((err) => { // start server
                if (err) console.log(err);

                console.log('Server Listening on : http://'+ app.config.server.host + ':' + app.config.server.port);
            });

            // DB SYNC
            // app.models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(() => { app.models.sequelize.sync({ force: true }).then(() => { app.models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1') }) });
        })
});

