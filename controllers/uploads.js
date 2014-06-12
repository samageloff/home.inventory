var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    models = require('../app/models');

module.exports = {

  upload: function(request, response) {
    console.log(JSON.stringify(request.files));
  }

}