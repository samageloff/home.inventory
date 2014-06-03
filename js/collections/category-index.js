var App = App || {};

App.CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: App.CategoryIndexModel
});