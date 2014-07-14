var App = App || {};

App.NewItemModel = Backbone.Model.extend({

  urlRoot: 'api/items/',

  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: [],
    quantity: 0,
    value: 0
  },

  validation: {
    title: {
      required: true,
      msg: 'Please enter a title.'
    },
    category: {
      required: true,
      msg: 'Please enter a category.'
    },
    value: {
      pattern: 'digits',
      msg: 'Please. Numbers only.'
    }
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});