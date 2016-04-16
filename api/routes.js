module.exports = (app) => {
    var user    = app.ctrls.user;
    var project = app.ctrls.project;
    var work    = app.ctrls.work;

    return {
        endpoints: [
            { method: 'POST',     path: '/api/user',            config: user.create },
            { method: 'POST',     path: '/api/user/login',      config: user.login },

            { method: 'GET',      path: '/api/project',         config: project.query },
        ]

            // { method: 'POST',     path: '/api/work',            config: work.create },
            // { method: 'GET',      path: '/api/work',            config: work.edit },
            // { method: 'DELETE',   path: '/api/work',            config: work.delete },
    }
}
