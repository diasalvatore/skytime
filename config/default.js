'use strict';

module.exports = (() => {
    return {
        name: "Skytime",
        version: "1.0.0",
        authorContact: {
            email: "salvatore.diana@skylabs.it",
        },
        db: {
            host: "127.0.0.1",
            username: "",
            password: "",
            database: "",
            dialect: ""      
        },
        auth: {
            key: '',
            ttl: 60 // 60 secs
        },
        email: {
            from: "SkyTime <time@sky.sky>",
            mailgun: {
                api_key: '',
                domain: ''                
            }
        },
        server: {
            host: "localhost",
            port: 3000
        },
    }
})();