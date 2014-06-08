var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    attachments = require('mongoose-attachments-aws2js');

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

Item.plugin(attachments, {
  directory: 'items',
    storage: {
      providerName: 's3',
      options: {
      key: 'AKIAIVMUQQMNKWAIBROQ',
      secret: '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',
      bucket: 'home-inventory-items'
    }
  },
  properties: {
    image: {
      styles: {
        original: {
          // keep the original file
        },
        small: {
          resize: '150x150'
        },
        medium: {
          resize: '120x120'
        },
        medium_jpg: {
          '$format': 'jpg' // this one changes the format of the image to jpg
        }
      }
    }
  }
});

// Models
module.exports = {
  ItemModel: mongoose.model('Item', Item)
};
