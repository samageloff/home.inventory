var App = App || {};

App.NewItemModel = Backbone.Model.extend({

  urlRoot: 'api/items/',

  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: '',
    quantity: 0,
    value: 0
  },

  validate: function(attributes) {
    if (attributes.title === '') {
      return 'Item requires a title'
    }
  },

  initialize: function() {
    this.on('change', function() {
      console.log('- Values for this model have changed.');
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