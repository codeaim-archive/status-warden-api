var jwt = require('jwt-simple');
var moment = require('moment');

var User = require('status-warden-model').User;

var config = require('../config.js');
var log = require('../logger.js');

module.exports.getToken = function (req, res) {
    User.findOne({ emailAddress: req.params.email },  '+password', function(err, user) {
        if (!user) {
            return res.send(401, { message: 'Wrong email and/or password' });
        }

        user.comparePassword(req.params.password, function(err, isMatch) {
            if (!isMatch) {
                return res.send(401, { message: 'Wrong email and/or password' });
            }

            return res.send({ token: createJWT(user._id) });
        });
    });
}

module.exports.authenticate = function (req, res, next) {
    if (!req.headers.authorization) {
        return res.send(401, { message: 'Please make sure your request has an Authorization header' });
    }

    var token = req.headers.authorization;

    var payload = null;
    try {
        payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
        return res.send(401, { message: err.message });
    }

    if (payload.exp <= moment().unix()) {
        return res.send(401, { message: 'Token has expired' });
    }

    User.findOne({ _id: payload.sub }, function(err, user) {
        if (err) {
            log.info(err);
            return res.send(err);
        };
        if (!user) return res.send(401, { message: 'User not found' });

        req.user = user;
        next();
    });
}

module.exports.isAdmin = function(req, res, next) {
    if (!req.user.admin) return res.send(401, { message: 'This request requires administration access' });
    next();
}

function createJWT(userId) {
    var payload = {
        sub: userId,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    };

    return jwt.encode(payload, config.TOKEN_SECRET);
}
