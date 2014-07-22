// Module dependencies.
var application_root = __dirname,
    express = require('express'),
    routes = require('./app/routes'),
    http = require('http'),
    path = require('path'),
    config = require('./app/imager'),
    mongoose = require('mongoose');

// Create server
var app = express();

// Configure server
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'hjs');
app.use(express.static(__dirname));
app.use(express.methodOverride());
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(app.router);

// Development only
app.configure('development', function() {
  app.use(express.errorHandler());
});

if (app.settings.env === 'development') process.env.NODE_ENV = 'development';

// Connect to database
// mongoose.connect('mongodb://localhost/inventory_database');
mongoose.connect('mongodb://sageloff:Y4.t3.r2@kahana.mongohq.com:10092/app27522078');
mongoose.connection.on('open', function() {
  console.log("Connected to Mongoose...");
});

// Routes list:
routes.initialize(app);

// Boot up the server:
http.createServer(app).listen(app.get('port'), function() {
  console.log('Server up: http://localhost:' + app.get('port'));
});