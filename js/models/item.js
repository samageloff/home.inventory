var app = app || {};

app.Item = Backbone.Model.extend({

  defaults: {
    title: '',
    coverImage: 'img/150x150.gif',
    category: '',
    itemImage: '',
    itemValue: 0,
    tags: ''
  },

  validate: function(attributes) {

    if (attributes.title === '') {
      return 'Remember to set a title for your item'
    }

  },

  initialize: function() {

    this.on('change', function() {
      console.log('- Values for this model have changed.');
      console.log(this);
    });

    this.on('invalid', function(model, error) {
      console.log(error);
    });

  },

  parse: function(response) {

    response.id = response._id;
    return response;

  }

});