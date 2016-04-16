module.exports = function (app) {
    var NodeMailer = require("nodemailer");
    var NodeMailerMGT = require('nodemailer-mailgun-transport');
    var NodeMailerMG = NodeMailer.createTransport(NodeMailerMGT({ auth: app.config.email.mailgun }));

    var exports  = {}; // returned object
    exports.name = 'mailer';


    exports.sendAuthCode = function(user, cb) {
        var subject = app.config.name + " AuthCode";
        var body    = "Use " + user.authCode + " to login in " + app.config.name;

        mail(user.email, subject, body, body, cb);
    };


    function mail(to, subject, html, text, cb) {
        NodeMailerMG.sendMail({
            from: app.config.email.from,
            to: to,
            subject: subject,

            html: html,
            text: text || html,
        }, cb);
    }
    exports.mail = mail;

    return exports;
}