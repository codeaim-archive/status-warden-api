var model = require('status-warden-model');
var MonitorEvent = model.MonitorEvent;

var log = require('../logger.js');

module.exports.getMonitorEvents = function (req, res) {
	log.info("Get monitor events called");

    var query;
    if(req.user.admin) {
        MonitorEvent.find(req.params.monitor ? { monitor: req.params.monitor } : null, function (err, monitorEvents) {
            if (err) {
                log.info(err);
                return res.send(err);
            };

            return res.send(monitorEvents);
        });
    } else {
        model.Monitor.findOne({ _id: req.params.monitor }, function(err, monitor) {
            if (err) {
                log.info(err);
                return res.send(err);
            };
            if (!monitor) return res.send(404);
            if(!monitor.user.equals(req.user._id)) return res.send(401);

            MonitorEvent.find({ monitor: monitor._id }, function (err, monitorEvents) {
                if (err) {
                    log.info(err);
                    return res.send(err);
                };

                return res.send(monitorEvents);
            });
        });
    }
}

module.exports.getMonitorEvent = function (req, res) {
	log.info("Get monitor event called");

	MonitorEvent.findOne({ _id: req.params.id }, function (err, monitorEvent) {
		if (err) {
			log.info(err);
			return res.send(err);
		};
		if (!monitorEvent) return res.send(404);
        if(!req.user.admin && !monitorEvent.user.equals(req.user._id)) return res.send(401);

		return res.send(monitorEvent);
	});
}

module.exports.postMonitorEvent = function (req, res) {
	log.info("Post monitor event called");

	var monitorEvent = new MonitorEvent({
        confirmed: req.params.confirmed,
		monitor: req.params.monitor,
		responseTime:  req.params.responseTime,
        status: req.params.status,
		statusCode: req.params.statusCode,
        user: req.params.user
	});

	monitorEvent.save(function (err, monitorEvent) {
		if (err) {
			log.info(err);
			return res.send(err);
		};

		return res.send(201, monitorEvent);
	});
}
