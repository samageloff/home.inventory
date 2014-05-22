var models = require('../app/models');

module.exports = {

  // Get'r running
  index: function(req, res) {
    res.send('Inventory API is runnings');
  },

  // List all items
  items: function(req, res) {
    models.ItemModel.find(function(err, items) {
      if(!err) {
          return res.send(items);
      } else {
          return console.log(err);
      }
    });
  },

  // Single item by id
  itemsById: function(req, res) {
    models.ItemModel.findById(req.params.id, function(err, item) {
      if(!err) {
        return res.send(item);
      } else {
        return console.log(err);
      }
    });
  },

  // Insert an item
  insert: function(req, res) {
    var item = new ItemModel({
        date: req.body.date,
        title: req.body.title,
        category: req.body.category,
        slug: function() {
          return req.body.category
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-');
        },
        itemImage: req.body.itemImage,
        value: req.body.value,
        tags: req.body.tags
    });
    item.save(function(err) {
      if(!err) {
        console.log('app post', item);
        return console.log('created');
      } else {
        return console.log(err);
      }
    });
    return res.send(item);
  },

  // Update an item
  update: function(req, res) {
    console.log('Updating item ' + req.body.title);
    models.ItemModel.findById(req.params.id, function(err, item) {
      item.title = req.body.title;
      item.category = req.body.category;
      item.slug = req.body.slug;
      item.date = req.body.date;
      item.itemImage = req.body.itemImage;
      item.value = req.body.value;
      item.tags = req.body.tags;

      return item.save(function(err) {
        if(!err) {
          console.log('app put', item);
          console.log('item updated');
        } else {
          console.log(err);
        }
        return res.send(item);
      });
    });
  },

  // Delete an item
  delete: function(req, res) {
    console.log('Deleting item with id: ' + req.params.id);
    models.ItemModel.findById(req.params.id, function(err, item) {
      return item.remove(function(err) {
        if(!err) {
          console.log('Item removed');
          return res.send('');
        } else {
          console.log(err);
        }
      });
    });
  },

  // Get a list of items by category
  catByName: function(req, res) {
    console.log('Searching item with category: ' + req.params.name);
    models.ItemModel.find({ slug: req.params.name }, function(err, items) {
      if(!err) {
        return res.send(items);
      } else {
        return console.log(err);
      }
    });
  },

  // Get a list of categories + counts
  categories: function(req, res) {
    console.log('Get all categories + counts');
    models.ItemModel.aggregate({
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    function(err, items) {
      if(!err) {
        return res.send(items);
      }
      else {
        return console.log(err);
      }
    });
  }
}