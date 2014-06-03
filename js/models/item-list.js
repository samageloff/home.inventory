var App = App || {};

App.ItemListModel = Backbone.Model.extend({
  defaults: {
    title: '',
    category: '',
    description: '',
    slug: '',
    image: '',
    quantity: 0,
    value: 0
  },

  initialize: function() {
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});