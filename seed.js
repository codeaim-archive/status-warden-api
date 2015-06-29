var q = require('q');
var User = require('status-warden-model').User;


var config = require('./config.js');
var log = require('./logger.js');

module.exports.start = function() {
    log.info('Seeding status warden api started');
    var deferred = q.defer();

    User.findOne({ displayName: config.ROOT_ADMIN_DISPLAY_NAME }, function(err, user) {
        if (!user) {
            log.info('Seeding root admin');

            var rootAdmin = new User({
                admin: true,
                displayName: config.ROOT_ADMIN_DISPLAY_NAME,
                emailAddress: config.ROOT_ADMIN_EMAIL_ADDRESS,
                password: config.ROOT_ADMIN_PASSWORD,
                verified: true
            });

            rootAdmin.save(function() {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        };
    });

    return deferred.promise;
}
