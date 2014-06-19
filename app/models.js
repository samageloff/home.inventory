var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Item Schema
var Item = new mongoose.Schema({
  category: String,
  count: Number,
  date: Date,
  description: String,
  image: String,
  slug: String,
  title: String,
  quantity: Number,
  value: Number
});

// Models
module.exports = {
  ItemModel: mongoose.model('Item', Item)
};
