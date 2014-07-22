var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    models = require('../app/models'),
    config = require('../app/imager'),
    Imager = require('../client/plugins/node.imager');

module.exports = {

  // Get Home Data
  home: function(request, response) {
    return models.ItemModel.aggregate({
      $group: {
        _id: '$items',
        category: { $addToSet: '$category' },
        value: { $sum: "$value" },
        count: { $sum: 1 }
      }
    },
    function(err, items) {
      if(!err) {
        return response.send(items);
      }
      else {
        return console.log(err);
      }
    });
  },

  // Get all items
  all: function(request, response) {
    return models.ItemModel.find(function(err, items) {
      if(!err) {
          return response.send(items);
      } else {
          return console.log(err);
      }
    });
  },

  // Retrieve a single item
  single: function(request, response) {
    console.log('getting item with id', request.params.id)
    return models.ItemModel.findById(request.params.id, function(err, item) {
      if(!err) {
        return response.send(item);
      } else {
        return console.log(err);
      }
    });
  },

  // Get a list of categories + counts
  categories: function(request, response) {
    console.log('Get all categories + counts');
    return models.ItemModel.aggregate({
      $group: {
         _id: '$category',
        slug: { $first: '$slug' },
        value: { $sum: "$value" },
        count: { $sum: 1 },
      }
    },
    function(err, items) {
      if(!err) {
        return response.send(items);
      }
      else {
        return console.log(err);
      }
    });
  },

  // Get a list of items by category
  category: function(request, response) {
    console.log('Searching item with category: ' + request.params.name);
    return models.ItemModel.find({ slug: request.params.name }, function(err, items) {
      if(!err) {
        return response.send(items);
      } else {
        return console.log(err);
      }
    });
  },

  // Insert an item
  insert: function(request, response) {
    console.log('Insert item ' + request);
    var item = new models.ItemModel;
        item.title = request.body.title;
        item.category = request.body.category;
        item.description = request.body.description;
        item.slug = request.body.slug;
        item.value = request.body.value;
        item.quantity = request.body.quantity;
        item.image = request.body.image;

    item.save(function(err) {
      if(!err) {
          console.log('app post', item);
          return console.log('created');
      } else {
          return console.log(err);
      }
    });
    return response.send(item);
  },

  // Update an item
  update: function(request, response, next) {
    console.log('Updating item ' + request.params.id, request.body.title);
    return models.ItemModel.findById(request.params.id, function(err, item) {
      if (err) return next(err);
      if (!item) return response.send(404, "Hi, there was an error." );

      item.title = request.body.title;
      item.category = request.body.category;
      item.description = request.body.description;
      item.image = request.body.image;
      item.slug = request.body.slug;
      item.value = request.body.value;
      item.quantity = request.body.quantity;

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
  },

  // Delete an item
  delete: function(request, response) {
    console.log('Deleting item with id: ' + request.params.id);
    return models.ItemModel.findById(request.params.id, function(err, item) {
      if (err) return next(err);
      if (!item) return response.send(404, "Hi, there was an error." );
      return item.remove(function(err) {
        if(!err) {
            console.log('Item removed');
            return response.send('');
        } else {
            console.log(err);
        }
      });
    });
  },

  upload: function(request, response) {
    var imager = new Imager(config, 'S3') // 'Rackspace' or 'S3'
    imager.upload([request.files.image], function (err, cdnUri, uploaded) {
      if (err) return response.send(err.toString());
      response.send(JSON.stringify({
        cdnUri: cdnUri,
        uploaded: uploaded
      }))
    }, 'items')
  },

  remove: function(request, response) {
    var imager = new Imager(config, 'S3'); // 'Rackspace' or 'S3';
    var files = request.params.id;

    console.log('getting item with id', request.params.id);

    imager.remove(files, function (err) {
      response.send(files)
    }, 'items')
  },

  autocomplete: function(request, response) {
    return models.ItemModel.aggregate({
      $group: {
        _id: '$items',
        suggestions: { $addToSet: {value: '$category'} }
      }
    },
    function(err, items) {
      if(!err) {
        return response.send(items[0]);
      }
      else {
        return console.log(err);
      }
    });
  }

}