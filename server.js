// Module dependencies.
var application_root = __dirname,
    express = require('express'),
    routes = require('./app/routes'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    config = require('./app/config');

// Create server
var app = express();

// Configure server
app.configure(function() {
  app.set('port', process.env.PORT || config.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.methodOverride());
  app.use(express.logger('dev'));
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.static(__dirname));
  app.use(app.router);
});

// Development only
app.configure('development', function() {
  app.use(express.errorHandler());
});

// Connect to database
mongoose.connect('mongodb://localhost/inventory_database');
mongoose.connection.on('open', function() {
  console.log("Connected to Mongoose...");
});

// Routes list:
routes.initialize(app);

// Boot up the server:
app.listen(app.get('port'), function() {
  console.log('Server up: http://localhost:' + app.get('port'));
});