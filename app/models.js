var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    upload = require('jquery-file-upload-middleware');

// Item Schema
var Item = new mongoose.Schema({
  slug: String,
  count: Number,
  description: String,
  date: Date,
  title: String,
  category: String,
  value: Number
});

// Models
module.exports = {
  ItemModel: mongoose.model('Item', Item)
};
