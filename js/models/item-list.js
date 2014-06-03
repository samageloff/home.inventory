var App = App || {};

App.ItemListModel = Backbone.Model.extend({
  defaults: {
    title: '',
    category: '',
    slug: '',
    image: '',
    value: 0
  },

  initialize: function() {
  },

  parse: function(response) {
    response.id = response._id;
    return response;
  }
});