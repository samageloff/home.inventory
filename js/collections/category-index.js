var App = App || {};

App.CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: App.CategoryIndexModel,

  initialize: function() {
    this.on('reset', this.render, this);
    this.on('remove', this.render, this);
  }

});