var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    models = require('../app/models');

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
    var item = new models.ItemModel;
        item.title = request.body.title;
        item.category = request.body.category;
        item.description = request.body.description;
        item.slug = request.body.slug;
        item.value = request.body.value;
        item.quantity = request.body.quantity;

    console.log("FILES", request.files);

    // item.attach('image', request.files.image, function(err) {
    //   if(err) return next(err);
    //   item.save(function(err) {
    //     if(err) return next(err);
    //     response.send('Post has been saved with file!');
    //   });
    // });

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
  update: function(request, response) {
    console.log('Updating item ' + request);
    return models.ItemModel.findById(request.params.id, function(err, item) {
      item.title = request.body.title;
      item.category = request.body.category;
      item.description = request.body.description;
      item.slug = request.body.slug;
      item.value = request.body.value;
      item.quantity = request.body.quantity;

      // item.attach('image', request.files.image, function(err) {
      //   if(err) return next(err);
      //   item.save(function(err) {
      //     if(err) return next(err);
      //     response.send('Post has been saved with file!');
      //   });
      // });

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
      return item.remove(function(err) {
        if(!err) {
            console.log('Item removed');
            return response.send('');
        } else {
            console.log(err);
        }
      });
    });
  }

}