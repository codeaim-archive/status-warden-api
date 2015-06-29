var Job = require('status-warden-model').Job;

var log = require('../logger.js');

module.exports.getJobs = function (req, res) {
	log.info("Get jobs called");

	Job.find(req.params.monitor ? { monitor: req.params.monitor } : null, function (err, jobs) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		return res.send(jobs);
	});
}

module.exports.getJob = function (req, res) {
	log.info("Get job called");

	Job.findOne({ _id: req.params.id }, function(err, job) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!job) return res.send(404);

		return res.send(job);
	});
}

module.exports.postJob = function (req, res) {
	log.info("Post job called");

	var job = new Job({
		name: req.params.name,
		nextRunAt: req.params.nextRunAt,
		repeatInterval: req.params.repeatInterval,
		monitor: req.params.monitor,
        user: req.params.user
	});

	job.save(function (err, job) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		return res.send(201, job);
	});
}

module.exports.putJob = function (req, res) {
	log.info("Put job called");

	Job.findOne({ _id: req.params.id }, function(err, job) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!job) return res.send(404);

		if(req.params.nextRunAt != null) {
			job.nextRunAt = req.params.nextRunAt;
		}

		if(req.params.repeatInterval != null) {
			job.repeatInterval = req.params.repeatInterval;
		}

		job.save(function (err, job) {
			if (err) {
				log.info(err);
				return res.send(err);
			};

			return res.send(job);
		});
	});
}

module.exports.deleteJob = function (req, res) {
	log.info("Delete job called");

	Job.findOne({ _id: req.params.id }, function(err, job) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!job) return res.send(404);

		job.remove(function(err) {
			if (err) {
			log.info(err);
			return res.send(err);
		};

			return res.send(204);
		});
	});
}
