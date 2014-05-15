var CategoryIndexCollection = Backbone.Collection.extend({
  url: 'api/categories',
  model: CategoryIndexModel,

  initialize : function (options) {
    this.options = options || {};
  }
});
