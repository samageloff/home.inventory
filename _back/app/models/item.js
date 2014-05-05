
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema


/**
 * Item schema
 */

var ItemSchema = new Schema({
  date: Date,
  title: String,
  category: String,
  itemImage: String,
  value: Number,
  tags: [ TagsSchema ]  // reference to schema below
})

var TagsSchema = new Schema({
  tag: String
})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

ItemSchema.method({

})

/**
 * Statics
 */

ItemSchema.static({

})

/**
 * Register
 */

mongoose.model('Item', ItemSchema);