// Module dependencies.
var application_root = __dirname,
  express = require('express'), //Web framework
  path = require('path'), //Utilities for dealing with file paths
  mongoose = require('mongoose'); //MongoDB integration

//Create server
var app = express();

// Configure server
app.configure(function() {

  console.log(application_root)

  //parses request body and populates request.body
  app.use(express.bodyParser());

  //checks request.body for HTTP method overrides
  app.use(express.methodOverride());

  //Where to serve static content
  app.use(express.static(__dirname));

  //perform route lookup based on url and HTTP method
  app.use(app.router);

  //Show all errors in development
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
app.get('/api', function(request, response) {
  response.send('Library API is runnings');
});

// Get a list of all items
app.get('/api/items', function(request, response) {
  return ItemModel.find(function(err, items) {
    if(!err) {
        return response.send(items);
    } else {
        return console.log(err);
    }
  });
});

//Get a single item by id
app.get('/api/items/:id', function(request, response) {
  return ItemModel.findById(request.params.id, function(err, item) {
    if(!err) {
        return response.send(item);
    } else {
        return console.log(err);
    }
  });
});

// Insert an item
app.post('/api/items', function(request, response) {
  var item = new ItemModel({
      date: request.body.date,
      title: request.body.title,
      category: request.body.category,
      itemImage: request.body.itemImage,
      value: request.body.value,
      tags: request.body.tags
  });
  item.save(function(err) {
    if(!err) {
        console.log('app post', item);
        return console.log('created');
    } else {
        return console.log(err);
    }
  });
  return response.send(item);
});

// Update an item
app.put('/api/items/:id', function(request, response) {
  console.log('Updating item ' + request.body.title);
  return ItemModel.findById(request.params.id, function(err, item) {
    item.title = request.body.title;
    item.category = request.body.category;
    item.date = request.body.date;
    item.itemImage = request.body.itemImage;
    item.value = request.body.value;
    item.tags = request.body.tags;

    return item.save(function(err) {
      if(!err) {
          console.log('app put', item);
          console.log('item updated');
      } else {
          console.log(err);
      }
      return response.send(item);
    });
  });
});

//Delete an item
app.delete('/api/items/:id', function(request, response) {
  console.log('Deleting item with id: ' + request.params.id);
  return ItemModel.findById(request.params.id, function(err, item) {
    return item.remove(function(err) {
      if(!err) {
          console.log('Item removed');
          return response.send('');
      } else {
          console.log(err);
      }
    });
  });
});

// Get a list of categies
app.get('/api/categories', function(request, response) {
   console.log('Get all categories: ');
   return ItemModel.find().distinct('category', function(err, items) {
    if(!err) {
      return response.send(items);
    } else {
      return console.log(err);
    }
  });
});


// Get a list of items by category
app.get('/api/category/:name', function(request, response) {
   console.log('Searching item with category: ' + request.params.name);
   return ItemModel.find({ category: request.params.name }, function(err, items) {
    if(!err) {
      return response.send(items);
    } else {
      return console.log(err);
    }
  });
});

// Start server
var port = 3001;
app.listen(port, function() {
  console.log('Express server listening on port %d in %s mode', port, app.settings.env);
});

// Connect to database
mongoose.connect('mongodb://localhost/inventory_database');

// Schemas
var Item = new mongoose.Schema({
  date: Date,
  title: String,
  category: String,
  itemImage: String,
  value: Number,
  tags: [ Tags ]  // reference to schema below
});

var Tags = new mongoose.Schema({
  tag: String
});

// Models
var ItemModel = mongoose.model('Item', Item);

