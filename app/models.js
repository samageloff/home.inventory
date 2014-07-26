var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Item Schema
var Item = mongoose.Schema({
  category: String,
  count: Number,
  date: Date,
  description: String,
  image: [],
  slug: String,
  title: String,
  quantity: Number,
  value: Number
});

// Models
module.exports = {
  ItemModel: mongoose.model('Item', Item)
};