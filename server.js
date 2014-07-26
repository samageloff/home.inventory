require('newrelic');


// Module dependencies.
var application_root = __dirname,
    express = require('express'),
    http = require('http'),
    routes = require('./app/routes'),
    config = require('./app/imager'),
    mongoose = require('mongoose');

// Create server
var app = express();

// Configure server
app.configure(function() {
  app.set('port', process.env.PORT || 3001);
  app.use(express.static(__dirname));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(app.router);
});

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