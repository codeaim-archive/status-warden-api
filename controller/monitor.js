var model = require('status-warden-model');
var Monitor = model.Monitor;

var log = require('../logger.js');

module.exports.getMonitors = function (req, res) {
	log.info("Get monitors called");

    var query;
    if(req.user.admin) {
        query = req.params.user ? { user: req.params.user } : null;
    } else {
        query = { user: req.user._id };
    }

	Monitor.find(query, function (err, monitors) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		return res.send(monitors);
	});
}

module.exports.getMonitor = function (req, res) {
	log.info("Get monitor called");

	Monitor.findOne({ _id: req.params.id }, function(err, monitor) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!monitor) return res.send(404);
        if(!req.user.admin && !monitor.user.equals(req.user._id)) return res.send(401);

		return res.send(monitor);
	});
}

module.exports.postMonitor = function (req, res) {
	log.info("Post monitor called");

	var monitor = new Monitor({
		name: req.params.name,
		url: req.params.url,
		user: req.user.admin ? req.params.user : req.user._id
	});

	monitor.save(function (err, monitor) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		var job = new model.Job({
			monitor: monitor._id,
			name: 'urlStatusCheck',
			nextRunAt: Date.now(),
			repeatInterval: req.params.repeatInterval,
            user: monitor.user
		});

		job.save(function (err, job) {
			if (err) {
				log.info(err);
				return res.send(err);
			};

			return res.send(201, monitor);
		});
	});
}

module.exports.putMonitor = function (req, res) {
	log.info("Put monitor called");

	Monitor.findOne({ _id: req.params.id }, function(err, monitor) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!monitor) return res.send(404);
        if(!req.user.admin && !monitor.user.equals(req.user._id)) return res.send(401);

		if(req.params.state != null) {
			monitor.state = req.params.state;
		}

		if(req.params.status != null) {
			monitor.status = req.params.status;
		}

		monitor.save(function (err, monitor) {
			if (err) {
				log.info(err);
				return res.send(err);
			};

			return res.send(monitor);
		});
	});
}

module.exports.deleteMonitor = function (req, res) {
	log.info("Delete monitor called");

	Monitor.findOne({ _id: req.params.id }, function(err, monitor) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!monitor) return res.send(404);
        if(!req.user.admin && !monitor.user.equals(req.user._id)) return res.send(401);

		monitor.remove(function(err){
			if (err) {
				log.info(err);
				return res.send(err);
			};

			return res.send(204);
		});
	});
}
