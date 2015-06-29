var restify = require('restify');
var mongoose = require('mongoose');

var config = require('./config.js');
var log = require('./logger.js');
var seed = require('./seed.js');

log.info('Connecting to database ' + config.DATABASE_CONNECTION_STRING);
mongoose.connect(config.DATABASE_CONNECTION_STRING, function(err) {
    if (err) {
        log.info('Status warden database not available. Start status warden database and restart application to connect');
        return;
    };

    log.info('Connected to database ' + config.DATABASE_CONNECTION_STRING);

    var authController = require('./controller/auth.js');
    var jobController = require('./controller/job.js');
    var monitorController = require('./controller/monitor.js');
    var monitorEventController = require('./controller/monitorEvent.js');
    var userController = require('./controller/user.js');

    var server = restify.createServer();

    server.use(restify.queryParser());
    server.use(restify.bodyParser());
    server.use(restify.CORS());
    server.use(restify.fullResponse());

    server.get('/auth/token', authController.getToken);

    server.get('/job', authController.authenticate, authController.isAdmin, jobController.getJobs);
    server.get('/job/:id', authController.authenticate, authController.isAdmin, jobController.getJob);
    server.post('/job', authController.authenticate, authController.isAdmin, jobController.postJob);
    server.put('/job/:id', authController.authenticate, authController.isAdmin, jobController.putJob);
    server.del('/job/:id', authController.authenticate, authController.isAdmin, jobController.deleteJob);

    server.get('/monitor', authController.authenticate, monitorController.getMonitors);
    server.get('/monitor/:id', authController.authenticate, monitorController.getMonitor);
    server.post('/monitor', authController.authenticate, monitorController.postMonitor);
    server.put('/monitor/:id', authController.authenticate, monitorController.putMonitor);
    server.del('/monitor/:id', authController.authenticate, monitorController.deleteMonitor);

    server.get('/monitorEvent', authController.authenticate, monitorEventController.getMonitorEvents);
    server.get('/monitorEvent/:id', authController.authenticate, monitorEventController.getMonitorEvent);
    server.post('/monitorEvent', authController.authenticate, authController.isAdmin, monitorEventController.postMonitorEvent);

    server.get('/user', authController.authenticate, userController.getUsers);
    server.get('/user/:id', authController.authenticate, userController.getUser);
    server.post('/user', userController.postUser);
    server.del('/user/:id', authController.authenticate, userController.deleteUser);

    seed.start().then(function() {
        log.info('Server listening on port ' + config.API_PORT + ' for requests');
        server.listen(config.API_PORT);
        log.info('Status warden api started');
    });
});


