// Module dependencies.
var application_root = __dirname,
    express = require('express'),
    path = require('path'),
    routes = require('./app/routes'),
    mongoose = require('mongoose'),
    upload = require('jquery-file-upload-middleware');

// Create server
var app = express();

// configure upload middleware
upload.configure({
  uploadDir: __dirname + '/public/uploads',
  uploadUrl: '/uploads',
  imageVersions: {
    thumbnail: {
      width: 80,
      height: 80
    }
  }
});

// Start server
app.set('port', process.env.PORT || 3001);

// Configure server
app.configure(function() {
  app.use('/upload', upload.fileHandler());
  app.use(express.methodOverride());
  app.use(express.logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded());
  app.use(express.static(__dirname));
  app.use(app.router);
});

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
  }));
};

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