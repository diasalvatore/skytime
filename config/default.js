'use strict';

module.exports = (() => {
    return {
        name: "Skytime",
        db: {
            host: "127.0.0.1",
            username: "",
            password: "",
            database: "",
            dialect: ""      
        },
        auth: {
            key: '',
            maxAge: 60*1000 // 60 secs
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