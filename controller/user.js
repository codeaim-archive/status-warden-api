var User = require('status-warden-model').User;

var log = require('../logger.js');

module.exports.getUsers = function (req, res) {
	log.info("Get users called");

	User.find({}, {'emailAddress': 0 }, function (err, users) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		return res.send(users);
	});
}

module.exports.getUser = function (req, res) {
	log.info("Get user called");

	User.findOne({ _id: req.params.id }, function(err, user) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!user) return res.send(404);
        if(!req.user.admin && !user._id.equals(req.user._id)) return res.send(401);

		return res.send(user);
	});
}

module.exports.postUser = function (req, res) {
	log.info("Post user called");

    User.findOne({$or : [{ emailAddress: req.params.emailAddress }, { displayName: req.params.displayName }]}, function(err, existingUser) {
        if(existingUser && existingUser.emailAddress == req.params.emailAddress) return res.send(409, { message: 'Email address is already taken' });
        if(existingUser && existingUser.displayName == req.params.displayName) return res.send(409, { message: 'Display name is already taken' });

        var user = new User({
            displayName: req.params.displayName,
            emailAddress: req.params.emailAddress,
            password: req.params.password
        });

        user.save(function (err, user) {
            if (err) {
                log.info(err);
                return res.send(err);
            };

            return res.send(201, user);
        });
    });
}

module.exports.deleteUser = function (req, res) {
	log.info("Delete user called");

	User.findOne({ _id: req.params.id }, function(err, user) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!user) return res.send(404);

		user.remove(function(err){
			if (err) {
				log.info(err);
				return res.send(err);
			};

			return res.send(204);
		});
	});
}
