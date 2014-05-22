var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

// Item Schema
var Item = new Schema({
  slug: String,
  count: Number,
  date: Date,
  title: String,
  category: String,
  image: String,
  value: Number
});

// Models
module.exports = {
  ItemModel: mongoose.model('Item', Item)
};
