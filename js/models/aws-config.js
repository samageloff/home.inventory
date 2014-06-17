var App = App || {};

App.AwsConfigModel = Backbone.Model.extend({

  urlRoot: 'uploads/config',

  defaults: {
    aws_bucket: '',
    host: '',
    aws_key: ''
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});