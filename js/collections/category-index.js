var CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: CategoryIndexModel
});