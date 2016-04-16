'use strict';

var Hapi   = require('hapi');
var Moment = require('moment');
var fs     = require('fs');
var env    = process.env.NODE_ENV || "development";
var configPath = './config/'+env+'.js';


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

    // routes
    server.route((require('./api/routes')(app)).endpoints);

    server.start(() => { // start server
        console.log('Server Listening on : http://'+ app.config.server.host + ':' + app.config.server.port);
    });

    // DB SYNC
    // app.models.sequelize.query('SET FOREIGN_KEY_CHECKS = 0').then(() => { app.models.sequelize.sync({ force: true }).then(() => { app.models.sequelize.query('SET FOREIGN_KEY_CHECKS = 1') }) });
});

