var App = App || {};

App.HomeCollection = Backbone.Collection.extend({
  url: 'api/home',
  model: App.CategoryIndexModel
});