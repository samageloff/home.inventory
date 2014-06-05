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

  validate: function(attrs) {
    var errors = [];

    if (!attrs.title) {
      errors.push({name: 'title', message: 'Please give it a title'});
    }
    if (!attrs.category) {
      errors.push({name: 'category', message: 'Please give it a category'});
    }

    return errors.length > 0 ? errors : false;
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